import { GoogleGenerativeAI } from "@google/generative-ai";

async function listModels() {
    const apiKey = process.argv[2];
    if (!apiKey) {
        console.error("Usage: npx tsx scripts/list-models.ts <API_KEY>");
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    try {
        const result = await genAI.listModels();
        console.log("Available models:");
        result.models.forEach((m) => {
            console.log(`- ${m.name} (supports: ${m.supportedGenerationMethods.join(", ")})`);
        });
    } catch (error) {
        console.error("Error listing models:", error);
    }
}

listModels();
