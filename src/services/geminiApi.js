const dotenv = require("dotenv");
dotenv.config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Inicializa el cliente de Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function startChat() {
  // Modelo recomendado para chats (usa gemini-1.5-pro-latest para más capacidad)
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    generationConfig: {
      maxOutputTokens: 800,
      temperature: 0,
      
    },
  });

  // Inicia el chat con historial de contexto
  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: "Hello" }],
      },
      {
        role: "model",
        parts: [{ text: "Responde en español," }],
      },
    ],
  });

  return chat;
}

async function askAndRespond(prompt, message) {
  if (!message || typeof message !== "string") {
    throw new Error("Mensaje inválido: debe ser un string no vacío");
  }

  try {
    const chat = await startChat();
    // Combinamos el prompt con el mensaje del usuario
    const fullMessage = `${prompt}\n\nUsuario pregunta: ${message}`;
    const result = await chat.sendMessageStream(fullMessage);
    const response = await result.response;
    return response.text(); // Devuelve solo el texto
  } catch (error) {
    console.error("Error en Gemini:", error);
    return "Lo siento, no pude procesar tu consulta. Intenta de nuevo más tarde.";
  }
}

module.exports = { askAndRespond };