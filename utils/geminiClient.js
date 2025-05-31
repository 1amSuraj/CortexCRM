const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function getQueryFromPrompt(prompt) {
  const fullPrompt = `Convert the following user requirement into a MongoDB filter query. 
Respond ONLY with the raw JSON object, no markdown, no code block, no explanation, no extra characters.
Requirement: ${prompt}`;

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
  });

  // Assuming the response contains the JSON as plain text
  const text = response.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
  //   console.log(text);
  return JSON.parse(text);
}

module.exports = { getQueryFromPrompt };
