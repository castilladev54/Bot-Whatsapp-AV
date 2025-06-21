const { addKeyword } = require("@bot-whatsapp/bot");


const flowConfirmarCita = addKeyword(["confirmar"])
.addAction( async (_, { state, flowDynamic }) => {
  const myState = await state.getMyState();

	  const resumen = [
		`*Resumen de la cita:*`,
		`📍 *Ubicación:* ${myState.userLocation}`,
		`🐶 *Especie:* ${myState.species}`,
		`📝 *Nombre Paciente:* ${myState.patientName}`,
		`⚥ *Sexo:* ${myState.patientGender}`,
		`🎂 *Edad:* ${myState.patientAge}`,
		`👤 *Propietario:* ${myState.ownerName}`,
    ``,
    `📸 Instagram: @asistavetdevzla`,
	  ].join("\n");

	  await flowDynamic(resumen);
	  await flowDynamic("✅ ¡Gracias por tus datos! Nos pondremos en contacto *a primera hora* del día hábil más cercano para confirmar los detalles de tu cita. ¡Atento a tu teléfono!");
	  // ✅ Limpiamos el estado tras finalizar
      await state.clear();
	});

module.exports= flowConfirmarCita;