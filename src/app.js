const {
  createBot,
  createProvider,
  createFlow,
  addKeyword,
  EVENTS,
  addAnswer,
} = require("@bot-whatsapp/bot");
require("dotenv").config();
const QRPortalWeb = require("@bot-whatsapp/portal");
const BaileysProvider = require("@bot-whatsapp/provider/baileys");
const MockAdapter = require("@bot-whatsapp/database/mongo");
const path = require("path");
const fs = require("fs");
const { askAndRespond } = require("./services/geminiApi.js");
const { delay } = require("@whiskeysockets/baileys");
const menuPath = path.join(__dirname, "prompts", "prompt.txt");
const menu = fs.readFileSync(menuPath, "utf8");

// Flujo de bienvenida
const flowPrincipal = addKeyword(EVENTS.WELCOME)
  .addAnswer("🙌 Hola bienvenido a *Asistavet de Venezuela CA*")
  .addAnswer("Escribe *ayuda* para ver las opciones disponibles");

// Flujo de emergencia veterinaria
const flowEmergenciaRest = addKeyword(EVENTS.ACTION)
.addAnswer(
    "Por favor envía solo el número:1, 2 o 3\n\n" +
      "1️⃣ *Perro* 🐕\n" +
      "2️⃣ *Gato* 🐈\n" +
      "3️⃣ *Otro animal* 🦜🐇🐄",
    { capture: true },
    async (ctx, { flowDynamic, endFlow }) => {
      // 🔄 Validación inteligente
      if (!ctx.body.match(/^[1-3]$/)) {
        await flowDynamic([
          "⚠️ *Selección inválida*",
          "Por favor envía solo el número:\n1, 2 o 3",
        ]);
        return endFlow();
      }

      // 🏥 Tipos de emergencia predefinidas
      const emergencias = {
        1: {
          tipo: "canina",
          emoji: "🐶",
          preguntas: ["¿Raza?", "¿Edad?", "¿Síntomas principales?"],
        },
        2: {
          tipo: "felina",
          emoji: "😺",
          preguntas: ["¿Es indoor/outdoor?", "¿Vacunas al día?"],
        },
        3: {
          tipo: "exótica",
          emoji: "🐾",
          preguntas: ["¿Qué especie?", "¿Hábitat habitual?"],
        },
      };

      const seleccion = emergencias[ctx.body];

      // 💡 Contexto para Gemini
      const prompt = `
Eres un veterinario de emergencias especializado en ${seleccion.tipo}.
Usuario reporta: "${ctx.fallback || "Sin detalles"}".

**Instrucciones:**
1. Diagnóstico preliminar (máx 1 oración)
2. Primeros auxilios (3 pasos con emojis)
3. Nivel de urgencia (🚨/⚠️/🔵)
4. Recomendación de acción inmediata

**Formato:**
📌 *Diagnóstico:* [texto]
🩹 *Primeros Auxilios:* 
1. [paso1] 
2. [paso2]
3. [paso3]
🚑 *Urgencia:* [nivel]
💡 *Acción:* [texto]
      `;

      try {
        // 🧠 Consulta a Gemini
        const respuesta = await askAndRespond(prompt, ctx.body);

        // ✂️ Procesamiento inteligente de respuesta
        const partes = respuesta.split("\n").filter((p) => p.trim());

        // 📲 Envío optimizado para WhatsApp
        await flowDynamic(
          `*${seleccion.emoji} Respuesta para ${seleccion.tipo.toUpperCase()}*`
        );

        for (const parte of partes) {
          await flowDynamic(parte);
          await new Promise((resolve) => setTimeout(resolve, 700));
        }

        // 📌 Mensaje final con acciones
        await flowDynamic({
          body: "¿Necesitas algo más?",
          buttons: [
            { body: "🆘 Llamar Veterinario" },
            { body: "🗺 Clínica más cercana" },
            { body: "💊 Farmacias 24hrs" },
          ],
        });
      } catch (error) {
        console.error("Error veterinario:", error);
        await flowDynamic([
          "⚠️ *Sistema temporalmente fuera de servicio*",
          "Por favor contacta:\n📞 555-EMERGENCIAS",
          { media: "https://example.com/contacto.jpg" },
        ]);
      }
    }
  );

