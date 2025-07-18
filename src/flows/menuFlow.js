const path = require("path");
const fs = require("fs");
const { addKeyword } = require("@bot-whatsapp/bot");

const menuPath = path.join(__dirname, "prompts", "prompt.txt");
const menu = fs.readFileSync(menuPath, "utf8");

const flowEmergenciaRest = require("./flowEmergenciaRest.js");
const flowConsultas = require("./flowConsulta.js");
const flowVacuna = require("./flowVacuna.js");
const flowCirugia = require("./flowCirugia.js");
const flowPrincipal = require("./flowPrincipal.js");

const menuFlow = addKeyword(["Ayuda", "ayuda", "help"]).addAnswer(
  menu,
  { capture: true },
  async (ctx, { gotoFlow, fallBack, endFlow }) => {
    if (!["1", "2", "3", "4", "5", "0"].includes(ctx.body)) {
      return fallBack(
        "❌ Opción no válida. Por favor elige un número del menú."
      );
    }
    switch (ctx.body) {
      case "1":
        return gotoFlow(flowEmergenciaRest);
      case "2":
        return gotoFlow(flowConsultas);
      case "3":
        return gotoFlow(flowVacuna);
      case "4":
        return gotoFlow(flowCirugia);
      case "5":
        return gotoFlow(flowPrincipal);
      default:
        return endFlow("🔄 Puedes volver a escribir *MENU* cuando lo necesites");
    }
  }
);

module.exports = menuFlow;
