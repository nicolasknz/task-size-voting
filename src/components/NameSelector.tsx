"use client";

import { Input } from "./ui/input";

interface NameSelectorProps {
  setName: (name: string) => void;
  name: string;
}

const NameSelector = ({ setName, name }: NameSelectorProps) => {
  return (
    <Input
      className=""
      value={name}
      onChange={(e) => setName(e.target.value)}
      placeholder="Seu nome"
    />
  );
};

export default NameSelector;
