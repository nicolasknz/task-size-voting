"use client";

import React, { useEffect, useId, useState } from "react";
import { pusherClient } from "@/libs/pusher/client";

import MessageList from "@/components/MessageList";
import NameSelector, { User } from "@/components/NameSelector";
import EstimativeSelector from "@/components/EstimativeSelector";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const CHANNEL = "estimatives";
const EVENT = "event";

export interface Message {
  type: "estimative" | "clear" | "show";
  message: string;
  date: string;
  user: User;
}

const Page = () => {
  const [estimative, setEstimative] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [hasSentEstimative, setHasSentEstimative] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [user, setUser] = useState<User>();
  const id = useId();
  const { toast } = useToast();

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

  useEffect(() => {
    (function getNameLocalStorage() {
      const name = localStorage.getItem("name");

      if (name) {
        setUser({ id, name });
        showWelcomeToast(name);
      }
    })();
  }, []);

  const submitUser = (name: string) => {
    if (name.length === 0) {
      toast({
        title: "Erro",
        description: "Escreva seu nome!",
        variant: "destructive",
      });

      return;
    }
    setUser({ id, name: name });
    localStorage.setItem("name", name);
    showWelcomeToast(name);
  };

  const showWelcomeToast = (name: string = "aa") => {
    toast({
      title: "Sucesso!",
      description: `Seja bem-vindo(a) ${name}`,
      variant: "default",
    });
  };

  return (
    <div className="flex flex-col items-center w-full justify-center">
      <div className="mt-10 w-2/3 md:w-1/3">
        <NameSelector setUser={setUser} user={user} submitUser={submitUser} />
      </div>
      {user && (
        <div className="flex flex-col items-center justify-center w-56">
          <div className="mt-10 w-full">
            <EstimativeSelector
              hasSentEstimative={hasSentEstimative}
              setEstimative={setEstimative}
              estimative={estimative}
              setHasSentEstimative={setHasSentEstimative}
              user={user}
            />
          </div>

          <div className="mt-10 w-full">
            <MessageList messages={messages} showResults={showResults} />
          </div>

          <Button
            onClick={handleShowResults}
            disabled={messages.length === 0}
            className="mt-20"
          >
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
      )}
    </div>
  );
};

export default Page;
