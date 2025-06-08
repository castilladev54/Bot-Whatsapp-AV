// 📁 src/flows/flowEmergenciaDetallada.js
const { addKeyword, gotoFlow } = require("@bot-whatsapp/bot");
const { askAndRespond } = require("../services/geminiApi.js");
const flowAgendar = require("./flowAgendar.js"); // Necesario para redirigir
const menuFlow = require("./menuFlow.js"); // Necesario para redirigir

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
      "Por favor escribe *AGENDAR* para programar una cita.",
  };
}

// 🧠 Función para construir el prompt completo y dinámico para Gemini
const buildEmergencyPrompt = (data) => {
  const ownerName = data.ownerName || "dueño(a)";
  const userLocation = data.userLocation || "ubicación no especificada";
  const emergencyDescription = data.emergencyDescription || "No indicada";
  const species = data.species || "No indicada";
  const patientAge = data.patientAge || "No indicada";
  const patientGender = data.patientGender || "No indicado";
  const medicalHistory = data.medicalHistory || "No especificado";
  const patientName = data.patientName || "tu mascota"; // Asegúrate de que el nombre de la mascota se capture

  // Lógica para determinar el emoji de la especie
  let speciesEmoji = "🐾"; // Emoji por defecto
  if (species.toLowerCase().includes("perro")) {
    speciesEmoji = "🐶";
  } else if (species.toLowerCase().includes("gato")) {
    speciesEmoji = "🐱";
  } else if (species.toLowerCase().includes("ave")) {
    speciesEmoji = "🦜";
  } else if (species.toLowerCase().includes("conejo")) {
    speciesEmoji = "🐰";
  } else if (species.toLowerCase().includes("ganado")) {
    speciesEmoji = "🐎";
  } else if (
    species.toLowerCase().includes("hamster") ||
    species.toLowerCase().includes("roedor")
  ) {
    speciesEmoji = "🐹";
  }

  return `
Eres *Asistavet*, un asistente veterinario virtual de la clínica Asistavet de Venezuela C.A., ubicada en Ocumare del Tuy. Tu objetivo es evaluar la situación de la mascota y guiar al usuario hacia la mejor acción posible, priorizando la salud del animal y la eficiencia del servicio.

El usuario, ${ownerName}, ha proporcionado la siguiente información sobre la situación:
- **Síntomas detallados:** "${emergencyDescription}"
- **Ubicación actual:** "${userLocation}"
- **Especie:** "${species}"
- **Edad aproximada:** "${patientAge}"
- **Sexo:** "${patientGender}"
- **Nombre del paciente:** "${patientName}"
- **Historial médico previo:** "${medicalHistory}"

Basado en esta información, necesito que tu respuesta sea directa, empática, no técnica y siga el siguiente formato estricto. Tu respuesta debe *ocultar cualquier mención explícita de "Clasificación de Urgencia" o emojis como 🚨/⚠️/🟢*, pero la urgencia debe manifestarse en el tono y las acciones recomendadas.

**Formato de Respuesta Final:**

NUESTRA EVALUACIÓN Y LO QUE RECOMENDAMOS
INFORMACIÓN DE PRECIO Y CONTACTO
PRÓXIMO PASOS

Detalles para cada sección que DEBES GENERAR en tu respuesta:**

1.NUESTRA EVALUACIÓN Y LO QUE RECOMENDAMOS:**
Primeras observaciones:** Una frase corta y muy sencilla sobre lo que parece estar ocurriendo con ${patientName}. *Evita cualquier término médico complejo.* Ejemplo: "Parece que ${patientName} tiene un malestar estomacal." o "Podría ser una reacción alérgica."
 
2. INFORMACIÓN DE PRECIO Y CONTACTO:**

A continuación, basa tu siguiente instrucción en la URGENCIA INFERIDA y la ${userLocation}:**

* Luego, basándote en la ${userLocation} (Ocumare, Santa Teresa, Yare, Charallave, Cúa vs. Caracas u otra):
* Si es una ubicación del Tuy: "Te recomendamos dirigirte sin demora a nuestra sede de consulta ubicada en: *Ocumare del Tuy, Calle Sucre (Ppal del Calvario), en frente de las instalaciones del Pez que fuma*."
* Si es Caracas o lejana/domicilio: "Si lo deseas, un equipo Veterinario puede trasladarse *hasta tu domicilio* para mayor comodidad, tuya y de ${patientName} ${speciesEmoji}. Coordinaremos esto en la llamada."
* **NO** mencionar "agendar cita" en esta sección. El foco es la acción inmediata.

3. PRÓXIMO PASOS:
1️⃣ Para AGENDAR CITA " y "2️⃣ Para VOLVER AL MENÚ ".
¡Gracias ${ownerName}! Por depositar en nosotros la salud y los cuidados de ${patientName} ${speciesEmoji}.

Considera siempre el ${ownerName} y la ${userLocation} para personalizar la respuesta y mantener un tono amigable.*
${speciesEmoji}** Reemplaza este placeholder con el emoji de mascota más apropiado según la especie (ej. 🐶 para perro, 🐱 para gato, 🦜 para ave, 🐠 para pez, 🐹 para roedor). Si no se puede determinar la especie, usa 🐾.
`;
};

const flowEmergenciaDetallada = addKeyword(["emergencia", "urgencia"], {
  sensitive: true,
})
  .addAnswer(
    "¡Hola! Soy un Asistente Virtual 🤖!!! Cuéntame qué está presentando tu animal de compañía? Y ¿Desde cuándo?",
    { capture: true },
    async (ctx, { state, fallBack }) => {
      const body = ctx.body?.trim();
      if (!body)
        return fallBack(
          "❌ Es importante que me cuentes lo que le pasa. Por favor, describe los síntomas de tu animal de compañía."
        );
      await state.update({ emergencyDescription: body });
    }
  )
  .addAnswer(
    "📍¿De dónde nos escribes? O ¿Dónde se encuentra el paciente?",
    { capture: true },
    async (ctx, { state }) => {
      await state.update({ userLocation: ctx.body.trim() });
    }
  )
  .addAnswer(
    "🐾 ¿Qué especie es tu compañero? (*Perro*, *Gato*, *Ganado*, *Otro*):",
    { capture: true },
    async (ctx, { state }) => {
      await state.update({ species: ctx.body.trim() });
    }
  )
  .addAnswer(
    "⚤ ¿Cuál es el *sexo* de tu compañero? (*Macho* / *Hembra*):",
    { capture: true },
    async (ctx, { state }) => {
      await state.update({ patientGender: ctx.body.trim() });
    }
  )
  .addAnswer(
    "🎂 ¿Cuál es la *edad aproximada* de tu animal de compañía?:",
    { capture: true },
    async (ctx, { state }) => {
      await state.update({ patientAge: ctx.body.trim() });
    }
  )
  .addAnswer(
    "📝 Entendido. ¿Cuál es el *nombre del paciente* (tu compañero)?", // CORRECTED: This now saves to patientName
    { capture: true },
    async (ctx, { state }) => {
      await state.update({ patientName: ctx.body.trim() }); // Corrected variable
    }
  )
  .addAnswer(
    "🙋‍♂️ ¿Con quién tenemos el gusto de conversar? (Tu nombre como tutor/responsable)",
    { capture: true },
    async (ctx, { state }) => {
      await state.update({ ownerName: ctx.body.trim() });
    }
  )

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
  );
module.exports = flowEmergenciaDetallada;
