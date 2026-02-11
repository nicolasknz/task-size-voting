import { useMemo } from "react";
import { Message } from "@/app/page";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const ESTIMATIVES = ["PP", "P", "M", "G", "GG"];
interface MessageListProps {
  messages: Message[];
  showResults: boolean;
}

export default function MessageList({
  messages,
  showResults,
}: MessageListProps) {
  const groupedEstimatives = useMemo(() => {
    const grouped = ESTIMATIVES.map((estimative) => {
      const filteredMessages = messages.filter(
        (message) => message.message === estimative
      );

      return {
        count: filteredMessages.length,
        estimative,
        users: filteredMessages.map((m) => m.user),
      };
    }).filter((item) => item.count > 0);

    return grouped;
  }, [messages]);

  const allUsers = useMemo(() => messages.map((message) => message.user), [messages]);

  const maxVotes = useMemo(() => {
    return groupedEstimatives.reduce((max, item) => Math.max(max, item.count), 0);
  }, [groupedEstimatives]);

  return (
    <Card className="glass-card w-full rounded-2xl">
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xl">Resultados da votacao</span>
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/15 px-3 py-1 text-sm font-medium text-primary">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            Respostas: {messages.length}
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6 pt-0">
        {messages.length === 0 && (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Nenhuma resposta recebida ainda.
          </p>
        )}

        {messages.length > 0 && !showResults && (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            As respostas chegaram. Clique em &quot;Mostrar resultados&quot; para
            revelar a distribuicao.
          </p>
        )}

        {showResults && (
          <div className="space-y-6">
            <div
              className="space-y-3"
              role="list"
              aria-label="Resultados por estimativa"
            >
              {groupedEstimatives.map((item) => {
                const widthPercentage =
                  maxVotes === 0 ? 0 : Math.max((item.count / maxVotes) * 100, 8);

                return (
                  <div
                    key={item.estimative}
                    className={cn(
                      "flex items-center gap-4",
                      item.count < maxVotes && "opacity-75"
                    )}
                  >
                    <div className="w-10 text-sm font-bold text-slate-500 dark:text-slate-400">
                      {item.estimative}
                    </div>
                    <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-200/70 dark:bg-slate-800/70">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-300"
                        style={{ width: `${widthPercentage}%` }}
                      />
                    </div>
                    <div className="w-8 text-right text-sm font-semibold">
                      {item.count}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-slate-200/70 pt-4 dark:border-slate-800/70">
              <ul className="flex flex-wrap gap-2" aria-label="Participantes">
                {allUsers.map((user) => (
                  <li
                    key={user.id}
                    className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                  >
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    {user.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {showResults && groupedEstimatives.length === 0 && (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Ainda nao ha votos para exibir.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
