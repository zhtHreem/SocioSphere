import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import axios from "axios"; // For HTTP requests
import {jwtDecode} from "jwt-decode"; // Correct import for decoding JWTs
import "./chat.css";

const socket = io("http://localhost:5000"); // Replace with your backend URL

const Chat = ({ societyId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [userId, setUserId] = useState(null);

  // Decode the JWT token to get the user ID
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.userId || decoded.id); // Handle both possible field names
      } catch (error) {
        console.error("Failed to decode token", error);
      }
    } else {
      console.error("Token not found in localStorage");
    }
  }, []);

  // Fetch messages for the society and set up Socket.IO listeners
  useEffect(() => {
    if (!societyId) return;

    const fetchMessages = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(`http://localhost:5000/api/chats/${societyId}`, {
          headers: { Authorization: token },
        });
        setMessages(response.data);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };

    fetchMessages();

    // Join society room and listen for new messages
    socket.emit("joinSociety", societyId);

    socket.on("newMessage", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, [societyId]);

  // Send a new message
  const sendMessage = async () => {
    if (!newMessage.trim() || !userId) {
      console.warn("Message content or User ID is missing");
      return;
    }

    const token = localStorage.getItem("token");
    const payload = { society: societyId, message: newMessage };

    try {
      const response = await axios.post("http://localhost:5000/api/chats", payload, {
        headers: { Authorization: token },
      });
      socket.emit("sendMessage", response.data); // Notify other users
      setNewMessage(""); // Clear the input field
    } catch (error) {
      console.error("Error occurred while sending message:", error);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>Society Chat</h2>
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
