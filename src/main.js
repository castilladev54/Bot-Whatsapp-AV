const { createBot, createProvider, createFlow } = require("@bot-whatsapp/bot");
const QRPortalWeb = require("@bot-whatsapp/portal");
const BaileysProvider = require("@bot-whatsapp/provider/baileys");
const { connectToMongoDB } = require("./config/db.config");
// Importar flujos
const flowPrincipal = require("./flows/flowPrincipal");
const menuFlow = require("./flows/menuFlow");
const flowEmergenciaRest = require("./flows/flowEmergenciaRest");
const flowConsulta = require("./flows/flowConsulta");
const flowVacuna = require("./flows/flowVacuna");
const flowCirugia = require("./flows/flowCirugia");
const flowAgendar = require("./flows/flowAgendar");
const flowConfirmarCita = require("./flows/flowConfirmarCita");

// Lista de flujos
const flows = [
  flowPrincipal,
  menuFlow,
  flowEmergenciaRest,
  flowConsulta,
  flowVacuna,
  flowCirugia,
  flowAgendar,
  flowConfirmarCita,
];

// Función principal para iniciar el bot
const main = async () => {
  try {
    // 1. Conectar a MongoDB
    const adapterDB = await connectToMongoDB();

    // 2. Crear flujos
    const adapterFlow = createFlow(flows);

    // 3. Configurar proveedor con opciones de bajo consumo
    const adapterProvider = createProvider(BaileysProvider, {
      options: {
        printQRInTerminal: true,
        logger: null,
        browser: ["Bot-Whatsapp-AV", "Chrome", "3.0"],
      },
    });

    // 4. Crear bot
    createBot({
      flow: adapterFlow,
      provider: adapterProvider,
      database: adapterDB,
    });

    // 5. Mostrar QR
    QRPortalWeb();
    console.log("✅ Bot iniciado correctamente");
  } catch (error) {
    console.error("💥 Error crítico:", error.message);
    process.exit(1);
  }
};

main();
