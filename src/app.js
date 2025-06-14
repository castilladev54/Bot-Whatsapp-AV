// src/app.js
require("dotenv").config();
const {
  createBot,
  createProvider,
  createFlow,
} = require("@bot-whatsapp/bot");
const QRPortalWeb = require("@bot-whatsapp/portal");
const BaileysProvider = require("@bot-whatsapp/provider/baileys");
const MongoAdapter = require("@bot-whatsapp/database/mongo");


// Importación de flujos separados (Clean Architecture)
const flowPrincipal = require("./flows/flowPrincipal.js");
const menuFlow = require("./flows/menuFlow.js");
const flowEmergenciaRest = require("./flows/flowEmergenciaRest.js");
const flowConsultas = require("./flows/flowConsulta.js");
const flowVacuna = require("./flows/flowVacuna.js");
const flowCirugia = require("./flows/flowCirugia.js");
const flowAgendar = require("./flows/flowAgendar.js");
const flowGeminiIA = require("./flows/flowGeminiIA.js");
const flowConfirmarCita = require("./flows/flowConfirmarCita.js");

const main = async () => {
  try {
    // Validar variable de entorno Mongo
    if (!process.env.MONGO_DB_URI || !process.env.MONGO_DB_URI.startsWith('mongodb')) {
      throw new Error('❌ URI de Mongo no definida o inválida. Verifica la variable MONGO_DB_URI en Railway o en tu entorno.');
    }

    console.log("✅Conectando a Mongo:",)

    // Crear adaptador de base de datos
    const adapterDB = new MongoAdapter({
      dbUri: process.env.MONGO_DB_URI,
      dbName: "Asistavetdb",
    });

    // Crear flujo principal con todos los flujos importados
    const adapterFlow = createFlow([
      flowPrincipal,
      menuFlow,
      flowEmergenciaRest,
      flowConsultas,
      flowVacuna,
      flowCirugia,
      flowAgendar,
      flowGeminiIA,
      flowConfirmarCita,
    ]);

    // Crear proveedor Baileys para WhatsApp
    const adapterProvider = createProvider(BaileysProvider);

    // Crear el bot con configuración
    createBot({
      flow: adapterFlow,
      provider: adapterProvider,
      database: adapterDB,
    });

    // Iniciar el portal web para QR
    QRPortalWeb();

    console.log("🤖 Bot iniciado con éxito.");

  } catch (error) {
    console.error("❌ Error en la inicialización del bot:", error);
    process.exit(1); // Salir con error para que la plataforma detecte fallo
  }
};

main();
