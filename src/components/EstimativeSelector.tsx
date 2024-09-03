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
  const handleTestClick = async () => {
    if (!estimative) return;

    let data = await fetch("/api/pusher/trigger", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: estimative, user: user }),
    });

    // let json = await data.json();
    setHasSentEstimative(true);

    toast({
      title: "Sucesso!",
      description: "Estimativa enviada!",
    });
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="flex flex-col">
        <Select value={estimative} onValueChange={(e) => setEstimative(e)}>
          <SelectTrigger className="">
            <SelectValue placeholder="Estimativa" />
          </SelectTrigger>
          <SelectContent>
            {ESTIMATIVES.map((e) => (
              <SelectItem key={e} value={e}>
                {e}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          className="mt-10"
          onClick={handleTestClick}
          disabled={hasSentEstimative}
        >
          {hasSentEstimative ? "Enviado" : "Enviar"}
        </Button>
      </div>
    </div>
  );
};

export default EstimativeSelector;
