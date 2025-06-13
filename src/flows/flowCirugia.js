// 📁 src/flows/flowCirugia.js
const { addKeyword} = require("@bot-whatsapp/bot");


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
  "¿Deseas agendar ahora? (*SI* o *NO*)",

]
    .join("\n"),
    { capture: true },
    async (ctx, { gotoFlow, endFlow }) => {
      if (ctx.body.toLowerCase() === "si") {
        return gotoFlow(require("./flowAgendar.js"))
      }
      return endFlow("🔄 Entendido. Puedes volver a escribir *menu* cuando lo necesites para ver otras opciones.");
    }
  );

module.exports = flowCirugia;