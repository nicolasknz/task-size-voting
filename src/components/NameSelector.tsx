"use client";

import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
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
  const isDisabled = inputValue.trim().length === 0;

  const handleSubmit = () => {
    submitUser(inputValue.trim());
  };

  return user ? null : (
    <Card className="glass-card w-full rounded-2xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">Entrar na sessao</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        <label
          htmlFor="name-input"
          className="text-sm font-medium text-slate-600 dark:text-slate-400"
        >
          Seu nome
        </label>
        <Input
          id="name-input"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !isDisabled) {
              handleSubmit();
            }
          }}
          placeholder="Seu nome"
          autoComplete="name"
          className="h-12 rounded-xl border-slate-200 bg-white/85 dark:border-slate-800 dark:bg-slate-900/80"
        />

        <Button
          className="h-12 w-full rounded-xl bg-primary font-semibold shadow-lg shadow-primary/20 hover:opacity-95"
          onClick={handleSubmit}
          disabled={isDisabled}
        >
          Entrar
        </Button>
      </CardContent>
    </Card>
  );
};

export default NameSelector;
