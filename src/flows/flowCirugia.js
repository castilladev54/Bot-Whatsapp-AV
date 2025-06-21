// ✅ Importamos flujos al inicio
const flowAgendar = require("./flowAgendar.js");
const menuFlow = require("./menuFlow.js");

const { addKeyword } = require("@bot-whatsapp/bot");

// Flujo: Cirugía (Esterilización Felina)
const flowCirugia = addKeyword(["cirugia", "esterilizacion", "castrar"])
  .addAnswer([
    "🐾 *PROGRAMA DE ESTERILIZACIÓN FELINA* 🐾",
    "",
    "✨ *Tarifas especiales:*",
    "• 🐈 Gato Macho: *$45*",
    "• 🐈⬛ Gata Hembra: *$70*",
    "",
    "🩺 *El servicio incluye:*",
    "✓ Hematología completa",
    "✓ Cirugía profesional",
    "✓ Medicamentos post-operatorios", 
    "✓ Consulta de control",
    "✓ Cuidados especializados",
    "",
    "📍 *Ubicación:*",
    "🏥 Clínica Veterinaria [*Asistavet de Venezuela CA*]",
    "📌 Calle Sucre (Principal del Calvario)",
    "🌆 Frente a las instalaciones del Pez que Fuma",
    "🏙 Ocumare del Tuy",
    "",
    "¿Deseas agendar ahora? (*SI* o *NO*)"
  ].join("\n"), {
    capture: true
  }, async (ctx, { gotoFlow, fallBack }) => {
    const response = ctx.body.toLowerCase().trim();

    if (response === "si") {
      return gotoFlow(flowAgendar); // ✅ Usamos el flujo importado
    } else if (response === "no") {
      await flowDynamic("🏡 Volviendo al menú principal...");
      return gotoFlow(menuFlow); // ✅ Mejor UX que endFlow
    }

    // Opción no válida
    return fallBack("❌ Por favor responde *SI* o *NO*.");
  });

module.exports = flowCirugia;