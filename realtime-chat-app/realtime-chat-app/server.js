const http = require('http');
const fs = require('fs');
const path = require('path');
const socketIo = require('socket.io');

// Create HTTP server to serve chat client files
const server = http.createServer((req, res) => {
    console.log('Request received for URL:', req.url);
    if (req.url === '/index.html' || req.url === '/') {
        const filePath = path.join(__dirname, 'public', 'index.html');
        fs.readFile(filePath, (err, data) => {
            if (err) {
                console.error(`Error loading index.html: ${err.message}`);
                res.writeHead(500);
                res.end('Error loading index.html');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);
        });
    } else if (req.url === '/registration.js') {
        const filePath = path.join(__dirname, 'public', 'registration.js');
        fs.readFile(filePath, (err, data) => {
            if (err) {
                console.error(`Error loading registration.js: ${err.message}`);
                res.writeHead(500);
                res.end('Error loading registration.js');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'application/javascript' });
            res.end(data);
        });
    } else if (req.url === '/messaging.js') {
        const filePath = path.join(__dirname, 'public', 'messaging.js');
        fs.readFile(filePath, (err, data) => {
            if (err) {
                console.error(`Error loading messaging.js: ${err.message}`);
                res.writeHead(500);
                res.end('Error loading messaging.js');
                return;
            }
            res.writeHead(200, { 'Content-Type': 'application/javascript' });
            res.end(data);
        });
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

// Initialize Socket.io for WebSocket communication
const io = socketIo(server);

// Store registered users (username -> socket mapping)
const users = new Map();

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Handle user registration
    socket.on('register', (username) => {
        console.log('Received register event with username:', username);
        if (isValidUsername(username) && !users.has(username)) {
            users.set(username, socket);
            socket.username = username;
            console.log('Emitting registrationSuccess for:', username);
            socket.emit('registrationSuccess', { message: `You are connected as ${username}`, username });
            console.log(`${username} registered successfully`);
        } else {
            console.log('Emitting registrationError for:', username);
            socket.emit('registrationError', 'ERROR: Invalid or duplicate username');
            console.log('Registration failed for:', username);
        }
    });

    // Handle public messages, sent to all registered users
    socket.on('publicMessage', (message) => {
        console.log('Received public message from', socket.username, ':', message);
        if (socket.username) {
            socket.emit('message', { sender: socket.username, message, isPrivate: false, color: 'blue' });
            users.forEach((targetSocket, targetUsername) => {
                if (targetSocket !== socket) {
                    targetSocket.emit('message', { sender: socket.username, message, isPrivate: false, color: 'black' });
                }
            });
        } else {
            console.log('Public message failed: No username set for socket');
        }
    });

    // Handle private messages, sent only to the specified recipient
    socket.on('privateMessage', (data) => {
        console.log('Received private message from', socket.username, ':', data);
        if (socket.username) {
            const { recipient, message } = data;
            const targetSocket = users.get(recipient);
            if (targetSocket) {
                targetSocket.emit('message', { sender: socket.username, message, isPrivate: true, color: 'green' });
                socket.emit('message', { sender: socket.username, message, isPrivate: true, to: recipient, color: 'green' });
            } else {
                console.log('Private message failed: Recipient not found:', recipient);
            }
        } else {
            console.log('Private message failed: No username set for socket');
        }
    });

    // Handle group messages, sent to a list of recipients
    socket.on('groupMessage', (data) => {
        console.log('Received group message from', socket.username, ':', data);
        if (socket.username) {
            const { recipients, message } = data;
            const validRecipients = recipients.filter(r => users.has(r) && r !== socket.username);
            validRecipients.forEach(recipient => {
                users.get(recipient).emit('message', { sender: socket.username, message, isPrivate: true, color: 'green' });
            });
            socket.emit('message', { sender: socket.username, message, isPrivate: true, to: recipients.join(', '), color: 'green' });
        } else {
            console.log('Group message failed: No username set for socket');
        }
    });

    // Clean up on disconnect
    socket.on('disconnect', () => {
        if (socket.username) {
            users.delete(socket.username);
            console.log(`${socket.username} disconnected`);
        }
    });
});

// Validates username against the required format and excludes reserved names
function isValidUsername(username) {
    const usernameRegex = /^[a-zA-Z][a-zA-Z0-9]*(?:\s[a-zA-Z0-9]+)*[a-zA-Z0-9]$/;
    return usernameRegex.test(username) && !['Me', 'me', 'ME'].includes(username);
}

server.listen(3000, () => {
    console.log('Server running at Port 3000. CTRL-C to quit');
    console.log('http://localhost:3000/');
});