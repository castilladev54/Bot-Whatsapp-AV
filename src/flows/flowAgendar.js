// ✅ Importamos flujos al inicio
const flowConfirmarCita = require("./flowConfirmarCita.js");

const { addKeyword } = require("@bot-whatsapp/bot");

// Flujo: Agendar citas
const flowAgendar = addKeyword(["pedir", "cita", "precio", "consulta"])
  .addAnswer(
    "¡Excelente! Para agendar tu cita 📆, necesito algunos datos.📍¿De dónde nos escribes? O ¿Dónde se encuentra el paciente?",
    { capture: true },
    async (ctx, { state }) => {
      await state.update({ userLocation: ctx.body.trim() || "No especificado" });
    }
  )
  .addAnswer(
    "🐾 ¿Qué especie es tu compañero? (*Perro*, *Gato*, *Ganado*, *Otro*):",
    { capture: true },
    async (ctx, { state }) => {
      await state.update({ species: ctx.body.trim() || "No especificado" });
    }
  )
  .addAnswer(
    "📝 Entendido. ¿Cuál es el *nombre del paciente* (tu compañero)?",
    { capture: true },
    async (ctx, { state }) => {
      await state.update({ patientName: ctx.body.trim() || "Sin nombre" });
    }
  )
  .addAnswer(
    "⚤ ¿Cuál es el *sexo* de tu compañero? (*Macho* / *Hembra*):",
    { capture: true },
    async (ctx, { state }) => {
      await state.update({ patientGender: ctx.body.trim() || "No especificado" });
    }
  )
  .addAnswer(
    "🎂 ¿Cuál es la *edad aproximada* de tu animal de compañía?:",
    { capture: true },
    async (ctx, { state }) => {
      await state.update({ patientAge: ctx.body.trim() || "No especificado" });
    }
  )
  .addAnswer(
    "🙋‍♂️ ¿Con quién tenemos el gusto de conversar? (Tu nombre como tutor/responsable)",
    { capture: true },
    async (ctx, { state, gotoFlow }) => {
      await state.update({ ownerName: ctx.body.trim() });

   

      return gotoFlow(flowConfirmarCita);
    }
  );

module.exports = flowAgendar;