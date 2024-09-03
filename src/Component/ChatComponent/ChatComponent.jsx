"use client";

import { Button, Input, Radio, Space } from "antd";
import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";

export default function ChatComponent({ userId }) {
  const [sentMessage, setSentMessage] = useState("");
  const [receivedMessages, setReceivedMessages] = useState([]);
  const [targetUserId, setTargetUserId] = useState("");
  const [isBroadcast, setIsBroadcast] = useState(true); // Default to broadcast
  const socket = useRef(null);

  useEffect(() => {
    // Initialize the socket connection
    socket.current = io("http://localhost:5000/");

    // Register the user when the component mounts
    socket.current.emit("register", userId);

    // Listen for incoming messages (both broadcast and private)
    socket.current.on("message", (msg) => {
      console.log("Received message:", msg);
      setReceivedMessages((previousMessages) => [
        ...previousMessages,
        { message: msg },
      ]);
    });

    // Fetch messages from the server
    fetchMessages();

    // Cleanup on component unmount
    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, [userId]);

  // Fetch messages from the server when the component mounts
  const fetchMessages = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/messages");
      const data = await response.json();
      setReceivedMessages(data);
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  // Send message (broadcast or private)
  const sendMessage = () => {
    if (socket.current && sentMessage) {
      const msgPayload = { sentMessage, userId };

      if (isBroadcast) {
        // Emit a broadcast message
        socket.current.emit("broadcast_message", msgPayload);
      } else if (targetUserId) {
        // Emit a private message to the specific user
        socket.current.emit("private_message", {
          to: targetUserId,
          ...msgPayload,
        });
      }

      // Clear the input after sending the message
      setSentMessage("");
      console.log(
        `Sent message: ${sentMessage} ${
          isBroadcast ? "to all users" : `to user ${targetUserId}`
        }`
      );
    }
  };

  return (
    <div className="bg-slate-300">
      <div className="container mx-auto my-10">
        <h1>Chat Application</h1>
        <div>
          {receivedMessages.map((msg, index) => (
            <div key={index}>
              <h1>{msg?.message?.sentMessage}</h1>
            </div>
          ))}
        </div>

        <Radio.Group
          onChange={(e) => setIsBroadcast(e.target.value === "true")}
          value={isBroadcast.toString()}
          style={{ marginBottom: "10px" }}
        >
          <Radio value="true">Broadcast</Radio>
          <Radio value="false">Private</Radio>
        </Radio.Group>

        {!isBroadcast && (
          <Input
            placeholder="Target User ID"
            value={targetUserId}
            onChange={(e) => setTargetUserId(e.target.value)}
            style={{ marginBottom: "10px" }}
          />
        )}

        <Space.Compact style={{ width: "100%" }}>
          <Input
            placeholder="Enter message"
            value={sentMessage}
            onChange={(e) => setSentMessage(e.target.value)}
          />
          <Button type="primary" onClick={sendMessage}>
            Send
          </Button>
        </Space.Compact>
      </div>
    </div>
  );
}
