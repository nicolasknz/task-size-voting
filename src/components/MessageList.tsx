import { useEffect, useMemo, useState } from "react";
import { Button } from "./ui/button";
import { Message } from "@/app/page";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const ESTIMATIVES = ["PP", "P", "M", "G", "GG"];
interface MessageListProps {
  messages: Message[];
  showResults: boolean;
}

export default function MessageList({
  messages,
  showResults,
}: MessageListProps) {
  console.log(messages, "clg2");
  const handledList = useMemo(() => {
    const handledEstimatives = ESTIMATIVES.map((estimative) => {
      const filteredMessages = messages.filter(
        (message) => message.message === estimative
      );

      if (filteredMessages.length === 0) return null;

      const handledEstimatives = {
        count: filteredMessages.length,
        estimative: estimative,
      };

      return handledEstimatives;
    });

    return handledEstimatives.filter((item) => item);
  }, [messages]);

  console.log(handledList, "clg3");

  return (
    <div className="flex flex-col">
      <div>Respostas: {messages.length}</div>

      {showResults && (
        <div className="mt-4">
          {handledList.map((item, index) => (
            <Card key={item?.estimative} className="mt-2">
              <CardHeader>
                <CardTitle>Tamanho: {item?.estimative}</CardTitle>
              </CardHeader>
              <CardContent>Votos: {item?.count}</CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
