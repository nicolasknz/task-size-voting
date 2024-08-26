import { pusherClient } from "@/libs/pusher/client";
import { useEffect, useState } from "react";

interface Message {
  message: string;
  user: string;
  date: string;
}

interface MessageListProps {}

const CHANNEL = "estimatives";
const EVENT = "event";

export default function MessageList({ name, estimative }: MessageListProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  console.log(messages, "clg1");

  useEffect(() => {
    const channel = pusherClient
      .subscribe(CHANNEL)
      .bind(EVENT, (data: Message) => {
        console.log("test", data);
        setMessages((prevMessages) => [...prevMessages, data]);
      });

    return () => {
      channel.unbind();
    };
  }, []);

  const handleTestClick = async () => {
    let data = await fetch("/api/pusher/trigger", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: estimative, user: name }),
    });

    let json = await data.json();

    console.log(json, "clg1");
  };

  return (
    <div className="flex flex-col">
      <button
        className="w-[240px] bg-slate-600 hover:bg-slate-500 rounded p-2 m-2"
        onClick={handleTestClick}
      >
        Test
      </button>
      <div className="mt-4">
        {messages.map((msg, index) => (
          <div key={index} className="border p-2 mb-2">
            <div>
              <strong>User:</strong> {msg.user}
            </div>
            <div>
              <strong>Date:</strong> {msg.date}
            </div>
            <div>
              <strong>Message:</strong> {msg.message}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
