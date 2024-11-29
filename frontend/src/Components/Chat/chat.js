import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000'); // Adjust if hosted

const Chat = ({ sessionId, userId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    // Fetch messages
    axios.get(`/api/chat/${sessionId}`).then((response) => {
      setMessages(response.data);
    });

    // Listen for real-time messages
    socket.on('message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.off('message');
    };
  }, [sessionId]);

  const sendMessage = async () => {
    if (input.trim()) {
      const newMessage = { sender: userId, content: input, session: sessionId };
      try {
        await axios.post('/api/chat', newMessage);
        socket.emit('message', newMessage);
        setInput('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  return (
    <div>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <strong>{msg.sender}: </strong>{msg.content}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;
