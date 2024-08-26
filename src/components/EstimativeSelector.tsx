"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "./ui/button";

export const ESTIMATIVES = ["PP", "P", "M", "G", "GG"];

interface EstimativeSelectorProps {
  estimative: string;
  setEstimative: (value: string) => void;
  setHasSentEstimative: (value: boolean) => void;
  hasSentEstimative: boolean;
}

const EstimativeSelector = ({
  setEstimative,
  estimative,
  setHasSentEstimative,
  hasSentEstimative,
}: EstimativeSelectorProps) => {
  const handleTestClick = async () => {
    if (!estimative) return;

    let data = await fetch("/api/pusher/trigger", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: estimative, user: name }),
    });

    // let json = await data.json();
    setHasSentEstimative(true);
  };

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col w-2/4 ">
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
          Enviar
        </Button>
      </div>
    </div>
  );
};

export default EstimativeSelector;
