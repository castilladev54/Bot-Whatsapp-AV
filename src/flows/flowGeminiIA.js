// 📁 src/flows/flowGemini
const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");
const { askAndRespond } = require("../services/geminiApi.js");

// Simulación de almacenamiento en memoria
const conversationHistory = {}; // { phoneNumber: [{ timestamp, userMessage, botResponse }] }
const clientMedicalHistory = {}; // { phoneNumber: "Historial médico del cliente si existe." }

// Registrar interacción
const registerInteraction = (phoneNumber, userMessage, botResponse) => {
  if (!conversationHistory[phoneNumber]) {
    conversationHistory[phoneNumber] = [];
  }
  conversationHistory[phoneNumber].push({
    timestamp: new Date().toISOString(),
    userMessage,
    botResponse,
  });
  console.log(
    `[REGISTRO] Interacción de ${phoneNumber}: "${userMessage}" -> "${botResponse}"`
  );
};

// Obtener historial de conversación
const getFormattedConversationHistory = (phoneNumber) => {
  const history = conversationHistory[phoneNumber];
  if (!history || history.length === 0) {
    return "No hay historial de conversación previo.";
  }
  return history
    .map((entry) => `[${entry.timestamp}] Usuario: ${entry.userMessage} | Bot: ${entry.botResponse}`)
    .join("\n");
};

// Obtener historial médico
const getClientMedicalHistory = (phoneNumber) => {
  return clientMedicalHistory[phoneNumber] || "No se encontró historial médico previo para este cliente.";
};

// Flujo Gemini IA
const flowGeminiIA = addKeyword(EVENTS.ACTION)
  .addAnswer("...")
  .addAction(async (ctx, { flowDynamic }) => {
    const userMessage = ctx.body;
    const phoneNumber = ctx.from;

    const userMedicalHistory = getClientMedicalHistory(phoneNumber);
    const currentConversationHistory = getFormattedConversationHistory(phoneNumber);

    const prompt = `Eres un asistente virtual de una veterinaria llamada Asistavet de Venezuela CA. Responde de manera amigable, profesional y empática, manteniendo el tono de una clínica veterinaria. El usuario está buscando ayuda con: "${userMessage}".\n\nContexto de la conversación actual:\n${currentConversationHistory}\n\nHistorial médico del cliente (si disponible):\n${userMedicalHistory}\n\nConsiderando la información anterior, ¿cómo deberías responder al usuario?`;

    const responseFromGemini = await askAndRespond(prompt, userMessage);

    registerInteraction(phoneNumber, userMessage, responseFromGemini);

    await flowDynamic(responseFromGemini);
  });

module.exports = flowGeminiIA;
