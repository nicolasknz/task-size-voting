import { useEffect, useMemo, useState } from "react";
import { Button } from "./ui/button";
import { Estimative, Message } from "@/app/page";
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
  estimatives: Estimative[];
  showResults: boolean;
}

export default function MessageList({
  estimatives,
  showResults,
}: MessageListProps) {
  console.log(estimatives, "clg2");
  const handledList = useMemo(() => {
    const handledEstimatives = ESTIMATIVES.map((estimative) => {
      const filteredMessages = estimatives.filter(
        (message) => message.value === estimative
      );

      if (filteredMessages.length === 0) return null;

      const usersPerEstimative = filteredMessages.map((m) => m.user);

      const handledEstimatives = {
        count: filteredMessages.length,
        estimative: estimative,
        users: usersPerEstimative,
      };

      return handledEstimatives;
    });

    return handledEstimatives.filter((item) => item);
  }, [estimatives]);

  return (
    <div className="flex flex-col items-center justify-center">
      <div>Respostas: {estimatives.length}</div>

      {showResults && (
        <div className="mt-4">
          {handledList.map((item) => (
            <Card key={item?.estimative} className="mt-2">
              <CardHeader>
                <CardTitle>
                  {item?.estimative} - {item?.count} Voto(s)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* <div>Votos: {item?.count}</div> */}
                <div className="mt-2">
                  <ul className="mt-2">
                    {item?.users.map((user) => (
                      <li key={user.id}>{user.name}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
