function getSpeciesEmoji(species) {
  const speciesMap = {
    perro: "🐶",
    gato: "🐱",
    ave: "🐦",
    roedor: "🐭",
    ganado: "🐄",
  };
  return speciesMap[species.toLowerCase()] || "🐾";
}

function buildEmergencyPrompt(state) {
  const {
    ownerName,
    emergencyDescription,
    userLocation,
    species,
    patientAge,
    patientGender,
    patientName,
    medicalHistory,
  } = state;

  const isVallesDelTuy = [
    "ocumare",
    "santa teresa",
    "cúa",
    "cua",
    "charallave",
    "san francisco de yare",
    "yare",
  ].some((loc) => userLocation.toLowerCase().includes(loc));

  const locationRecommendation = isVallesDelTuy
    ? "Te recomendamos dirigirte sin demora a nuestra sede en *Ocumare del Tuy, Calle Sucre (Ppal del Calvario), frente al Pez que fuma*."
    : "Podemos enviar un equipo a domicilio. Lo coordinaremos por llamada.";

  const pricingInfo = isVallesDelTuy
    ? `
*En nuestra sede (Ocumare del Tuy):*
🩺 Consulta básica (evaluación + hasta 3 medicamentos): *25$*
💉 Consulta + Hidratación IV: *40$*
😴 Procedimientos bajo sedación: *desde 60$*
🔬 Estudios adicionales disponibles:
🩸 Hematología: 12$
🧫 Descarte Hemoparásitos: 12$
🔬 Química Sanguínea: 17$
🧪 Test Parvovirus: 25$
🧪 Test Moquillo: 30$
`
    : `
*Servicio a Domicilio (🏡):*
🩺 Consulta básica (evaluación + 3 medicamentos): *40$*
💧 Consulta + Hidratación IV: *55$*
😴 Procedimientos bajo sedación: *desde 70$* (según peso)
*📝 Estudios Adicionales (a domicilio):*
🩸 Hematología: 12$
🧫 Descarte Hemoparásitos: 12$
🔬 Química Sanguínea: 17$
🧪 Test Parvovirus: 25$
🧪 Test Moquillo: 30$
*Importante*: El costo del servicio puede presentar variación, dependiendo de la ubicación y el acceso a su domicilio. 🏡
Así como si la naturaleza del animal y su agresividad no permite realizar la toma de muestra es necesario trabajar bajo sedación😴.
`;

  const emoji = getSpeciesEmoji(species);

  return `Eres Asistavet, un asistente veterinario virtual de la clínica Asistavet de Venezuela C.A., ubicada en Ocumare del Tuy. Tu objetivo es evaluar la situación de la mascota y guiar al usuario hacia la mejor acción posible, priorizando la salud del animal y la eficiencia del servicio.
El usuario, ${ownerName}, ha proporcionado la siguiente información:
- Síntomas detallados: "${emergencyDescription}"
- Ubicación actual: "${userLocation}"
- Especie: "${species}"
- Edad aproximada: "${patientAge}"
- Sexo: "${patientGender}"
- Nombre del paciente: "${patientName}"
- Historial médico previo: "${medicalHistory}"
Tu respuesta DEBE ser empática, clara, no técnica y ABSOLUTAMENTE EN EL SIGUIENTE FORMATO. USA ESTOS ENCABEZADOS EXACTOS:
NUESTRA EVALUACIÓN Y LO QUE RECOMENDAMOS:
[Una frase sencilla sobre lo que parece estar ocurriendo. Sin tecnicismos. Prioriza la urgencia si aplica.]
INFORMACIÓN DE CONTACTO:
${locationRecommendation}
${pricingInfo}
PRÓXIMO PASOS:
1️⃣ Para CONFIRMAR CITA
2️⃣ Para VOLVER AL MENÚ
¡Gracias ${ownerName}! Por confiar en nosotros para cuidar a ${patientName} ${emoji}.
NO INCLUYAS NINGÚN OTRO TEXTO ADICIONAL FUERA DE ESTE FORMATO. Asegúrate de que las secciones están claramente separadas y que las opciones 1 y 2 están en líneas separadas.`;
}

module.exports = { buildEmergencyPrompt };