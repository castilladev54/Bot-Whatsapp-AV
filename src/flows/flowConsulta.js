const { addKeyword } = require("@bot-whatsapp/bot");
const flowAgendar= require("./flowAgendar.js");

// Flujo: Consultas
const flowConsultas = addKeyword(["precio", "consulta"]).addAnswer(
  `✅ *SERVICIO DE CONSULTA MÉDICA*  
    
*En nuestra sede (Ocumare del Tuy):*
🩺 Consulta básica (evaluación + hasta 3 medicamentos): *25$*  
💉 Consulta + Hidratación IV: *40$*  
😴 Procedimientos bajo sedación: *desde 60$*  
🔬 Estudios adicionales disponibles

*Servicio a Domicilio (🏡):*  
🩺 Consulta básica (evaluación + 3 medicamentos): *40$*  
💧 Consulta + Hidratación IV: *55$*  
😴 Procedimientos bajo sedación: *desde 70$* (según peso)  

*📝 Estudios Adicionales:*  
🩸 Hematología: 12$  
🧫 Descarte Hemoparásitos: 12$  
🔬 Química Sanguínea: 17$  
🧪 Test Parvovirus: 25$  
🧪 Test Moquillo: 30$

*Notas importantes:*  
Importante: El costo del servicio puede presentar variación, dependiendo de la ubicación y el acceso a su domicilio. 🏡
Así como si la naturaleza del animal y su agresividad no permite realizar la toma de muestra es necesario trabajar bajo sedación😴. 

¿Deseas agendar ahora? (*SI* o *NO*)`,
  { capture: true },
  async (ctx, { gotoFlow, endFlow }) => {
    const response = ctx.body.toLowerCase().trim();
    if (response === "si") {
      return gotoFlow(flowAgendar);
    } else if (response === "no") {
      return gotoFlow(
        "🔄 Puedes volver a escribir *menu* cuando lo necesites."
      );
    }

    return endFlow(
      "No entendí tu respuesta. Por favor escribe *menu* para volver al inicio."
    );
  }
);

module.exports = flowConsultas;
