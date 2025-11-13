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

    const result = await axios.post(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + process.env.GEMINI_API_KEY,
        {
            contents: [{ parts: [{ text: prompt }] }]
        }
    );

    return result.data;
};
