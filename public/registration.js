// Initialize Socket.io client for registration
const socket = io('http://localhost:3000');
console.log('Socket connected:', socket.id);

// DOM elements for registration
let usernameInput = document.getElementById('username');
let connectBtn = document.getElementById('connectBtn');

if (!usernameInput || !connectBtn) {
    console.error('Registration elements not found:', { usernameInput, connectBtn });
}

// Handle registration when "Connect As" button is clicked
connectBtn.addEventListener('click', () => {
    console.log('Connect As button clicked');
    const username = usernameInput.value.trim();
    if (username) {
        console.log('Sending register event with username:', username);
        socket.emit('register', username);
    } else {
        console.log('No username entered');
    }
});

// Process successful registration
socket.on('registrationSuccess', (data) => {
    console.log('Received registrationSuccess:', data);
    socket.username = data.username;
    console.log('Socket username set to:', socket.username);

    // Re-query elements to ensure they are available
    usernameInput = document.getElementById('username');
    connectBtn = document.getElementById('connectBtn');
    if (usernameInput && connectBtn) {
        console.log('Disabling usernameInput and connectBtn');
        usernameInput.disabled = true;
        connectBtn.disabled = true;
        usernameInput.setAttribute('disabled', 'disabled'); 
        connectBtn.setAttribute('disabled', 'disabled');   
        addMessage(data.message);
    } else {
        console.error('Error: usernameInput or connectBtn not found during registrationSuccess:', { usernameInput, connectBtn });
    }
});

// Handle registration errors
socket.on('registrationError', (message) => {
    console.log('Received registrationError:', message);
    addMessage(message);
    usernameInput.value = '';
});

// Add a message to the message area (shared function)
function addMessage(text, color = 'black') {
    const messagesDiv = document.getElementById('messages');
    console.log('Adding message to UI:', text);
    const p = document.createElement('p');
    p.className = `message ${color}`;
    p.textContent = text;
    messagesDiv.appendChild(p);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Expose socket and addMessage for messaging.js
window.socket = socket;
window.addMessage = addMessage;