const fs = require("fs");
const path = require("path");

function getApiKey() {
    const envPath = path.join(__dirname, ".env.local");
    if (!fs.existsSync(envPath)) return null;
    const content = fs.readFileSync(envPath, "utf8");
    const match = content.match(/GEMINI_API_KEY=(.*)/);
    return match ? match[1].trim() : null;
}

async function listSupportedModels() {
    const apiKey = getApiKey();
    if (!apiKey) {
        console.error("No se encontró la API key en .env.local");
        return;
    }

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();

        if (data.error) {
            console.error("Error de la API:", data.error.message);
            return;
        }

        console.log("--- MODELOS QUE SOPORTAN GENERATECONTENT ---");
        const supported = (data.models || []).filter(m =>
            m.supportedGenerationMethods.includes("generateContent")
        );

        if (supported.length === 0) {
            console.log("No se encontraron modelos con 'generateContent'.");
            console.log("Todos los modelos disponibles:", (data.models || []).map(m => m.name).join(", "));
        } else {
            supported.forEach(m => {
                console.log(`- ${m.name} (${m.displayName})`);
            });
        }
    } catch (error) {
        console.error("Error en el diagnóstico:", error);
    }
}

listSupportedModels();
