// src/app.js
const {
  createBot,
  createProvider,
  createFlow,
} = require("@bot-whatsapp/bot");
const QRPortalWeb = require("@bot-whatsapp/portal");
const BaileysProvider = require("@bot-whatsapp/provider/baileys");
const MockAdapter = require("@bot-whatsapp/database/mock");
//const MockAdapter = require("@bot-whatsapp/database/mongo");
require("dotenv").config();

// Importación de flujos separados (Clean Architecture)
const flowPrincipal = require("./flows/flowPrincipal.js");
const menuFlow = require("./flows/menuFlow.js");
const flowEmergenciaRest = require("./flows/flowEmergenciaRest.js");
const flowConsultas = require("./flows/flowConsulta.js");
const flowVacuna = require("./flows/flowVacuna.js");
const flowCirugia = require("./flows/flowCirugia.js");
const flowAgendar = require("./flows/flowAgendar.js");
const flowGeminiIA = require("./flows/flowGeminiIA.js");
const flowConfirmarCita = require("./flows/flowConfirmarCita.js")

// Función principal del bot
const main = async () => {
  const adapterDB = new MockAdapter(/*{dbUri: process.env.MONGO_DB_URI,dbName: "Asistavetdb"}*/);
  
  const adapterFlow = createFlow([
    flowPrincipal,
    menuFlow,
    flowEmergenciaRest,
    flowConsultas,
    flowVacuna,
    flowCirugia, 
    flowAgendar,
    flowGeminiIA,
    flowConfirmarCita
  ]);

  const adapterProvider = createProvider(BaileysProvider);
  
  createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  });

  QRPortalWeb();
};

main();