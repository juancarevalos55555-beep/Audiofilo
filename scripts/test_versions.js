const apiKey = process.env.GEMINI_API_KEY;

async function testVersions() {
    const versions = ['v1', 'v1beta'];
    const modelId = "gemini-1.5-flash";

    for (const v of versions) {
        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/${v}/models/${modelId}:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: "Hola" }] }]
                })
            });
            const data = await response.json();
            console.log(`Test ${v} for ${modelId}:`, data.error ? data.error.message : "SUCCESS!");
        } catch (e) {
            console.log(`Error ${v}:`, e.message);
        }
    }
}

testVersions();
