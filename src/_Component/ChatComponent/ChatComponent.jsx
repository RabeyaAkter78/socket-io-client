"use client";
import { Button, Input, Space } from "antd";
import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";

export default function ChatComponent() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const socket = useRef(null); // useRef to persist socket instance

  useEffect(() => {
    socket.current = io("http://localhost:5000/"); // Connect to the Express server

    // Listen for incoming messages:
    socket.current.on("message", (msg) => {
      setMessages((previousMessages) => [...previousMessages, msg]);
    });

    // Cleanup on component unmount
    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, []);

  // Message send function:
  const sendMessage = () => {
    if (socket.current && message) {
      socket.current.emit("message", message); // Send the message to the server
      setMessage(""); // Clear the input after sending the message
    } else {
      console.error("Socket is not connected or message is empty.");
    }
  };
  

  return (
    <div className="bg-black">
      <div className="container mx-auto my-10">
        <h1 className="text-white">Chat Application</h1>
        <div className="text-white">
          {messages.map((msg, index) => (
            <div key={index}>{msg}</div>
          ))}
        </div>

        <Space.Compact style={{ width: "100%" }}>
          <Input
            placeholder="Enter message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button type="primary" onClick={sendMessage}>
            Send
          </Button>
        </Space.Compact>
      </div>
    </div>
  );
}
