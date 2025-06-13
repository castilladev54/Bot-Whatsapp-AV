// 📁 src/flows/flowAgendar.js

const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");

// Flujo: Agendar citas

const flowAgendar = addKeyword(EVENTS.ACTION, { sensitive: true }) // Se agregaron palabras clave explícitas y el número '5'
  .addAnswer(
    "¡Excelente! Para agendar tu cita 📆, necesito algunos datos.📍¿De dónde nos escribes? O ¿Dónde se encuentra el paciente?",
    { capture: true },
    async (ctx, { state }) => {
      // Guarda la ubicación en el estado de la conversación
      await state.update({ userLocation: ctx.body });
    }
  )

  .addAnswer(
    "🐾 ¿Qué especie es tu compañero? (*Perro*, *Gato*, *Ganado*, *Otro*):",
    { capture: true },
    async (ctx, { state }) => {
      await state.update({ species: ctx.body });
    }
  )

  .addAnswer(
    "📝 Entendido. ¿Cuál es el *nombre del paciente* (tu compañero)?",
    { capture: true },
    async (ctx, { state }) => {
      await state.update({ patientName: ctx.body });
    }
  )

  .addAnswer(
    "⚤ ¿Cuál es el *sexo* de tu compañero? (*Macho* / *Hembra*):",
    { capture: true },
    async (ctx, { state }) => {
      await state.update({ patientGender: ctx.body });
    }
  )

  .addAnswer(
    "🎂 ¿Cuál es la *edad aproximada* de tu animal de compañía?:",
    { capture: true },
    async (ctx, { state }) => {
      await state.update({ patientAge: ctx.body });
    }
  )

  .addAnswer(
    "🙋‍♂️ ¿Con quién tenemos el gusto de conversar? (Tu nombre como tutor/responsable)",
    { capture: true },
    async (ctx, { state, gotoFlow }) => {
      await state.update({ ownerName: ctx.body });
	  return gotoFlow(require("./flowConfirmarCita.js"));
    }
  )
  


module.exports = flowAgendar;
