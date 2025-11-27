import axios from "axios";
import fs from "fs/promises";
import path from "path";

/**
 * Simple tokenization for code
 * Preserves code structure and syntax
 */
const tokenizeCode = (code) => {
    // Split by whitespace while preserving code structure
    const tokens = code
        .split(/(\s+|[{}()\[\];,.:])/)
        .filter(token => token.trim().length > 0);

    return tokens;
};

/**
 * Read code file
 */
const readCodeFile = async (filePath) => {
    try {
        const content = await fs.readFile(filePath, 'utf-8');

        const fileInfo = {
            name: path.basename(filePath),
            extension: path.extname(filePath),
            language: detectLanguage(path.extname(filePath)),
            size: content.length,
            lines: content.split('\n').length
        };

        const tokens = tokenizeCode(content);

        return {
            content,
            tokens,
            tokenCount: tokens.length,
            fileInfo
        };
    } catch (error) {
        throw new Error(`Failed to read file: ${error.message}`);
    }
};

/**
 * Detect programming language from file extension
 */
const detectLanguage = (extension) => {
    const langMap = {
        '.js': 'JavaScript',
        '.jsx': 'JavaScript',
        '.ts': 'TypeScript',
        '.tsx': 'TypeScript',
        '.py': 'Python',
        '.java': 'Java',
        '.cpp': 'C++',
        '.c': 'C',
        '.cs': 'C#',
        '.rb': 'Ruby',
        '.go': 'Go',
        '.php': 'PHP',
        '.swift': 'Swift',
        '.kt': 'Kotlin',
        '.rs': 'Rust'
    };
    return langMap[extension.toLowerCase()] || 'Unknown';
};

/**
 * Prepare code analysis prompt
 */
const prepareCodeAnalysisPrompt = (code, language, analysisType = 'errors') => {
    const prompts = {
        errors: `Find errors and bugs in this ${language} code and suggest fixes:\n\n${code}`,
        corrections: `Review this ${language} code and provide corrections:\n\n${code}`,
        optimize: `Analyze this ${language} code and suggest optimizations:\n\n${code}`,
        explain: `Explain what this ${language} code does:\n\n${code}`,
        security: `Check this ${language} code for security vulnerabilities:\n\n${code}`
    };

    return prompts[analysisType] || prompts.errors;
};

/**
 * Chunk code intelligently (by functions/blocks if possible)
 */
const chunkCode = (code, maxLength = 800) => {
    // Try to split by functions or logical blocks
    const lines = code.split('\n');
    const chunks = [];
    let currentChunk = [];
    let currentLength = 0;

    for (const line of lines) {
        const lineLength = line.length + 1; // +1 for newline

        if (currentLength + lineLength > maxLength && currentChunk.length > 0) {
            chunks.push(currentChunk.join('\n'));
            currentChunk = [line];
            currentLength = lineLength;
        } else {
            currentChunk.push(line);
            currentLength += lineLength;
        }
    }

    if (currentChunk.length > 0) {
        chunks.push(currentChunk.join('\n'));
    }

    return chunks.length > 0 ? chunks : [code];
};

/**
 * Analyze code file with ML model
 */
export const analyzeCodeFile = async (filePath, options = {}) => {
    try {
        if (!process.env.HF_TOKEN) {
            console.warn("HF_TOKEN is missing in .env");
            return { error: "HF_TOKEN missing" };
        }

        console.log(`\n📁 Reading code file: ${filePath}`);
        const { content, tokens, tokenCount, fileInfo } = await readCodeFile(filePath);

        console.log(`📊 File Info:`, fileInfo);
        console.log(`🔢 Total tokens: ${tokenCount}`);

        // Prepare analysis prompt
        const analysisType = options.analysisType || 'errors';
        const prompt = prepareCodeAnalysisPrompt(
            content,
            fileInfo.language,
            analysisType
        );

        // Chunk code if too long
        const chunks = chunkCode(prompt, options.maxChunkLength || 800);
        console.log(`📦 Split into ${chunks.length} chunk(s) for analysis`);

        // Analyze each chunk
        const analyses = [];
        for (let i = 0; i < chunks.length; i++) {
            console.log(`🔍 Analyzing chunk ${i + 1}/${chunks.length}...`);

            const response = await axios.post(
                "https://router.huggingface.co/models/Sagar123x/brainbug",
                { inputs: chunks[i] },
                {
                    headers: {
                        Authorization: `Bearer ${process.env.HF_TOKEN}`,
                        "Content-Type": "application/json",
                    },
                    timeout: 30000
                }
            );

            // Extract the analysis result
            const analysis = response.data[0]?.generated_text || response.data;
            analyses.push({
                chunkIndex: i + 1,
                analysis: analysis
            });

            // Small delay to avoid rate limiting
            if (i < chunks.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }

        return {
            success: true,
            file: fileInfo,
            code: content,
            tokenization: {
                totalTokens: tokenCount,
                sampleTokens: tokens.slice(0, 30)
            },
            analysisType,
            chunksAnalyzed: chunks.length,
            results: analyses,
            summary: analyses.map(a => a.analysis).join('\n')
        };

    } catch (error) {
        console.error("❌ ML Processing Error:", error.message);
        console.error("Status:", error.response?.status);
        console.error("Error Data:", JSON.stringify(error.response?.data, null, 2));

        return {
            error: "Failed to analyze code with ML model",
            status: error.response?.status,
            details: error.response?.data || error.message
        };
    }
};

/**
 * Analyze code string directly (without file)
 */
export const analyzeCode = async (code, language = 'JavaScript', analysisType = 'errors') => {
    try {
        if (!process.env.HF_TOKEN) {
            console.warn("HF_TOKEN is missing in .env");
            return { error: "HF_TOKEN missing" };
        }

        const tokens = tokenizeCode(code);
        console.log(`🔢 Code tokens: ${tokens.length}`);

        const prompt = prepareCodeAnalysisPrompt(code, language, analysisType);
        const chunks = chunkCode(prompt, 800);

        console.log(`🔍 Analyzing ${chunks.length} chunk(s)...`);

        const analyses = [];
        for (let i = 0; i < chunks.length; i++) {
            const response = await axios.post(
                "https://router.huggingface.co/models/Sagar123x/brainbug",
                { inputs: chunks[i] },
                {
                    headers: {
                        Authorization: `Bearer ${process.env.HF_TOKEN}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const analysis = response.data[0]?.generated_text || response.data;
            analyses.push(analysis);

            if (i < chunks.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }

        return {
            success: true,
            language,
            analysisType,
            tokenCount: tokens.length,
            results: analyses,
            summary: analyses.join('\n')
        };

    } catch (error) {
        console.error("❌ Analysis Error:", error.message);
        return {
            error: "Failed to analyze code",
            details: error.response?.data || error.message
        };
    }
};

/**
 * Original ML model function (kept for backward compatibility)
 */
export const runMLModel = async (input) => {
    try {
        if (!process.env.HF_TOKEN) {
            return { error: "HF_TOKEN missing" };
        }

        const response = await axios.post(
            "https://router.huggingface.co/models/Sagar123x/brainbug",
            { inputs: input },
            {
                headers: {
                    Authorization: `Bearer ${process.env.HF_TOKEN}`,
                    "Content-Type": "application/json",
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error("HF API Error:", error.message);
        return {
            error: "Failed to get analysis from ML model",
            details: error.response?.data || error.message
        };
    }
};

export { tokenizeCode, readCodeFile, chunkCode };