import { GoogleGenerativeAI } from "@google/generative-ai";

async function testModels() {
    const apiKey = process.argv[2];
    if (!apiKey) {
        console.error("Usage: npx tsx scripts/test-models.ts <API_KEY>");
        return;
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const modelsToTest = [
        "gemini-flash-latest",
        "gemini-1.5-flash",
        "gemini-2.0-flash",
        "gemini-2.0-flash-lite-preview-02-05",
        "gemini-1.5-flash-8b",
        "gemini-pro"
    ];

    for (const modelName of modelsToTest) {
        console.log(`Testing model: ${modelName}...`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("hola");
            console.log(`✅ Success with ${modelName}: ${result.response.text().substring(0, 30)}...`);
            break; // Stop at first success
        } catch (error: any) {
            console.log(`❌ Fail with ${modelName}: ${error.message}`);
        }
    }
}

testModels();
