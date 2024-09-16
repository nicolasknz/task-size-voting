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
  user?: User;
  submitUser: (name: string) => void;
}

const NameSelector = ({ user, submitUser }: NameSelectorProps) => {
  const [inputValue, setInputValue] = useState("");

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

        <Button className="mt-10 w-full" onClick={() => submitUser(inputValue)}>
          Entrar
        </Button>
      </CardContent>
    </Card>
  );
};

export default NameSelector;
