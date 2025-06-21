const { createBot, createProvider, createFlow } = require("@bot-whatsapp/bot");
const BaileysProvider = require("@bot-whatsapp/provider/baileys");
const { connectToMongoDB } = require("./config/db.config");
const flowPrincipal = require("./flows/flowPrincipal");
const flowMenu = require("./flows/menuFlow");
const flowAgendar = require("./flows/flowAgendar");
const flowEmergenciaRest = require("./flows/flowEmergenciaRest");
const flowConfirmarCita = require("./flows/flowConfirmarCita")

const flows = [flowPrincipal, flowMenu, flowAgendar,flowEmergenciaRest, flowConfirmarCita];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const simulateUserMessages = async (provider) => {
  const simulatedNumber = "123456789@s.whatsapp.net";
  const testMessages = [
    "Hola", "cita", "Caracas", "Perro", "Max", "Macho", "2 años", "Carlos", "urgencia","emergencia", "confirmar"
  ];

  for (let msg of testMessages) {
    await delay(500); // simula tiempo entre mensajes
    console.log("📨 Enviando:", msg);
    await provider.sendText(simulatedNumber, msg);
  }
};

(async () => {
  const adapterDB = await connectToMongoDB();
  const adapterFlow = createFlow(flows);

  const adapterProvider = createProvider(BaileysProvider, {
    options: {
      printQRInTerminal: true,
      logger: undefined,
      browser: ["LoadBot", "Chrome", "1.0"],
    },
  });

  createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  });

  adapterProvider.on("ready", async () => {
    console.log("✅ Proveedor Baileys listo. Iniciando test de carga...");
    await simulateUserMessages(adapterProvider);
    setInterval(() => {
      const used = process.memoryUsage().heapUsed / 1024 / 1024;
      console.log(`📊 Memoria usada: ${used.toFixed(2)} MB`);
    }, 5000);
  });
})();


/**
 * Test script to simulate user message flow for a WhatsApp bot using Baileys provider and MongoDB.
 * 
 * - Loads multiple conversation flows.
 * - Connects to MongoDB for session/data storage.
 * - Simulates a sequence of user messages to test bot responses and memory usage.
 * - Prints QR code in terminal for WhatsApp authentication.
 * - Logs memory usage periodically.
 * 
 * @module test-load
 * @requires @bot-whatsapp/bot
 * @requires @bot-whatsapp/provider/baileys
 * @requires ./config/db.config
 * @requires ./flows/flowPrincipal
 * @requires ./flows/menuFlow
 * @requires ./flows/flowAgendar
 * @requires ./flows/flowEmergenciaRest
 * @requires ./flows/flowConfirmarCita
 */


