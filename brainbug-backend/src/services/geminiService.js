import axios from "axios";

export const analyzeWithGemini = async (code, mlOutput) => {
    const prompt = `
    You are BrainBug AI. Analyze the following code.
    ML Model says:
    ${JSON.stringify(mlOutput, null, 2)}

    Now deeply analyze:
    - bugs
    - fixes
    - optimizations
    - cleaner code suggestions

    Code:
    ${code}
    `;

    try {
        // Use v1beta endpoint with Gemini 2.5 Flash (latest stable model)
        const result = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                contents: [{ parts: [{ text: prompt }] }]
            }
        );

        // Extract the text from Gemini's response
        const analysisText = result.data.candidates?.[0]?.content?.parts?.[0]?.text || "No analysis available";
        
        return {
            analysis: analysisText,
            rawResponse: result.data
        };
    } catch (error) {
        console.error("Gemini API Error:", error.response?.data || error.message);
        throw new Error(`Failed to analyze code with Gemini: ${error.response?.data?.error?.message || error.message}`);
    }
};