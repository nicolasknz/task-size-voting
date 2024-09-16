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
  type: "estimative" | "clear" | "show" | "sync" | "syncSend";
  message: string;
  userEstimatives: Estimative[];
  date: string;
  user: User;
}

export interface Estimative {
  value: "PP" | "P" | "M" | "G" | "GG";
  user: User;
}

const Page = () => {
  const [estimativeValue, setEstimativeValue] = useState<string>();
  const [estimatives, setEstimatives] = useState<Estimative[]>([]);
  const [hasSentEstimative, setHasSentEstimative] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [user, setUser] = useState<User>();
  const [messagesToSync, setMessagesToSync] = useState<Estimative[][]>();
  const id = useId();

  console.log(messagesToSync);

  const { toast } = useToast();

  useEffect(() => {
    const channel = pusherClient
      .subscribe(CHANNEL)
      .bind(EVENT, (data: Message) => {
        console.log("test", data);

        if (data.type === "clear") {
          setEstimatives([]);
          setEstimativeValue("");
          setHasSentEstimative(false);
          setShowResults(false);

          return;
        }

        if (data.type === "show") {
          setShowResults(true);

          return;
        }

        if (data.type === "sync") {
          sendMessagesToSync();

          return;
        }

        if (data.type === "syncSend") {
          setMessagesToSync((oldState) => {
            if (oldState) {
              const result = [...oldState, data.userEstimatives];
              return result;
            }

            return [data.userEstimatives];
          });

          return;
        }

        const estimative: Estimative = {
          user: data.user,
          value: data.message as "PP" | "P" | "M" | "G" | "GG",
        };

        setEstimatives((oldState) => [...oldState, estimative]);
      });

    return () => {
      channel.unbind();
    };
  }, []);

  const handleSync = () => {
    if (!messagesToSync) return;

    const messageCountPerUser = messagesToSync.map((messagePerUser) => {
      return messagePerUser.length || 0;
    });

    let highestCount = messageCountPerUser[0];

    messageCountPerUser.forEach((messageCount) => {
      if (messageCount > highestCount) {
        highestCount = messageCount;
      }
    });

    const isEverybodySynced = messageCountPerUser.every((messageCount) => {
      return messageCount === highestCount;
    });

    if (!isEverybodySynced) {
      const base = messagesToSync?.find((messages) => {
        return messages.length === highestCount;
      });

      if (base) setEstimatives(base);
    }
  };

  const signalToSyncMessages = async () => {
    let data = await fetch("/api/pusher/trigger", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user: user, type: "sync" }),
    });
  };

  const sendMessagesToSync = async () => {
    let data = await fetch("/api/pusher/trigger", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: estimatives,
        user: user,
        type: "syncSend",
      }),
    });
  };

  const handleShowResults = async () => {
    if (estimatives.length === 0 || !estimatives) return;

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
        <NameSelector submitUser={submitUser} user={user} />
      </div>

      {user && (
        <div className="flex flex-col items-center justify-center w-56">
          <div className="mt-10 w-full">
            <EstimativeSelector
              hasSentEstimative={hasSentEstimative}
              setEstimativeValue={setEstimativeValue}
              estimativeValue={estimativeValue || ""}
              setHasSentEstimative={setHasSentEstimative}
              user={user}
            />
          </div>

          <div className="mt-10 w-full">
            <MessageList estimatives={estimatives} showResults={showResults} />
          </div>

          <Button
            onClick={handleShowResults}
            disabled={estimatives.length === 0}
            className="mt-20"
          >
            Mostrar resultados
          </Button>

          <Button
            className="mt-20"
            onClick={handleClear}
            variant={"destructive"}
            disabled={estimatives?.length === 0}
          >
            Limpar
          </Button>
        </div>
      )}
    </div>
  );
};

export default Page;
