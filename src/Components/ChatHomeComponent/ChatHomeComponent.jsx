"use client";
import Image from "next/image";
import ChatComponent from "../ChatComponent/ChatComponent";
import { useEffect, useState } from "react";

export default function ChatHomeComponent() {
  const [users, setUsers] = useState([]);

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
    <div>
      <div className="flex w-full items-center justify-between gap-5">
        <div className="bg-violet-100 p-5 md:w-4/12">
          {users.length > 0 ? (
            users.map((user) => {
              // Construct the full image URL
              const imageUrl = `http://localhost:5000${user.avatarUrl}`;

              return (
                <div
                  key={user._id}
                  className="mb-2 flex items-center justify-center gap-2 rounded-lg border-2 p-2 shadow-lg shadow-fuchsia-100"
                >
                  <Image
                    className="rounded-full border-2 border-fuchsia-700 shadow"
                    src={imageUrl}
                    height={50}
                    width={50}
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

        <div className="bg-fuchsia-200 p-5 md:w-8/12">
          <ChatComponent />
        </div>
      </div>
    </div>
  );
}
