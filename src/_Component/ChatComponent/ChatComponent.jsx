"use client";

import { Button, Input, Space } from "antd";
import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";

export default function ChatComponent() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const socket = useRef(null);

  useEffect(() => {
    socket.current = io("http://localhost:5000/");
    // Listen for incoming messages from the server
    socket.current.on("message", (msg) => {
      // Update the UI
      setMessages((previousMessages) => [
        ...previousMessages,
        {  msg },
      ]);
      console.log("Received message:", msg);
    });
    // Fetch messages from the server when the component mounts
    const fetchMessages = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/messages");
        const data = await response.json();
        setMessages(data);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };

    fetchMessages();

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, []);

  const sendMessage = () => {
    if (socket.current && message) {
      // Emit the message to the server
      socket.current.emit("message", message);

      // Update the local state to immediately display the message
      setMessages((prevMessages) => [...prevMessages, { message }]);
      // Log the sent message to the console
      console.log("Sent message:", message);
      // Clear the input after sending the message
      setMessage("");
    }
  };

  return (
    <div className="bg-black">
      <div className="container mx-auto my-10">
        <h1 className="text-white">Chat Application</h1>
        <div className="text-white">
          {messages.map((msg, index) => (
            <div key={index}>{msg.message}</div>
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
