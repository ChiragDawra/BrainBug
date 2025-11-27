import dotenv from 'dotenv';
import { runMLModel } from './src/services/mlService.js';
import { analyzeWithGemini } from './src/services/geminiService.js';

dotenv.config();

const testPipeline = async () => {
    console.log("🚀 Starting Pipeline Test...");
    console.log("HF_TOKEN present:", !!process.env.HF_TOKEN);
    if (process.env.HF_TOKEN) {
        console.log("HF_TOKEN length:", process.env.HF_TOKEN.length);
    }

    const buggyCode = `
    def calculate_average(numbers):
        total = 0
        for num in numbers:
            total += num
        return total / len(numbers) # Potential division by zero
    `;

    console.log("\n1. Testing Hugging Face Integration...");
    try {
        const mlOutput = await runMLModel(buggyCode);
        console.log("✅ HF Output:", JSON.stringify(mlOutput, null, 2));

        if (mlOutput.error) {
            console.error("❌ HF Error:", mlOutput.error);
            return;
        }

        console.log("\n2. Testing Gemini Integration (with HF output)...");
        const geminiOutput = await analyzeWithGemini(buggyCode, mlOutput, "test.py");
        console.log("✅ Gemini Output:", JSON.stringify(geminiOutput, null, 2));

        console.log("\n🎉 Pipeline Test Completed Successfully!");

    } catch (error) {
        console.error("❌ Test Failed:", error);
    }
};

testPipeline();
