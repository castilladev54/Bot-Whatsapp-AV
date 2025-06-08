// 📁 src/flows/flowCirugia.js
const { addKeyword} = require("@bot-whatsapp/bot");
const flowAgendar = require("./flowAgendar.js"); // CORRECTED: Path for flowAgendar

// Flujo: Cirugía (Esterilización Felina)
// RECOMENDACIÓN: Usa palabras clave explícitas o el número de opción del menú
const flowCirugia = addKeyword(["cirugia", "esterilizacion",], { sensitive: true }) // Added specific keywords and number '4'
  .addAnswer([
  "🐾 *PROGRAMA DE ESTERILIZACIÓN FELINA* 🐾",
  " ",
  "✨ *Tarifas especiales:*",
  "• 🐈 Gato Macho: *$45*",
  "• 🐈⬛ Gata Hembra: *$70*",
  " ",
  "🩺 *El servicio incluye:*",
  "✓ Hematología completa",
  "✓ Cirugía profesional",
  "✓ Medicamentos post-operatorios", 
  "✓ Consulta de control",
  "✓ Cuidados especializados",
  " ",
  "📍 *Ubicación:*",
  "🏥 Clínica Veterinaria [*Asistavet de Venezuela CA*]",
  "📌 Calle Sucre (Principal del Calvario)",
  "🌆 Frente a las instalaciones del Pez que Fuma",
  "🏙 Ocumare del Tuy",
  " ",
  "⏰ *Horario de atención:*",
  "Lunes a Sabado: 8:00 AM - 4:00 PM",

  " ",
  "📞 *Contacto:*",
  "📱 [+58 424-1731880]",

  " ",
  "¿Te gustaría agendar una cita ahora?",
  "Responde *SI* para reservar o *NO* para volver al menú"
]
    .join("\n"),
    { capture: true },
    async (ctx, { gotoFlow, endFlow }) => {
      if (ctx.body.toLowerCase() === "si") {
        return gotoFlow(flowAgendar);
      }
      return endFlow("🔄 Entendido. Puedes volver a escribir *menu* cuando lo necesites para ver otras opciones.");
    }
  );

module.exports = flowCirugia;