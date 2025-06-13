function parseGeminiResponse(geminiResponse) {
  const evaluationMatch = geminiResponse.match(
    /NUESTRA EVALUACIÓN Y LO QUE RECOMENDAMOS:\n([\s\S]*?)INFORMACIÓN DE CONTACTO:/
  );
  const contactMatch = geminiResponse.match(
    /INFORMACIÓN DE CONTACTO:\n([\s\S]*?)PRÓXIMO PASOS:/
  );
  const nextStepsMatch = geminiResponse.match(/PRÓXIMO PASOS:\n([\s\S]*)/);

  return {
    evaluation: evaluationMatch?.[1]?.trim() || "No disponible",
    contactAndPricing: contactMatch?.[1]?.trim() || "No disponible",
    nextStepsPrompt: nextStepsMatch?.[1]?.trim() || "No disponible",
  };
}

module.exports = { parseGeminiResponse };