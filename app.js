// script.js
const output = document.getElementById('output');
const startButton = document.getElementById('start-button');

// Check for speech recognition support
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.onstart = () => {
    output.textContent = "Listening...";
};

recognition.onspeechend = () => {
    output.textContent = "Stopped listening.";
    recognition.stop();
};

recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    output.textContent = `You said: ${transcript}`;
    processCommand(transcript);
};

startButton.addEventListener('click', () => {
    recognition.start();
});

// Function to process voice commands
function processCommand(command) {
    command = command.toLowerCase();
    if (command.includes('hello')) {
        output.textContent += ' - Hello! How can I assist you today?';
    } else if (command.includes('time')) {
        const now = new Date();
        output.textContent += ` - The current time is ${now.toLocaleTimeString()}.`;
    } else if (command.includes('date')) {
        const today = new Date();
        output.textContent += ` - Today is ${today.toLocaleDateString()}.`;
    } else {
        output.textContent += " - I'm not sure how to help with that.";
    }
}
