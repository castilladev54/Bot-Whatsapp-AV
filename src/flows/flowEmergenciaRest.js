// 📁 src/flows/flowEmergenciaDetallada.js
const { addKeyword } = require("@bot-whatsapp/bot");
const { askAndRespond } = require("../services/geminiApi.js");
const flowAgendar = require("./flowAgendar.js");
const menuFlow = require("./menuFlow.js");

// ✅ Función para extraer secciones del texto de Gemini
// Función parseGeminiResponse CORREGIDA
function parseGeminiResponse(response) {
  // Usamos regex más tolerantes con espacios
  const evalMatch = response.match(
    /NUESTRA EVALUACIÓN Y LO QUE RECOMENDAMOS\s*([\s\S]*?)\s*INFORMACIÓN DE PRECIO Y CONTACTO/i
  );
  const priceMatch = response.match(
    /INFORMACIÓN DE PRECIO Y CONTACTO\s*([\s\S]*?)\s*PRÓXIMO PASOS/i
  );
  const nextStepsMatch = response.match(/PRÓXIMO PASOS\s*([\s\S]*)/i);

  return {
    evaluation: evalMatch?.[1]?.trim() || "No se pudo extraer la evaluación.",
    priceInfo:
      priceMatch?.[1]?.trim() ||
      "No se pudo extraer la información de precios.",
    nextSteps:
      nextStepsMatch?.[1]?.trim() ||
      "⏳",
  };
}

// ✅ Prompt personalizado para casos de emergencia
const buildEmergencyPrompt = (data) => {
  const {
    ownerName = "dueño(a)",
    userLocation = "ubicación no especificada",
    emergencyDescription = "No indicada",
    species = "No indicada",
    patientAge = "No indicada",
    patientGender = "No indicado",
    medicalHistory = "No especificado",
    patientName = "tu mascota",
  } = data;

  // 🐾 Determinar emoji según especie
  let speciesEmoji = "🐾";
  const lower = species.toLowerCase();
  if (lower.includes("perro")) speciesEmoji = "🐶";
  else if (lower.includes("gato")) speciesEmoji = "🐱";
  else if (lower.includes("ave")) speciesEmoji = "🦜";
  else if (lower.includes("conejo")) speciesEmoji = "🐰";
  else if (lower.includes("ganado")) speciesEmoji = "🐎";
  else if (lower.includes("hamster") || lower.includes("roedor")) speciesEmoji = "🐹";

  return `
Eres *Asistavet*, un asistente veterinario virtual de la clínica Asistavet de Venezuela C.A., ubicada en Ocumare del Tuy. Tu objetivo es evaluar la situación de la mascota y guiar al usuario hacia la mejor acción posible, priorizando la salud del animal y la eficiencia del servicio.

El usuario, ${ownerName}, ha proporcionado la siguiente información:
- **Síntomas detallados:** "${emergencyDescription}"
- **Ubicación actual:** "${userLocation}"
- **Especie:** "${species}"
- **Edad aproximada:** "${patientAge}"
- **Sexo:** "${patientGender}"
- **Nombre del paciente:** "${patientName}"
- **Historial médico previo:** "${medicalHistory}"

Tu respuesta debe ser empática, clara, no técnica y con el siguiente formato:

NUESTRA EVALUACIÓN Y LO QUE RECOMENDAMOS  
INFORMACIÓN DE PRECIO Y CONTACTO  
PRÓXIMO PASOS

1. *NUESTRA EVALUACIÓN Y LO QUE RECOMENDAMOS:*  
Una frase sencilla sobre lo que parece estar ocurriendo. Sin tecnicismos.

2. *INFORMACIÓN DE PRECIO Y CONTACTO:*  
- Si el usuario está en los Valles del Tuy (Ocumare, Santa Teresa, etc): "Te recomendamos dirigirte sin demora a nuestra sede en *Ocumare del Tuy, Calle Sucre (Ppal del Calvario), frente al Pez que fuma*."
- Si es Caracas o lejana: "Podemos enviar un equipo a domicilio. Lo coordinaremos por llamada."

3. *PRÓXIMO PASOS:*  
1️⃣ Para AGENDAR CITA  
2️⃣ Para VOLVER AL MENÚ  
¡Gracias ${ownerName}! Por confiar en nosotros para cuidar a ${patientName} ${speciesEmoji}.
`;
};

