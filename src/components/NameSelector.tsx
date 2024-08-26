"use client";

interface NameSelectorProps {
  setName: (name: string) => void;
  name: string;
}

const NameSelector = ({ setName, name }: NameSelectorProps) => {
  return (
    <input
      className="text text-black"
      value={name}
      onChange={(e) => setName(e.target.value)}
      placeholder="Nome"
    />
  );
};

export default NameSelector;
