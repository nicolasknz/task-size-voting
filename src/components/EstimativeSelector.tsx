"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "./ui/button";
import { User } from "./NameSelector";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useState } from "react";
import { CheckCircle2, SendHorizontal } from "lucide-react";

export const ESTIMATIVES = ["PP", "P", "M", "G", "GG"];

interface EstimativeSelectorProps {
  estimative: string;
  setEstimative: (value: string) => void;
  setHasSentEstimative: (value: boolean) => void;
  hasSentEstimative: boolean;
  user: User;
}

const EstimativeSelector = ({
  setEstimative,
  estimative,
  setHasSentEstimative,
  hasSentEstimative,
  user,
}: EstimativeSelectorProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTestClick = async () => {
    if (!estimative || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const data = await fetch("/api/pusher/trigger", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: estimative, user: user }),
      });

      if (!data.ok) {
        throw new Error("Erro ao enviar estimativa");
      }

      setHasSentEstimative(true);
      toast({
        title: "Sucesso!",
        description: "Estimativa enviada!",
      });
    } catch {
      toast({
        title: "Erro",
        description: "Nao foi possivel enviar sua estimativa.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="glass-card w-full rounded-2xl">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-xl">
          <CheckCircle2 className="h-5 w-5 text-primary" />
          Escolha sua estimativa
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        <label
          htmlFor="estimative-select"
          className="text-sm font-medium text-slate-600 dark:text-slate-400"
        >
          Estimativa
        </label>
        <Select value={estimative} onValueChange={(value) => setEstimative(value)}>
          <SelectTrigger
            id="estimative-select"
            className="h-12 rounded-xl border-slate-200 bg-white/85 dark:border-slate-800 dark:bg-slate-900/80"
          >
            <SelectValue placeholder="Selecione uma estimativa" />
          </SelectTrigger>
          <SelectContent>
            {ESTIMATIVES.map((value) => (
              <SelectItem key={value} value={value}>
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          className="h-12 w-full gap-2 rounded-xl bg-primary font-semibold shadow-lg shadow-primary/20 hover:opacity-95"
          onClick={handleTestClick}
          disabled={hasSentEstimative || !estimative || isSubmitting}
        >
          <SendHorizontal className="h-4 w-4" />
          {isSubmitting
            ? "Enviando..."
            : hasSentEstimative
            ? "Enviado"
            : "Enviar estimativa"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default EstimativeSelector;
