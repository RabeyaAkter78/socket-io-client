"use client";
import Image from "next/image";
import ChatComponent from "../ChatComponent/ChatComponent";
import { useEffect, useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { AudioOutlined } from "@ant-design/icons";
import { Button, Input, Space } from "antd";
import { TbMessageSearch } from "react-icons/tb";
import { IoCall } from "react-icons/io5";
import { BsThreeDotsVertical } from "react-icons/bs";
import io from "socket.io-client";
import { LuSend } from "react-icons/lu";
export default function ChatHomeComponent() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  console.log(users?.[0]?._id);
  // socket:
  // Initialize socket connection
  useEffect(() => {
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    // Clean up the socket connection when the component unmounts
    return () => newSocket.close();
  }, []);

  // Handle receiving messages
  useEffect(() => {
    if (socket) {
      socket.on("receiveMessage", (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });
    }
  }, [socket]);

  // Handle sending a message
  const sendMessage = () => {
    if (socket && currentUser) {
      const message = {
        content: messageInput,
        senderId: socket.id,
        receiverId: currentUser._id,
        timestamp: new Date(),
      };
      socket.emit("sendMessage", currentUser._id, message);
      setMessages((prevMessages) => [...prevMessages, message]);
      setMessageInput("");
    }
  };
  // Handle user selection
  const handleUserSelect = (user) => {
    setCurrentUser(user);
    // Fetch chat history with this user if needed
    // e.g., setMessages(chatHistoryWithUser);
  };

  // search
  const { Search } = Input;
  const suffix = (
    <AudioOutlined
      style={{
        fontSize: 16,
        color: "#1677ff",
      }}
    />
  );
  const onSearch = (value, _e, info) => console.log(info?.source, value);
  // Fetch users from the backend
  useEffect(() => {
    fetch("http://localhost:5000/api/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
      })
      .catch((error) => console.error("Error fetching users:", error));
  }, []);

  return (
    <div className="container mx-auto flex h-screen bg-white">
      {/* Users section */}
      <div className="flex h-[95%] w-full flex-col border-r border-gray-300 md:w-4/12">
        {/* Users section header */}
        <div className="flex items-center justify-between border-b border-gray-300 p-4">
          <RxHamburgerMenu />
          <Space direction="vertical">
            <Search
              placeholder="Search users"
              onSearch={onSearch}
              style={{ width: 180 }}
            />
          </Space>
        </div>

        {/* Users list */}
        <div className="flex-1 overflow-y-auto p-4">
          {users.length > 0 ? (
            users.map((user) => {
              // const imageUrl = `http://localhost:5000${user?.avatarUrl}`;
              const imageUrl = user?.avatarUrl
                ? `http://localhost:5000${user?.avatarUrl}`
                : "/default-avatar.png";
              return (
                <div
                  key={user._id}
                  className={`mb-2 flex items-center gap-4 rounded-lg py-2 ${
                    currentUser && currentUser._id === user._id
                      ? "bg-slate-200"
                      : ""
                  } hover:bg-slate-200`}
                  onClick={() => handleUserSelect(user)}
                >
                  <Image
                    className="rounded-full border-2 border-[#8babd8]"
                    src={imageUrl}
                    height={40}
                    width={40}
                    alt="user image"
                  />

                  {/* <img height={40} width={40} alt="user image" src={imageUrl} /> */}
                  <div>
                    <h1 className="text-md font-bold">
                      {user?.name || "User name"}
                    </h1>
                    <p>{user?.lastMessage || "Last Message"}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <p>No users found</p>
          )}
        </div>
      </div>

      {/* Messages section */}
      <div className="flex h-[95%] w-full flex-col md:w-8/12">
        {/* Messages section header */}
        <div className="flex items-center justify-between border-b border-gray-300 bg-slate-300">
          {currentUser && (
            <div className="flex items-center gap-2">
              <Image
                src={`http://localhost:5000${currentUser?.avatarUrl}`}
                height={40}
                width={40}
                className="rounded-full border-2"
                alt="User Avatar"
              />
              <div>
                <h1 className="font-bold">{currentUser?.name}</h1>
                <p className="text-neutral-500">Active time</p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-5">
            <TbMessageSearch className="h-5 w-5 text-[#707991]" />
            <IoCall className="h-5 w-5 text-[#707991]" />
            <BsThreeDotsVertical className="h-5 w-5 text-[#707991]" />
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          {messages.length > 0 ? (
            messages.map((msg, index) => (
              <div key={index} className="mb-2">
                <p>
                  <strong>
                    {msg.senderId === socket.id ? "You" : currentUser.name}:
                  </strong>{" "}
                  {msg.content}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </p>
              </div>
            ))
          ) : (
            <p>No messages</p>
          )}
        </div>
        <Space.Compact style={{ width: "100%", border: "none" }}>
          <Input placeholder="Enter message" />
          <Button onClick={sendMessage}>
            <LuSend className="h-5 w-5 text-[#8babd8]" />
          </Button>
        </Space.Compact>
        {/* broadcast message */}
        {/* <ChatComponent /> */}
      </div>
    </div>
  );
}
