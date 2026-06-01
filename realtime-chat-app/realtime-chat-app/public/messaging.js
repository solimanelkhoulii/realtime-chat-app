// Ensure DOM is fully loaded before accessing elements
document.addEventListener('DOMContentLoaded', () => {
    // Use the socket and addMessage from registration.js
    const socket = window.socket;
    const addMessage = window.addMessage;

    if (!socket || !addMessage) {
        console.error('Socket or addMessage not found in messaging.js:', { socket, addMessage });
        return;
    }

    // DOM elements for messaging
    const messagesDiv = document.getElementById('messages');
    const sendMessageInput = document.getElementById('sendMessage');
    const sendBtn = document.getElementById('sendBtn');
    const clearBtn = document.getElementById('clearBtn');

    if (!messagesDiv || !sendMessageInput || !sendBtn || !clearBtn) {
        console.error('Messaging elements not found:', { messagesDiv, sendMessageInput, sendBtn, clearBtn });
        return;
    }

    // Set up event listeners for sending messages
    sendBtn.addEventListener('click', () => {
        console.log('SEND button clicked');
        sendMessage();
    });
    console.log('Send button listener attached');

    sendMessageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            console.log('Enter key pressed');
            sendMessage();
        }
    });
    console.log('Keypress listener attached');

    // Clear the local message area
    clearBtn.addEventListener('click', () => {
        console.log('Clearing messages');
        messagesDiv.innerHTML = '';
    });
    console.log('Clear button listener attached');

    // Display incoming messages
    socket.on('message', (data) => {
        console.log('Received message:', data);
        let displayName = data.sender;
        if (socket.username === data.sender) displayName = 'Me';
        let messageText = `${displayName}: ${data.message}`;
        if (data.isPrivate && socket.username === data.sender && data.to) {
            messageText = `Me {to: ${data.to}}: ${data.message}`;
        }
        addMessage(messageText, data.color);
    });

    // Send a message (public, private, or group)
    function sendMessage() {
        console.log('sendMessage called');
        const message = sendMessageInput.value.trim();
        console.log('Sending message:', message, 'with username:', socket.username);
        if (message && socket.username) {
            const privateMatch = message.match(/^([^:]+):(.*)$/);
            if (privateMatch) {
                const recipients = privateMatch[1].split(',').map(r => r.trim());
                const msg = privateMatch[2].trim();
                if (recipients.length > 1) {
                    console.log('Sending group message to:', recipients);
                    socket.emit('groupMessage', { recipients, message: msg });
                } else {
                    console.log('Sending private message to:', recipients[0]);
                    socket.emit('privateMessage', { recipient: recipients[0], message: msg });
                }
            } else {
                console.log('Sending public message');
                socket.emit('publicMessage', message);
            }
            sendMessageInput.value = '';
        } else {
            console.log('Message not sent: Empty message or no username');
            console.log('Message value:', message, 'Socket username:', socket.username);
        }
    }
});