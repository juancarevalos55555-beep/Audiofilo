const apiKey = "AIzaSyAxn8It3652L2h7Yjmjqr7HkvEOriKvVds"; // Hardcoded for diagnostic to avoid env issues in this script

async function listModels() {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();
        if (data.models) {
            console.log("Available Models:");
            data.models.forEach(m => {
                console.log(`${m.name} - ${m.displayName}`);
            });
        } else {
            console.log("No models found or error:", JSON.stringify(data, null, 2));
        }
    } catch (error) {
        console.error("Error listing models:", error);
    }
}

listModels();
