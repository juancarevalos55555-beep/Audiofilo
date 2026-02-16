const apiKey = process.env.GEMINI_API_KEY;
const modelId = "gemini-2.5-pro";

async function testModel() {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: "Hola" }] }]
            })
        });
        const data = await response.json();
        if (data.error) {
            console.log(`❌ ${modelId}: ${data.error.message}`);
        } else {
            console.log(`✅ ${modelId}: Success!`);
        }
    } catch (error) {
        console.error(`Error testing ${modelId}:`, error);
    }
}

testModel();
