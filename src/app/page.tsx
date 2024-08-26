"use client";

import React, { useEffect, useState } from "react";
import { pusherClient } from "@/libs/pusher/client";

import MessageList from "@/components/MessageList";
import NameSelector from "@/components/NameSelector";
import EstimativeSelector from "@/components/EstimativeSelector";
import { Button } from "@/components/ui/button";

const CHANNEL = "estimatives";
const EVENT = "event";

export interface Message {
  type: "estimative" | "clear" | "show";
  message: string;
  date: string;
}

const Page = () => {
  const [estimative, setEstimative] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [hasSentEstimative, setHasSentEstimative] = useState(false);
  const [showResults, setShowResults] = useState(false);

  console.log(estimative);

  useEffect(() => {
    const channel = pusherClient
      .subscribe(CHANNEL)
      .bind(EVENT, (data: Message) => {
        console.log("test", data);

        if (data.type === "clear") {
          setMessages([]);
          setEstimative("");
          setHasSentEstimative(false);
          setShowResults(false);

          return;
        }

        if (data.type === "show") {
          setShowResults(true);

          return;
        }

        setMessages((prevMessages) => [...prevMessages, data]);
      });

    return () => {
      channel.unbind();
    };
  }, []);

  const handleShowResults = async () => {
    if (messages.length === 0 || !messages) return;

    let data = await fetch("/api/pusher/trigger", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type: "show" }),
    });

    let json = await data.json();

    console.log(json, "clg1");
  };

  const handleClear = async () => {
    let data = await fetch("/api/pusher/trigger", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ type: "clear" }),
    });

    let json = await data.json();

    console.log(json, "clg1");
  };

  return (
    <div className="flex flex-col items-center w-full justify-center">
      {/* <div className="mt-10">
        <NameSelector setName={setName} name={name} />
      </div> */}

      <div className="mt-10 w-1/3">
        <EstimativeSelector
          hasSentEstimative={hasSentEstimative}
          setEstimative={setEstimative}
          estimative={estimative}
          setHasSentEstimative={setHasSentEstimative}
        />
      </div>

      <div className="mt-10">
        <MessageList messages={messages} showResults={showResults} />
      </div>

      <Button onClick={handleShowResults} className="mt-20">
        Mostrar resultados
      </Button>

      <Button
        className="mt-20"
        onClick={handleClear}
        variant={"destructive"}
        disabled={messages?.length === 0}
      >
        Limpar
      </Button>
    </div>
  );
};

export default Page;