// 🧠 Flujo principal de emergencia
const flowEmergenciaDetallada = addKeyword(["emergencia", "urgencia"], { sensitive: true })
  .addAnswer("¡Hola! Soy un Asistente 🤖 ¿Qué síntomas presenta tu animal de compañía y desde cuándo?", { capture: true }, async (ctx, { state, fallBack }) => {
    if (!ctx.body?.trim()) {
      return fallBack("❌ Por favor, describe los síntomas de tu compañero.");
    }
    await state.update({ emergencyDescription: ctx.body.trim() });
  })
  .addAnswer("📍 ¿Desde dónde nos escribes o dónde se encuentra el paciente?", { capture: true }, async (ctx, { state }) => {
    await state.update({ userLocation: ctx.body.trim() });
  })
  .addAnswer("🐾 ¿Qué especie es? (Perro, Gato, Ganado, Otro)", { capture: true }, async (ctx, { state }) => {
    await state.update({ species: ctx.body.trim() });
  })
  .addAnswer("⚤ ¿Sexo? (Macho / Hembra)", { capture: true }, async (ctx, { state }) => {
    await state.update({ patientGender: ctx.body.trim() });
  })
  .addAnswer("🎂 ¿Cuál es la *edad aproximada* de tu animal de compañía?:", { capture: true }, async (ctx, { state }) => {
    await state.update({ patientAge: ctx.body.trim() });
  })
  .addAnswer("📝 Entendido. ¿Cuál es el *nombre del paciente* (tu compañero", { capture: true }, async (ctx, { state }) => {
    await state.update({ patientName: ctx.body.trim() });
  })
  .addAnswer("🙋‍♂️ ¿Con quién tenemos el gusto de conversar? (Tu nombre como tutor/responsable", { capture: true }, async (ctx, { state }) => {
    await state.update({ ownerName: ctx.body.trim() });
  })
  .addAnswer(
    "📋 ¿Tu animal de compañía tiene *alguna condición médica previa* que debamos saber? (Escríbela o pon 'ninguna')",
    { capture: true },
    async (ctx, { state, flowDynamic, gotoFlow }) => {
      // `flowDynamic` is correctly destructured here
      await state.update({ medicalHistory: ctx.body.trim() });

      const fullState = await state.getMyState();
      const promptToGemini = buildEmergencyPrompt(fullState);

      // Initial loading message
      await flowDynamic([
        `🔎 ¡Gracias, ${fullState.ownerName}! Analizando el caso de ${
          fullState.patientName || "tu mascota"
        }...`,
        { delay: 3000 },
      ]);

      try {
        const geminiResponse = await askAndRespond(
          promptToGemini,
          `Consulta de ${fullState.ownerName}`
        );

        console.log("Respuesta cruda de Gemini:", geminiResponse);

        if (!geminiResponse?.trim()) throw new Error("Respuesta vacía");

        const { evaluation, priceInfo, nextSteps } =
          parseGeminiResponse(geminiResponse);

        console.log("Datos parseados:", { evaluation, priceInfo, nextSteps });

        // Sending all AI-generated information
        await flowDynamic("📋 *Evaluación veterinaria:*");
        await flowDynamic(evaluation);
        await flowDynamic("💵 *Información de costos:*");
        await flowDynamic(priceInfo);
        await flowDynamic("➡️ *¿Qué sigue?*");
        await flowDynamic(nextSteps);

        // No return gotoFlow here to allow the flow to proceed to the next chained addAnswer.
      } catch (error) {
        console.error("Error completo:", {
          error: error.message,
          stack: error.stack,
        });
        await flowDynamic([
          "⚠️ *Error en el sistema*",
          "Por favor contacta directamente:",
          "📞 0424-555-5555",
          "📍 Ocumare del Tuy, Calle Sucre",
        ]);
        return gotoFlow(menuFlow); // Exit to menu on error
      }
    }
  )
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
        return gotoFlow(flowAgendar);
      } 
      
      if (msg === "2") {
        await flowDynamic("🏡 Volviendo al menú principal...");
        return gotoFlow(menuFlow);
      }

      return fallBack("❌ Opción no válida. Por favor escribe *1* o *2*.");
    } catch (error) {
      console.error("Error en addAction:", error);
      await flowDynamic("🔴 Error inesperado. Redirigiendo al menú principal...");
      return gotoFlow(menuFlow);
    }
  }
)

module.exports= flowEmergenciaDetallada;