# Real-time Chat Application

## Project Description

This project is a real-time chat application built using **Node.js** and **Socket.io**. It provides functionalities for public messaging, private messaging between users, and group messaging, offering a comprehensive solution for interactive communication.

## Features

*   **Real-time Communication**: Leverages Socket.io for instant message delivery and updates.
*   **Public Messaging**: Allows all connected users to participate in a general chat.
*   **Private Messaging**: Enables one-on-one conversations between specific users.
*   **Group Messaging**: Supports sending messages to a predefined group of recipients.
*   **User Registration and Session Management**: Handles user registration and maintains session state for connected users.

## Technologies Used

*   **Node.js**: Asynchronous event-driven JavaScript runtime environment.
*   **Socket.io**: A JavaScript library for real-time web applications. It enables real-time, bidirectional communication between web clients and servers.
*   **HTML/CSS/JavaScript**: For the client-side user interface and interactions.

## Installation and Setup

To get a local copy up and running, follow these simple steps:

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/YOUR_USERNAME/realtime-chat-app.git
    ```
2.  **Navigate to the project directory**:
    ```bash
    cd realtime-chat-app
    ```
3.  **Install dependencies**:
    ```bash
    npm install
    ```
4.  **Start the server**:
    ```bash
    npm start
    ```

The application will be accessible in your web browser at `http://localhost:3000/`.

## Usage

Upon accessing the application, users can register with a unique username. Once registered, they can send public messages, initiate private chats with other online users, or participate in group conversations.

## Project Structure

```
realtime-chat-app/
├── public/
│   ├── index.html
│   ├── messaging.js
│   └── registration.js
├── server.js
├── package.json
├── package-lock.json
└── README.md
```

*   `public/index.html`: The main client-side HTML file for the chat interface.
*   `public/messaging.js`: Client-side JavaScript for handling chat messages and Socket.io events.
*   `public/registration.js`: Client-side JavaScript for user registration.
*   `server.js`: The Node.js server that handles HTTP requests and Socket.io connections.
*   `package.json`: Defines project metadata and dependencies.
*   `README.md`: This project documentation file.

## Contributing

Contributions are welcome! Please feel free to fork the repository, create a new branch, and submit a pull request with your enhancements.

## License

This project is licensed under the ISC License - see the `LICENSE` file for details (if applicable).

## Contact

For any inquiries, please contact [Your Name/Email/GitHub Profile].
