const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");


// Flujo: Vacunación
const flowVacuna = addKeyword("vacuna", "vacunación", "inyección", "vacunar" ).addAnswer(
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

        "\n📌 *Nota:* Los precios pueden variar según la ubicación y número de mascotas",

      "\n🏥 *PRECIOS EN NUESTRA SEDE:*\n" + "🐶 Perros: *$35*\n" + "🐱 Gatos: *$45*",

      "\n📍 *Beneficios adicionales:*\n" +
        "• Atención personalizada\n" +
        "• Registro digital de vacunas\n" +
        "• Recordatorio para próximas dosis \n",
        "",
        "¿Deseas agendar ahora? (*SI* o *NO*)",

      
    ],
  ].join("\n"),
  { capture: true },
  async (ctx, { gotoFlow, endFlow }) => {
    if (ctx.body.toLowerCase() === "si") return gotoFlow(require("./flowAgendar.js"));
    return endFlow("🔄 Puedes volver a escribir *menu* cuando lo necesites.");
  }
);

module.exports = flowVacuna;
