// Selecting elements
const btn = document.querySelector('.talk');
const content = document.querySelector('.content');

// Helper functions for text-to-speech
function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.volume = 1;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
}

function wishUser() {
    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";
    speak(`${greeting}, Boss! How may I assist you today?`);
}

// Speech recognition setup
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript.toLowerCase();
    content.textContent = transcript;
    processCommand(transcript);
}

// Event listener for button
btn.addEventListener('click', () => {
    content.textContent = "Listening...";
    recognition.start();
});

// Command processing
function processCommand(command) {
    const greetings = ["hey", "hello"];
    if (greetings.some(greet => command.includes(greet))) {
        speak("Hello Sir, How may I assist you?");
    } else if (command.includes("open google")) {
        window.open("https://google.com", "_blank");
        speak("Opening Google...");
    } else if (command.includes("what time")) {
        speak(`The current time is ${new Date().toLocaleTimeString()}`);
    } else if (command.includes("remember that")) {
        const info = command.split("remember that")[1].trim();
        remember("note", info);
        speak("Got it! I'll remember that.");
    } else if (command.includes("what do you remember")) {
        const note = recall("note");
        if (note) speak(`You asked me to remember that: ${note}`);
        else speak("I don't have any notes saved.");
    } else if (command.includes("weather")) {
        fetchWeather("CityName");
    } else if (command.includes("learn this")) {
        const [key, response] = command.split("learn this").map(s => s.trim());
        remember(key, response);
        speak("I’ve learned something new.");
    } else {
        const response = recall(command);
        if (response) {
            speak(response);
        } else {
            speak(`I found some information for ${command} on Google.`);
            window.open(`https://www.google.com/search?q=${command.replace(" ", "+")}`, "_blank");
        }
    }
}

// LocalStorage management for memory
function remember(topic, info) {
    localStorage.setItem(topic, info);
}

function recall(topic) {
    return localStorage.getItem(topic);
}

// Weather fetch function using OpenWeather API
function fetchWeather(city) {
    const apiKey = 'YOUR_API_KEY';
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            const temp = Math.round(data.main.temp - 273.15);
            speak(`The temperature in ${city} is ${temp} degrees Celsius.`);
        })
        .catch(error => speak("I couldn't retrieve the weather data."));
}

// Initialize on load
window.addEventListener('load', () => {
    speak("Initializing JARVIS...");
    wishUser();
});
