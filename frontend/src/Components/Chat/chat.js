import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import "./chat.css";

// Connect to the Socket.IO server
const socket = io("http://localhost:5000"); // Replace with your backend URL

const Chat = () => {
  // Hardcoded userId and societyId
  const userId = "635a6c4e9123b4f4d5e1f2a1"; // Replace with a valid ObjectId
  const societyId = "635a6c4e9123b4f4d5e1f2a2"; // Replace with a valid ObjectId

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (societyId) {
      console.log("Hardcoded Society ID:", societyId);
      console.log("Hardcoded User ID:", userId);

      // Join the society room
      socket.emit("joinSociety", societyId);

      // Fetch previous messages
      socket.on("previousMessages", (previousMessages) => {
        setMessages(previousMessages);
      });

      // Listen for new messages
      socket.on("newMessage", (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });
    }

    return () => {
      socket.disconnect();
    };
  }, [societyId]);

  const sendMessage = () => {
    if (newMessage.trim()) {
      const payload = {
        sender: userId, // Hardcoded userId
        society: societyId, // Hardcoded societyId
        message: newMessage,
      };
      console.log("Sending message payload:", payload); // Debugging
      socket.emit("sendMessage", payload);
      setNewMessage(""); // Clear the input field
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>Society Chat</h2>
        <p>Chatting in society ID: {societyId}</p>
      </div>
      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`chat-message ${msg.sender === userId ? "self" : "other"}`}
          >
            <div className="message-content">
              <strong>{msg.sender === userId ? "You" : `User ${msg.sender}`}:</strong>
              <p>{msg.message}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
