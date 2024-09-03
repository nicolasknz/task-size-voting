"use client";

import { useId, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export interface User {
  id?: string;
  name?: string;
}

interface NameSelectorProps {
  setUser: (name: User) => void;
  user?: User;
}

const NameSelector = ({ setUser, user }: NameSelectorProps) => {
  const [inputValue, setInputValue] = useState("");
  const id = useId();
  const { toast } = useToast();

  const submitUser = () => {
    if (inputValue.length === 0) {
      toast({
        title: "Erro",
        description: "Escreva seu nome!",
        variant: "destructive",
      });

      return;
    }
    toast({
      title: "Sucesso!",
      description: `Seja bem-vindo ${inputValue}`,
      variant: "default",
    });

    setUser({ id, name: inputValue });
  };

  return user ? null : (
    <Card className="w-full flex flex-col">
      <CardHeader></CardHeader>
      <CardContent>
        <Input
          className=""
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Seu nome"
        />

        <Button className="mt-10 w-full" onClick={submitUser}>
          Entrar
        </Button>
      </CardContent>
    </Card>
  );
};

export default NameSelector;