// Flujo de Agendar citas veterinarias
const flowAgendar = addKeyword(EVENTS.ACTION).addAnswer(
  [
    "Para agendar tu Cita 📆",
    "es necesaria la siguiente información:",
    "",
    "📍 *¿Dónde nos escribes?*",
    "Ocumare del Tuy",
    "Gran Caracas",
    "",
    "🐶 *Especie:* (Responde: Perro, Gato o Ambos)",
    "",
    "📝 *Nombre del Paciente:*",
    "",
    "⚥ *Sexo del paciente:* (Macho o Hembra)",
    "",
    "🎂 *Edad aproximada:*",
    "",
    "👤 *Nombre del Tutor/Propietario:*",
    "",
    "🏠 *Dirección:*",
    "",
    "📱 *Teléfono:*",
    "",
    "========================",
    "📆 *Importante:* Una vez consignada esta información se le contactará para asignar fecha/hora",
    "========================",
    "💳 *Métodos de pago:*",
    "- Efectivo 💵 (Preferiblemente pago exacto)",
    "- Pago Móvil 📲",
    "- Paypal 🅿",
    "========================",
    "📸 *Síguenos en:*",
    "www.instagram.com/asistavetdevzla",
  ].join("\n"),
  { delay: 5000 }
);

// Flujo de consultas veterinarias
const flowConsultas = addKeyword(EVENTS.ACTION).addAnswer(
  [
    "✅ Consulta Básica:🔎",
    "(Evaluación de constantes fisiológicas del paciente) 🩺🌡🔎 + y hasta (3) Medicamentos necesarios para estabilizar la atención 💉💉💉.  Tiene un costo de 25$",
    ".",
    "✅ Consulta🔎 + Hidratación💧",
    "Canalización de vía y suministro de fármacos e hidratación endovenosa. 40$",
    "=========================",
    "✅ Procedimientos Médicos bajo sedación😴 Precios a partir de 60$  (De acuerdo al peso vivo del animal)",
    "=========================",
    "✅ Estudios Adicionales:",
    "🩸 Hematología 10$",
    "🧫 Descarte Hemoparasitos 12$",
    "🔬 Química Sanguínea 17$",
    "🧫 Test de Parvovirus  25$",
    "🧪 Test de Moquillo 30$",
    "=========================",

    "━━━━━━━━━━━━━━━━━━",
    "¿Deseas agendar ahora? (Responde *SI* o *NO*)",
  ].join("\n"),
  { capture: true },
  async (ctx, { gotoFlow, endFlow }) => {
    if (ctx.body.toLowerCase() === "si") {
      return gotoFlow(flowAgendar);
    } else {
      return endFlow("🔄 Puedes volver a escribir *MENU* cuando lo necesites");
    }
  }
);

// Flujo de consultas cirujia
const flowCirujia = addKeyword(EVENTS.ACTION).addAnswer(
  [
    "🐱 *PROGRAMA DE ESTERILIZACIÓN FELINA* 🐱",
    "━━━━━━━━━━━━━━━━━━",
    "Costos:",
    "• Gato (Macho) 🐱: $45",
    "• Gata (Hembra) 🐱: $70",
    "━━━━━━━━━━━━━━━━━━",
    "*INCLUYE:*",
    "✅ Chequeo médico previo 🔍",
    "✅ Hematología (hembras) 🔬",
    "✅ Esterilización OVH/Castración",
    "✅ Medicamentos postoperatorios 💊",
    "✅ Consulta de control postoperatorio",
    "━━━━━━━━━━━━━━━━━━",
    "¿Deseas agendar ahora? (Responde *SI* o *NO*)",
  ].join("\n"),
  { capture: true },
  async (ctx, { gotoFlow, endFlow }) => {
    if (ctx.body.toLowerCase() === "si") {
      return gotoFlow(flowAgendar);
    } else {
      return endFlow("🔄 Puedes volver a escribir *MENU* cuando lo necesites");
    }
  }
);

