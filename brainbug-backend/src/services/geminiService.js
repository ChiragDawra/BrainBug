import axios from "axios";

// Helper function to wait/delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to detect language from file path
const getLanguageFromPath = (filePath) => {
    const ext = filePath.split('.').pop()?.toLowerCase();
    const langMap = {
        'ts': 'TypeScript',
        'tsx': 'TypeScript',
        'js': 'JavaScript',
        'jsx': 'JavaScript',
        'py': 'Python',
        'java': 'Java'
    };
    return langMap[ext] || 'Other';
};

export const analyzeWithGemini = async (code, mlOutput, filePath = "", retries = 3) => {
    // Extract project name and language from filePath
    const projectName = filePath ? filePath.split('/').filter(Boolean)[0] || 'Unknown' : 'Unknown';
    const language = filePath ? getLanguageFromPath(filePath) : 'Other';

    const prompt = `
    You are BrainBug AI. Analyze the following code and return a JSON object with the following structure:
    {
      "bugType": "string (e.g., 'Logic Error', 'Syntax Error', 'Performance Issue', etc.)",
      "rootCause": "string (detailed explanation of why this bug exists)",
      "recommendation": "string (general recommendation for avoiding this type of bug)",
      "suggestedFix": "string (specific code fix or improvement suggestion)"
    }

    ML Model Analysis (Hugging Face - Sagar123x/brainbug):
    ${JSON.stringify(mlOutput, null, 2)}

    File Path: ${filePath || 'Not provided'}

    Analyze the code deeply and provide:
    - The most critical bug type found
    - Root cause analysis
    - Recommendation for improvement
    - Suggested fix (You may use the ML model's output as a reference, but verify it)

    Code:
    ${code}

    IMPORTANT: Return ONLY valid JSON, no additional text or markdown formatting.
    `;

    // Try different models in order of preference
    const models = [
        'gemini-2.5-flash',
        'gemini-2.0-flash',
        'gemini-1.5-flash-latest'  // Fallback
    ];

    let lastError = null;

    // Try each model
    for (const model of models) {
        // Retry logic for each model
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                console.log(`Attempting Gemini API call with ${model} (attempt ${attempt}/${retries})...`);

                const result = await axios.post(
                    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
                    {
                        contents: [{ parts: [{ text: prompt }] }]
                    },
                    {
                        timeout: 30000 // 30 second timeout
                    }
                );

                // Extract the text from Gemini's response
                const analysisText = result.data.candidates?.[0]?.content?.parts?.[0]?.text;

                console.log(`Analysis: ${analysisText}`)

                if (!analysisText) {
                    throw new Error("No analysis text returned from Gemini.");
                }

                // 3. NEW: Parse the text response into a JSON object
                let parsedAnalysis;
                try {
                    parsedAnalysis = JSON.parse(analysisText);
                } catch (parseError) {
                    console.error("Critical: Gemini response was not valid JSON.");
                    console.error("Raw Response:", analysisText);
                    // This is a failure, throw an error to trigger retry/failure
                    throw new Error(`Failed to parse Gemini JSON: ${parseError.message}`);
                }

                console.log(`✓ Successfully analyzed and parsed with ${model}`);

                return {
                    analysis: parsedAnalysis, // Return the object, not text
                    model: model,
                    rawResponse: result.data
                };

            } catch (error) {
                lastError = error;
                const errorMessage = error.response?.data?.error?.message || error.message;
                const errorCode = error.response?.data?.error?.code || error.response?.status;

                console.error(`✗ Gemini API Error (${model}, attempt ${attempt}): ${errorCode} - ${errorMessage}`);

                // If model not found, try next model immediately
                if (errorCode === 404) {
                    console.log(`Model ${model} not available, trying next model...`);
                    break; // Break retry loop, try next model
                }

                // If overloaded or rate limited, wait before retrying
                if (errorCode === 503 || errorCode === 429) {
                    if (attempt < retries) {
                        const waitTime = attempt * 2000; // Exponential backoff: 2s, 4s, 6s
                        console.log(`Waiting ${waitTime}ms before retry...`);
                        await delay(waitTime);
                        continue; // Retry same model
                    }
                }

                // For other errors, if not last attempt, retry
                if (attempt < retries) {
                    await delay(1000);
                    continue;
                }
            }
        }
    }

    // If all models and retries failed
    console.error("All Gemini models failed. Returning fallback response.");
    throw new Error(`Failed to analyze code with Gemini after trying all models: ${lastError?.response?.data?.error?.message || lastError?.message}`);
};