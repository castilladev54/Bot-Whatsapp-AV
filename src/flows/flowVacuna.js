// ✅ Importamos flujos al inicio
const flowAgendar = require("./flowAgendar.js");
const menuFlow = require("./menuFlow.js");

const { addKeyword } = require("@bot-whatsapp/bot");

// Flujo: Vacunación
const flowVacuna = addKeyword(["vacuna", "vacunación", "inyección", "vacunar"], { sensitive: true })
  .addAnswer([
    "🐕 *VACUNACIÓN CANINA* 🏡",
    "• Servicio en domicilio: *$45*",
    "✅ *Incluye:*",
    "  - Vacuna Séxtuple",
    "  - Vacuna Antirrábica",
    "  - Desparasitación completa",
    "  - Certificado de vacunación",
    "  - Asesoría veterinaria",
    "",
    "🐈 *VACUNACIÓN FELINA* 🏡",
    "• Servicio en domicilio: *$55*",
    "✅ *Incluye:*",
    "  - Vacuna Triple Felina",
    "  - Vacuna Antirrábica",
    "  - Desparasitación completa",
    "  - Certificado de vacunación",
    "  - Asesoría especializada",
    "",
    "📌 *Nota:* Los precios pueden variar según la ubicación y número de mascotas",
    "",
    "🏥 *PRECIOS EN NUESTRA SEDE:*",
    "🐶 Perros: *$35*",
    "🐱 Gatos: *$45*",
    "",
    "📍 *Beneficios adicionales:*",
    "• Atención personalizada",
    "• Registro digital de vacunas",
    "• Recordatorio para próximas dosis",
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

module.exports = flowVacuna;