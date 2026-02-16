const apiKey = "AIzaSyAxn8It3652L2h7Yjmjqr7HkvEOriKvVds";
const modelId = "gemini-1.5-flash";

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
        console.log(`Test result for ${modelId}:`, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error(`Error testing ${modelId}:`, error);
    }
}

testModel();