// Flujo de consultas vacuna
// Flujo de consultas vacuna
const flowVacuna = addKeyword(EVENTS.ACTION)
  .addAnswer(
    [
      "El costo de la Vacunación 🐶 en Domicilio 🏡 es de 45$",
      "",
      "Que incluyen:",
      "✅ Chequeo Previo 🔍",
      "✅ Vacuna Sextuple 💉",
      "✅ Vacuna Antirrábica 💉",
      "(Si aplica)",
      "✅ Desparasitación 🦠",
      "✅ Entrega de Certificado de Vacunación 👌🏽",
      "========================",
      "El costo de la Vacunación 🐱 en Domicilio 🏡 es de 55$",
      "",
      "Que incluyen:",
      "✅ Chequeo Previo 🔍",
      "✅ Vacuna Triplefelina 💉",
      "✅ Vacuna Antirrábica 💉",
      "(Si aplica)",
      "✅ Desparasitación 🦠",
      "✅ Entrega de Certificado de Vacunación 👌🏽",
      "========================",
      "Importante: El costo del servicio puede presentar variación, dependiendo de la ubicación y el acceso a su domicilio 🏡. Así cómo la cantidad de animales a vacunar, atención mayor a 4 animales solicita un precio especial 😉",
      "",
    ].join("\n"),
  )
  .addAnswer(
    [
      "El costo de la Vacunación 🐶 en nuestra sede de consulta es de 35$",
      "",
      "Que incluyen:",
      "✅ Chequeo Previo 🔍",
      "✅ Vacuna Sextuple 💉",
      "✅ Vacuna Antirrábica 💉",
      "(Si aplica)",
      "✅ Desparasitación 🦠",
      "✅ Entrega de Certificado de Vacunación 👌🏽",
      "========================",
      "El costo de la Vacunación 🐱 en nuestra sede de consulta es de 45$",
      "",
      "Que incluyen:",
      "✅ Chequeo Previo 🔍",
      "✅ Vacuna Triplefelina 💉",
      "✅ Vacuna Antirrábica 💉",
      "(Si aplica)",
      "✅ Desparasitación 🦠",
      "✅ Entrega de Certificado de Vacunación 👌🏽",
      "━━━━━━━━━━━━━━━━━━",
      "¿Deseas agendar ahora? (Responde *SI* o *NO*)",
    ].join("\n"),
    { delay: 5000, capture: true },
    async (ctx, { gotoFlow, endFlow }) => {
      if (ctx.body.toLowerCase() === "si") {
        return gotoFlow(flowAgendar);
      } else {
        return endFlow("🔄 Puedes volver a escribir *MENU* cuando lo necesites");
      }
    }
  );


// Flujo principal del menú CORREGIDO
const menuFlow = addKeyword("Ayuda", { sensitive: false }).addAnswer(
  menu,
  { capture: true },
  async (ctx, { gotoFlow, fallBack, endFlow }) => {
    // Removido flowDynamic de los parámetros

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
        return gotoFlow(flowCirujia);
      case "5":
        return endFlow(
          "🔄 Puedes volver a escribir *MENU* cuando lo necesites"
        );
      default:
        return fallBack("⚠️ Opción no reconocida");
    }
  }
);

// Importar el módulo de flujo de Gemini
const main = async () => {
  // Inicialización del bot
  const adapterDB = new MockAdapter({
    dbUri: process.env.MONGO_DB_URI,
    dbName: "Asistavetdb" 
  }); // Base de datos mock para pruebas
  const adapterFlow = createFlow([
    // Flujo de bienvenida
    flowPrincipal,
    menuFlow,
    flowEmergenciaRest,
    flowAgendar,
    flowConsultas,
    flowCirujia,
    flowVacuna,
  ]);
  const adapterProvider = createProvider(BaileysProvider);

  // Configuración del bot
  createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  });

  QRPortalWeb(); // Iniciar QR Portal Web
};

main(); // Ejecutar la función principal
