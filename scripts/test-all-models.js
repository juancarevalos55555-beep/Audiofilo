const apiKey = "AIzaSyAxn8It3652L2h7Yjmjqr7HkvEOriKvVds";
const models = [
    "gemini-1.5-flash",
    "gemini-1.5-pro",
    "gemini-1.5-flash-002",
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite",
    "gemini-2.5-flash"
];

async function testModels() {
    for (const modelId of models) {
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
                console.log(`❌ ${modelId}: ${data.error.message} (${data.error.status})`);
            } else {
                console.log(`✅ ${modelId}: Success!`);
            }
        } catch (error) {
            console.error(`Error testing ${modelId}:`, error);
        }
    }
}

testModels();
