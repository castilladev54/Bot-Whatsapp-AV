
const { createBot, createProvider, createFlow } = require("@bot-whatsapp/bot");
const QRPortalWeb = require("@bot-whatsapp/portal");
const BaileysProvider = require("@bot-whatsapp/provider/baileys");
const { connectToMongoDB } = require("./config/db.config");
const flowPrincipal = require("./flows/flowPrincipal");
const menuFlow = require("./flows/menuFlow");
const flowEmergenciaRest = require("./flows/flowEmergenciaRest");
const flowConsulta = require("./flows/flowConsulta");
const flowVacuna = require("./flows/flowVacuna");
const flowCirugia = require("./flows/flowCirugia");
const flowAgendar = require("./flows/flowAgendar");

const flowConfirmarCita = require("./flows/flowConfirmarCita");

// Importación de flujos
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

const main = async () => {
  //console.log("🚀 Iniciando bot...");
  try {
    //1.Conectar a la base de datos
    const adapterDB = await connectToMongoDB(); 

    // 2. Crear flujos
    const adapterFlow = createFlow(flows);
    //console.log("✅ Flujos cargados correctamente");
    //console.log(`📦 Total de flujos: ${flows.length}`);

    // 3. Configurar proveedor
    const adapterProvider = createProvider(BaileysProvider);

    // 4. Crear el bot
    //console.log("🤖 Creando instancia del bot...");
    createBot({
      flow: adapterFlow,
      provider: adapterProvider,
      database: adapterDB,
    });

    // 5. Iniciar portal QR
    QRPortalWeb();
    //console.log("✨ Bot iniciado correctamente");
  } catch (error) {
    console.error("💥 ERROR CRÍTICO:", error.message);
    console.error("Stack trace:", error.stack);
    process.exit(1);
  }
};

// Ejecutar la aplicación
main();
