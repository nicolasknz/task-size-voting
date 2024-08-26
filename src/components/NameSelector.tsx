"use client";

const NameSelector = ({ setName, name }) => {
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
