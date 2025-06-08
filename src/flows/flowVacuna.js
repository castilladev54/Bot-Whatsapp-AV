const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const flowAgendar = require("../flows/flowAgendar");

// Flujo: Vacunación
const flowVacuna = addKeyword(EVENTS.ACTION).addAnswer(
  [
    [
      "🐕 *VACUNACIÓN CANINA* 🏡\n" +
        "• Servicio en domicilio: *$45*\n" +
        "✅ *Incluye:*\n" +
        "  - Vacuna Séxtuple\n" +
        "  - Vacuna Antirrábica\n" +
        "  - Desparasitación completa\n" +
        "  - Certificado de vacunación\n" +
        "  - Asesoría veterinaria",

      "\n🐈 *VACUNACIÓN FELINA* 🏡\n" +
        "• Servicio en domicilio: *$55*\n" +
        "✅ *Incluye:*\n" +
        "  - Vacuna Triple Felina\n" +
        "  - Vacuna Antirrábica\n" +
        "  - Desparasitación completa\n" +
        "  - Certificado de vacunación\n" +
        "  - Asesoría especializada",

      "\n🏥 *PRECIOS EN CLÍNICA:*\n" + "🐶 Perros: *$35*\n" + "🐱 Gatos: *$45*",

      "\n📍 *Beneficios adicionales:*\n" +
        "• Atención personalizada\n" +
        "• Registro digital de vacunas\n" +
        "• Recordatorio para próximas dosis",

      "\n⏰ *Horario de vacunación:*\n" + "Lunes a Sábado: 8:00 AM - 4:00 PM",

      "\n¿Deseas agendar este servicio?\n" +
        "Responde *SI* para confirmar o *NO* para más opciones",

      "\n📌 *Nota:* Los precios pueden variar según la ubicación y número de mascotas",
    ],
  ].join("\n"),
  { capture: true },
  async (ctx, { gotoFlow, endFlow }) => {
    if (ctx.body.toLowerCase() === "si") return gotoFlow(flowAgendar);
    return endFlow("🔄 Puedes volver a escribir *menu* cuando lo necesites.");
  }
);

module.exports = flowVacuna;
