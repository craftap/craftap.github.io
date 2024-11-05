const content = document.querySelector('.content');
const btn = document.querySelector('.talk');

// Function to speak text
function speak(text) {
    const textSpeak = new SpeechSynthesisUtterance(text);
    textSpeak.rate = 1;
    textSpeak.volume = 1;
    textSpeak.pitch = 1;
    window.speechSynthesis.speak(textSpeak);
}

// Initial greeting based on time of day
function wishMe() {
    const hour = new Date().getHours();
    if (hour < 12) {
        speak("Good Morning, Boss.");
    } else if (hour < 17) {
        speak("Good Afternoon, Master.");
    } else {
        speak("Good Evening, Sir.");
    }
}

window.addEventListener('load', () => {
    speak("Initializing JARVIS...");
    wishMe();
});

// Set up continuous speech recognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.interimResults = false;

// Handle speech recognition results
recognition.onresult = async (event) => {
    const transcript = event.results[event.resultIndex][0].transcript.toLowerCase();
    content.textContent = transcript;
    await takeCommand(transcript);
};

// Start recognition immediately
recognition.start();

// Function to get a response from OpenAI's API
async function openAIResponse(prompt) {
    const apiKey = "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";

    try {
        const response = await fetch("https://api.openai.com/v1/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "text-davinci-003",
                prompt: prompt,
                max_tokens: 100,
                temperature: 0.7,
            })
        });
        const data = await response.json();
        const message = data.choices[0].text.trim();
        return message;
    } catch (error) {
        console.error("Error:", error);
        speak("Sorry, I'm having trouble connecting to my intelligence.");
    }
}

// Process commands and respond accordingly
async function takeCommand(message) {
    if (message.includes('open google')) {
        window.open("https://google.com", "_blank");
        speak("Opening Google.");
    } else if (message.includes('open youtube')) {
        window.open("https://youtube.com", "_blank");
        speak("Opening YouTube.");
    } else if (message.includes('time')) {
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        speak("The current time is " + time);
    } else if (message.includes('date')) {
        const date = new Date().toLocaleDateString([], { month: 'long', day: 'numeric' });
        speak("Today's date is " + date);
    } else {
        // Send the command to OpenAI for a response
        const aiResponse = await openAIResponse(message);
        if (aiResponse) {
            speak(aiResponse);
        } else {
            speak("I'm sorry, I couldn't understand the request.");
        }
    }
}

// Button to manually activate listening
btn.addEventListener('click', () => {
    content.textContent = "Listening....";
    recognition.start();
});
