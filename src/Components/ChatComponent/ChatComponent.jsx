"use client";

import { Button, Input, Radio, Space } from "antd";
import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { LuSend } from "react-icons/lu";
import { ConfigProvider } from "antd";
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
      socket.current.emit("broadcast_message", msgPayload);
      // Clear the input after sending the message
      setSentMessage("");
      console.log(
        `Sent message: ${sentMessage} ${
          isBroadcast ? "to all users" : `to user ${targetUserId}`
        }`,
      );
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Messages list */}
      <div className="flex-1 overflow-y-auto p-4">
        {receivedMessages.map((msg, index) => (
          <div key={index} className="py-3">
            <span className="flex-1 overflow-auto rounded-md bg-[#8babd8] p-2 px-4 text-white">
              {msg?.message?.sentMessage}
            </span>
          </div>
        ))}
      </div>

      {/* Message input */}
      <div className="border-t border-gray-300 p-4">
        <ConfigProvider
          theme={{
            components: {
              Input: {
                colorBorder: "rgb(255,255,255)",
                hoverBorderColor: "rgb(255,255,255)",
                activeBorderColor: "rgb(255,255,255)",
              },
              Button: {
                colorBorder: "rgb(255,255,255)",
                defaultHoverBorderColor: "rgb(255,255,255)",
              },
            },
          }}
        >
          <Space.Compact style={{ width: "100%", border: "none" }}>
            <Input
              placeholder="Enter message"
              value={sentMessage}
              onChange={(e) => setSentMessage(e.target.value)}
            />
            <Button onClick={sendMessage}>
              <LuSend className="h-5 w-5 text-[#8babd8]" />
            </Button>
          </Space.Compact>
        </ConfigProvider>
      </div>
    </div>

    // <div className="">
    //   <div className="">
    //     <div className="container mx-auto">
    //       {receivedMessages.map((msg, index) => (
    //         <div key={index}>
    //           <h1 className="py-3">
    //             <span className="flex-1 overflow-auto rounded-md bg-[#8babd8] p-2 px-4 text-white">
    //               {msg?.message?.sentMessage}
    //             </span>
    //           </h1>
    //         </div>
    //       ))}
    //     </div>
    //     <div className="fix bottom-0">
    //       <ConfigProvider
    //         theme={{
    //           components: {
    //             Input: {
    //               colorBorder: "rgb(255,255,255)",
    //               hoverBorderColor: "rgb(255,255,255)",
    //               activeBorderColor: "rgb(255,255,255)",
    //             },
    //             Button: {
    //               colorBorder: "rgb(255,255,255)",
    //               defaultHoverBorderColor: "rgb(255,255,255)",
    //             },
    //           },
    //         }}
    //       >
    //         {/* footer of messages section */}
    //         <Space.Compact style={{ width: "100%", border: "none" }}>
    //           <Input
    //             placeholder="Enter message"
    //             value={sentMessage}
    //             onChange={(e) => setSentMessage(e.target.value)}
    //             className="fixed"
    //           />
    //           <Button onClick={sendMessage} className="">
    //             <LuSend className="h-5 w-5 text-[#8babd8]" />
    //           </Button>
    //         </Space.Compact>
    //       </ConfigProvider>
    //     </div>
    //   </div>
    // </div>
  );
}
