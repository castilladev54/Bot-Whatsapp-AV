const { addKeyword } = require("@bot-whatsapp/bot");
const { askAndRespond } = require("../services/geminiApi.js");
// Servicios y utilidades
const { validateField } = require("../utils/validationUtils.js");
const { buildEmergencyPrompt } = require("../utils/promptBuilder.js");
const { parseGeminiResponse } = require("../services/geminiServices.js");
const menuFlow=require("./menuFlow.js");
const flowConfirmarCita = require("./flowConfirmarCita.js");

const flowEmergenciaRest = addKeyword(["emergencia", "urgencia"], {
  sensitive: true,
})
  .addAnswer("¿Qué síntomas presenta tu animal de compañía y desde cuándo?", {
    capture: true,
  }, async (ctx, { state, fallBack }) => {
    const input = ctx.body.trim();
    if (!validateField(input)) return fallBack("❌ Por favor, describe los síntomas.");
    await state.update({ emergencyDescription: input });
  })
  .addAnswer("📍 ¿Desde dónde nos escribes o dónde se encuentra el paciente?", {
    capture: true,
  }, async (ctx, { state }) => {
    const input = ctx.body.trim();
    await state.update({ userLocation: input });
  })
  .addAnswer("🐾 ¿Qué especie es? (Perro, Gato, Ganado, Otro)", {
    capture: true,
  }, async (ctx, { state }) => {
    const input = ctx.body.trim();
    await state.update({ species: input });
  })
  .addAnswer("⚤ ¿Sexo? (Macho / Hembra)", {
    capture: true,
  }, async (ctx, { state }) => {
    const input = ctx.body.trim();
    await state.update({ patientGender: input });
  })
  .addAnswer("🎂 ¿Cuál es la *edad aproximada* de tu animal de compañía?", {
    capture: true,
  }, async (ctx, { state }) => {
    const input = ctx.body.trim();
    await state.update({ patientAge: input });
  })
  .addAnswer("📝 Entendido. ¿Cuál es el *nombre del paciente* (tu compañero)?", {
    capture: true,
  }, async (ctx, { state }) => {
    const input = ctx.body.trim();
    await state.update({ patientName: input });
  })
  .addAnswer("🙋‍♂️ ¿Con quién tenemos el gusto de conversar? (Tu nombre como tutor/responsable)", {
    capture: true,
  }, async (ctx, { state }) => {
    const input = ctx.body.trim();
    await state.update({ ownerName: input });
  })
  .addAnswer("📋 ¿Tu animal de compañía tiene *alguna condición médica previa* que debamos saber? (Escríbela o pon 'ninguna')", {
    capture: true,
  }, async (ctx, { state, flowDynamic, gotoFlow }) => {
    const input = ctx.body.trim();
    await state.update({ medicalHistory: input });

    const fullState = await state.getMyState();
    const prompt = buildEmergencyPrompt(fullState);

    await flowDynamic([
      `🔎 ¡Gracias, ${fullState.ownerName}! Analizando el caso de ${fullState.patientName || "tu mascota"}...`,
      { delay: 3000 }
    ]);

    try {
      const geminiResponse = await askAndRespond(prompt, `Consulta de ${fullState.ownerName}`);
      if (!geminiResponse?.trim()) {
        await flowDynamic("⚠️ No pude obtener una respuesta clara. Vuelve a intentarlo.");
        return gotoFlow(menuFlow);
      }

      const { evaluation, contactAndPricing, nextStepsPrompt } = parseGeminiResponse(geminiResponse);

      await flowDynamic("🔍 NUESTRA EVALUACIÓN Y LO QUE RECOMENDAMOS");
      await flowDynamic(evaluation);

      await flowDynamic("📞 INFORMACIÓN DE CONTACTO");
      await flowDynamic(contactAndPricing);

      await flowDynamic("🔜 PRÓXIMOS PASOS");
      await flowDynamic(nextStepsPrompt);

    } catch (error) {
      console.error("🚨 Error en Gemini:", error.message);
      await flowDynamic([
        "⚠️ *Error en el sistema*",
        "Por favor contacta directamente:",
        "📞 0424-555-5555",
        "📍 Ocumare del Tuy, Calle Sucre"
      ]);
      await state.clear();
      return gotoFlow(menuFlow);
    }
  })
  .addAction(
   { capture: true },
  async (ctx, { gotoFlow, fallBack, flowDynamic, state }) => {
    try {
      const msg = ctx.body.trim();
      const fullState = await state.getMyState();

      // Validación de nombre de mascota
      if (!fullState.patientName) {
        await flowDynamic("⚠️ No hemos registrado el nombre de tu mascota. Volviendo al inicio.");
        return gotoFlow(flowBienvenida);
      }
      
      if (msg === "1") {
        await flowDynamic("🚀 ¡Perfecto! Vamos a agendar tu cita.");
         return gotoFlow(flowConfirmarCita);
      } 
      
      if (msg === "2") {
        await flowDynamic("🏡 Volviendo al menú principal...");
        await state.clear();
        return gotoFlow(menuFlow);
      }

      return fallBack("❌ Opción no válida. Por favor escribe *1* o *2*.");
    } catch (error) {
      console.error("Error en addAction:", error);
      
    }
  }
)



module.exports = flowEmergenciaRest;