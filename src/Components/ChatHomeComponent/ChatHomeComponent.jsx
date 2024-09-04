"use client";
import Image from "next/image";
import ChatComponent from "../ChatComponent/ChatComponent";
import { useEffect, useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { AudioOutlined } from "@ant-design/icons";
import { Input, Space } from "antd";
import { TbMessageSearch } from "react-icons/tb";
import { IoCall } from "react-icons/io5";
import { BsThreeDotsVertical } from "react-icons/bs";

export default function ChatHomeComponent() {
  const [users, setUsers] = useState([]);
  console.log(users?.[0]?._id);

  const handleUser = () => {
    console.log("userid");
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
              const imageUrl = `http://localhost:5000${user.avatarUrl}`;

              return (
                <div
                  key={user._id}
                  className="mb-2 flex items-center gap-4 rounded-lg py-2 hover:bg-slate-200"
                  onClick={handleUser}
                >
                  <Image
                    className="rounded-full border-2 border-[#8babd8]"
                    src={imageUrl}
                    height={40}
                    width={40}
                    alt="user image"
                  />
                  <div>
                    <h1 className="text-md font-bold">
                      {user.name || "User name"}
                    </h1>
                    <p>{user.lastMessage || "Last Message"}</p>
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
          <div className="flex items-center gap-2">
            <Image
              src=""
              height={40}
              width={40}
              className="rounded-full border-2"
              alt="User Avatar"
            />
            <div>
              <h1 className="font-bold">User Name</h1>
              <p className="text-neutral-500">Active time</p>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <TbMessageSearch className="h-5 w-5 text-[#707991]" />
            <IoCall className="h-5 w-5 text-[#707991]" />
            <BsThreeDotsVertical className="h-5 w-5 text-[#707991]" />
          </div>
        </div>

        {/* Messages */}
        <ChatComponent />
      </div>
    </div>
  );
}
