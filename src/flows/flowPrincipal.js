const { addKeyword, EVENTS } = require("@bot-whatsapp/bot");


const flowPrincipal = addKeyword(EVENTS.WELCOME)
  .addAnswer(
    [
      "🙌*¡Gracias por comunicarte con Asistavet de Venezuela CA*🐾", 
      "Expertos en el cuidado animal!!",
      "",
      "*AssistBot🤖!*",  
      "Un bot 🤖 diseñado para acompañarte en cada momento!",
      "",
      "*¿Cómo puedo ayudarte?*", 
      "💬 Escribe por favor la palabra *AYUDA* para que conozcas las opciones que tenemos para ti.",
    ].join("\n")
  )
  
  .addAction(async (ctx) => {
    console.log(`🔔 Nuevo usuario: ${ctx.from} - ${new Date().toLocaleString()}`);
    // Aquí puedes guardar en MongoDB: await registrarIngreso(ctx.from);
  })


module.exports = flowPrincipal;