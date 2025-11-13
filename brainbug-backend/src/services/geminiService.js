import axios from "axios";

// Helper function to wait/delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const analyzeWithGemini = async (code, mlOutput, retries = 3) => {
    const prompt = `
    You are BrainBug AI. Analyze this code and provide ONLY ONE concise line (max 100 characters).
    
    ML Model Detection: ${JSON.stringify(mlOutput, null, 2)}
    
    Code:
    ${code}
    
    Format your response as ONE line following this pattern:
    "✓ [Status] | [Key Issue/Suggestion] | Severity: [Low/Med/High]"
    
    Examples:
    - "✓ Clean | Consider adding input validation | Severity: Medium"
    - "✗ Bug Found | Undefined variable 'x' at line 12 | Severity: High"
    - "✓ Optimal | No issues detected, code looks good | Severity: Low"
    
    Respond with ONLY the single line, no explanation, no markdown, no extra text.
    `;

    // Try different models in order of preference
    const models = [
        'gemini-2.5-flash',
        'gemini-2.0-flash',
        'gemini-1.5-flash-latest'  // Fallback to legacy model if available
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
                let analysisText = result.data.candidates?.[0]?.content?.parts?.[0]?.text || "✓ Analysis unavailable";
                
                // Clean up the response - remove any extra whitespace, newlines, markdown
                analysisText = analysisText
                    .trim()
                    .replace(/```.*?```/gs, '') // Remove code blocks
                    .replace(/\n+/g, ' ') // Replace newlines with space
                    .replace(/\s+/g, ' ') // Collapse multiple spaces
                    .trim();
                
                // Take only first line if multiple lines somehow returned
                analysisText = analysisText.split('\n')[0];
                
                // Truncate if too long (max 150 chars for safety)
                if (analysisText.length > 150) {
                    analysisText = analysisText.substring(0, 147) + '...';
                }
                
                console.log(`✓ Successfully analyzed with ${model}`);
                console.log(`Analysis: ${analysisText}`);
                
                return {
                    analysis: analysisText,
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