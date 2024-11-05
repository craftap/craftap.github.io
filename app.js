const btn = document.querySelector('.talk');
const content = document.querySelector('.content');

function speak(text) {
    const text_speak = new SpeechSynthesisUtterance(text);
    text_speak.rate = 1;
    text_speak.volume = 1;
    text_speak.pitch = 1;
    window.speechSynthesis.speak(text_speak);
}

function wishMe() {
    const day = new Date();
    const hour = day.getHours();

    if (hour >= 0 && hour < 12) {
        speak("Good Morning Boss...");
    } else if (hour >= 12 && hour < 17) {
        speak("Good Afternoon Master...");
    } else {
        speak("Good Evening Sir...");
    }
}

window.addEventListener('load', () => {
    speak("Initializing JARVIS..");
    wishMe();
});

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.onresult = (event) => {
    const currentIndex = event.resultIndex;
    const transcript = event.results[currentIndex][0].transcript;
    content.textContent = transcript;
    takeCommand(transcript.toLowerCase());
}

btn.addEventListener('click', () => {
    content.textContent = "Listening....";
    recognition.start();
});

function remember(topic, info) {
    localStorage.setItem(topic, info);
}

function recall(topic) {
    return localStorage.getItem(topic);
}

function takeCommand(message) {
    if (message.includes('hey') || message.includes('hello')) {
        speak("Hello Sir, How May I Help You?");
    } else if (message.includes("open google")) {
        window.open("https://google.com", "_blank");
        speak("Opening Google...");
    } else if (message.includes("open youtube")) {
        window.open("https://youtube.com", "_blank");
        speak("Opening Youtube...");
    } else if (message.includes("open facebook")) {
        window.open("https://facebook.com", "_blank");
        speak("Opening Facebook...");
    } else if (message.includes('what is') || message.includes('who is') || message.includes('what are')) {
        window.open(`https://www.google.com/search?q=${message.replace(" ", "+")}`, "_blank");
        const finalText = "This is what I found on the internet regarding " + message;
        speak(finalText);
    } else if (message.includes('wikipedia')) {
        window.open(`https://en.wikipedia.org/wiki/${message.replace("wikipedia", "").trim()}`, "_blank");
        const finalText = "This is what I found on Wikipedia regarding " + message;
        speak(finalText);
    } else if (message.includes('time')) {
        const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        speak("The current time is " + time);
    } else if (message.includes('date')) {
        const date = new Date().toLocaleDateString([], {month: 'long', day: 'numeric'});
        speak("Today's date is " + date);
    } else if (message.includes('weather')) {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=CityName&appid=YOUR_API_KEY`)
            .then(response => response.json())
            .then(data => {
                const temp = Math.round(data.main.temp - 273.15);
                speak(`The temperature in CityName is ${temp} degrees Celsius.`);
            })
            .catch(error => speak("I couldn't retrieve the weather data."));
    } else if (message.includes('remember that')) {
        const info = message.split("remember that")[1].trim();
        remember('note', info);
        speak("Got it! I'll remember that.");
    } else if (message.includes('what do you remember')) {
        const note = recall('note');
        if (note) {
            speak("You asked me to remember that " + note);
        } else {
            speak("I don't have any notes.");
        }
    } else if (message.includes('learn this')) {
        const [key, response] = message.split("learn this").map(s => s.trim());
        remember(key, response);
        speak("I’ve learned something new.");
    } else {
        const response = recall(message);
        if (response) {
            speak(response);
        } else {
            window.open(`https://www.google.com/search?q=${message.replace(" ", "+")}`, "_blank");
            speak("I found some information for " + message + " on Google.");
        }
    }
}
