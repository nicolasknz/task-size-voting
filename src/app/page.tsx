"use client";

import React, { useCallback, useEffect, useId, useState } from "react";
import { pusherClient } from "@/libs/pusher/client";

import MessageList from "@/components/MessageList";
import NameSelector, { User } from "@/components/NameSelector";
import EstimativeSelector from "@/components/EstimativeSelector";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ModeToggle } from "@/components/ToggleTheme";
import { RefreshCw, SendHorizontal } from "lucide-react";

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
  const [isShowingResults, setIsShowingResults] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const id = useId();
  const { toast } = useToast();

  const showWelcomeToast = useCallback(
    (name: string) => {
      toast({
        title: "Sucesso!",
        description: `Seja bem-vindo(a) ${name}`,
        variant: "default",
      });
    },
    [toast]
  );

  useEffect(() => {
    const channel = pusherClient
      .subscribe(CHANNEL)
      .bind(EVENT, (data: Message) => {
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
    setIsShowingResults(true);
    try {
      const data = await fetch("/api/pusher/trigger", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type: "show" }),
      });

      if (!data.ok) {
        throw new Error("Erro ao mostrar resultados");
      }
    } catch {
      toast({
        title: "Erro",
        description: "Nao foi possivel mostrar os resultados.",
        variant: "destructive",
      });
    } finally {
      setIsShowingResults(false);
    }
  };

  const handleClear = async () => {
    setIsClearing(true);
    try {
      const data = await fetch("/api/pusher/trigger", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ type: "clear" }),
      });

      if (!data.ok) {
        throw new Error("Erro ao limpar");
      }
    } catch {
      toast({
        title: "Erro",
        description: "Nao foi possivel limpar a sessao.",
        variant: "destructive",
      });
    } finally {
      setIsClearing(false);
    }
  };

  useEffect(() => {
    const name = localStorage.getItem("name");
    if (!name) return;

    setUser({ id, name });
    showWelcomeToast(name);
  }, [id, showWelcomeToast]);

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

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 py-10 sm:px-6 md:py-16">
      <header className="mb-10 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Estimativas
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Vote em tamanho de tarefa no formato T-shirt em tempo real.
          </p>
        </div>
        <ModeToggle />
      </header>

      <section className="w-full">
        <NameSelector user={user} submitUser={submitUser} />
      </section>

      {user && (
        <section className="mt-6 flex w-full flex-col gap-6">
          <EstimativeSelector
            hasSentEstimative={hasSentEstimative}
            setEstimative={setEstimative}
            estimative={estimative}
            setHasSentEstimative={setHasSentEstimative}
            user={user}
          />

          <MessageList messages={messages} showResults={showResults} />

          <div className="grid w-full gap-4 sm:grid-cols-2">
            <Button
              onClick={handleShowResults}
              disabled={messages.length === 0 || isShowingResults || isClearing}
              className="h-12 gap-2 rounded-xl border border-primary/40 bg-primary text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:brightness-110 hover:shadow-primary/35 dark:border-primary/30"
            >
              <SendHorizontal className="h-4 w-4" />
              {isShowingResults ? "Mostrando..." : "Mostrar resultados"}
            </Button>

            <Button
              onClick={handleClear}
              variant="destructive"
              disabled={messages.length === 0 || isShowingResults || isClearing}
              className="h-12 gap-2 rounded-xl border border-red-300/60 bg-red-50/70 text-red-700 hover:bg-red-100 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300 dark:hover:bg-red-900/35"
            >
              <RefreshCw className="h-4 w-4" />
              {isClearing ? "Limpando..." : "Limpar"}
            </Button>
          </div>
        </section>
      )}
    </main>
  );
};

export default Page;
