import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { Avatar, Box, TextField, Typography, Paper, IconButton } from "@mui/material";
import { Send as SendIcon, EmojiEmotions as EmojiIcon } from "@mui/icons-material";
import { styled } from "@mui/system";

const StyledMessageBox = styled(Paper)(({ isCurrentUser }) => ({
  padding: '12px 16px',
  marginBottom: '8px',
  maxWidth: "70%",
  borderRadius: isCurrentUser ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
  backgroundColor: isCurrentUser ? '#6366f1' : '#ffffff',
  color: isCurrentUser ? '#ffffff' : '#000000',
  alignSelf: isCurrentUser ? "flex-end" : "flex-start",
  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  border: isCurrentUser ? 'none' : '1px solid #f0f0f0',
  transition: 'transform 0.2s ease',
  '&:hover': {
    transform: 'translateY(-1px)',
  },
}));

let socket;

const Chat = ({ societyId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [userId, setUserId] = useState(null);
  const [username, setUsername] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserId(decoded.userId || decoded.id);
        setUsername(decoded.username);
        setProfilePic(decoded.profilePic || "default-profile-pic-url");
      } catch (error) {
        console.error("Failed to decode token", error);
      }
    }
  }, []);

  useEffect(() => {
    socket = io(`${process.env.REACT_APP_HOST_URL}`, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on("connect", () => {
      setIsConnected(true);
      console.log("Socket connected");
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
      console.log("Socket disconnected");
    });

    return () => {
      if (socket) socket.close();
    };
  }, []);

  useEffect(() => {
    if (!societyId || !isConnected) return;

    const fetchMessages = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(`${process.env.REACT_APP_HOST_URL}/api/chats/${societyId}`, {
          headers: { Authorization: token },
        });
        setMessages(response.data);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };

    fetchMessages();
    socket.emit("joinSociety", societyId);

    const messageHandler = (message) => {
      // Only add the message if it's not already in the messages array
      setMessages((prevMessages) => {
        const messageExists = prevMessages.some(
          (msg) => msg._id === message._id
        );
        if (messageExists) return prevMessages;
        return [...prevMessages, message];
      });
    };

    socket.on("newMessage", messageHandler);

    return () => {
      socket.off("newMessage", messageHandler);
      socket.emit("leaveSociety", societyId);
    };
  }, [societyId, isConnected]);

  const sendMessage = async (e) => {
  e?.preventDefault();
  
  if (!newMessage.trim() || !userId) return;

  const token = localStorage.getItem("token");
  const payload = { society: societyId, message: newMessage };

  try {
    const response = await axios.post(`${process.env.REACT_APP_HOST_URL}/api/chats`, payload, {
      headers: { Authorization: token },
    });

    socket.emit("sendMessage", { ...response.data, sender: { _id: userId, username, profilePic } });

    setNewMessage(""); // Clear the input field
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

  const formatTimestamp = (date) => {
    return new Date(date).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc' }}>
      <Box sx={{ p: 2, borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'linear-gradient(145deg, #6366f1, #818cf8)', color: 'white', display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>
        <Avatar sx={{ width: 32, height: 32, backgroundColor: 'rgba(255,255,255,0.2)', fontSize: '0.9rem' }}>
          SC
        </Avatar>
        <Typography variant="h6" sx={{ fontSize: '1.1rem', fontWeight: 600 }}>
          Society Chat
        </Typography>
      </Box>

      <Box sx={{ flexGrow: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', p: 2, '&::-webkit-scrollbar': { width: '6px' }, '&::-webkit-scrollbar-track': { background: 'transparent' }, '&::-webkit-scrollbar-thumb': { background: 'rgba(0,0,0,0.1)', borderRadius: '10px' }}}>
        {messages.map((msg, idx) => {
          const isCurrentUser = msg.sender._id === userId;
          return (
            <Box key={idx} sx={{ display: 'flex', flexDirection: 'column', alignItems: isCurrentUser ? 'flex-end' : 'flex-start' }}>
              <StyledMessageBox isCurrentUser={isCurrentUser}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                  <Avatar src={msg.sender.profilePic || "default-profile-pic-url"} sx={{ width: 20, height: 20, mr: 1, border: isCurrentUser ? '2px solid rgba(255,255,255,0.8)' : '2px solid #6366f1' }} />
                  <Typography variant="caption" sx={{ fontWeight: 600, color: isCurrentUser ? 'rgba(255,255,255,0.9)' : '#6366f1' }}>
                    {isCurrentUser ? 'You' : msg.sender.username}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ lineHeight: 1.4 }}>
                  {msg.message}
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', mt: 0.5, textAlign: 'right', opacity: isCurrentUser ? 0.8 : 0.6, fontSize: '0.7rem' }}>
                  {formatTimestamp(msg.timestamp)}
                </Typography>
              </StyledMessageBox>
            </Box>
          );
        })}
        <div ref={messagesEndRef} />
      </Box>

      <Box component="form" onSubmit={sendMessage} sx={{ p: 2, borderTop: '1px solid #f0f0f0', backgroundColor: '#ffffff', boxShadow: '0 -2px 10px rgba(0,0,0,0.03)' }}>
        <Box sx={{ display: 'flex', gap: 1, backgroundColor: '#f8fafc', borderRadius: '12px', padding: '4px', border: '1px solid #e2e8f0' }}>
          <IconButton size="small" sx={{ color: '#94a3b8' }}>
            <EmojiIcon />
          </IconButton>
          <TextField    fullWidth   variant="standard"  value={newMessage}  onChange={(e) => setNewMessage(e.target.value)}  placeholder="Type a message..."  InputProps={{ disableUnderline: true }}   sx={{ '& .MuiInputBase-root': { padding: '4px 8px' } }}  />
          <IconButton  color="primary"  onClick={sendMessage}  disabled={!newMessage.trim()}   size="small"  sx={{  backgroundColor: '#6366f1',    color: 'white',   '&:hover': { backgroundColor: '#4f46e5' },    '&.Mui-disabled': { backgroundColor: '#e2e8f0', color: '#94a3b8' } }} >
            <SendIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default Chat;