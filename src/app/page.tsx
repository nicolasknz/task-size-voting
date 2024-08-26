"use client";

import React, { useState } from "react";

import MessageList from "@/components/MessageList";
import NameSelector from "@/components/NameSelector";
import EstimativeSelector from "@/components/EstimativeSelector";

const Page = () => {
  const [name, setName] = useState("");
  const [estimative, setEstimative] = useState(null);

  console.log(estimative);

  console.log(name);
  return (
    <>
      <NameSelector setName={setName} name={name} />
      <MessageList name={name} estimative={estimative} />
      <EstimativeSelector
        setEstimative={setEstimative}
        estimative={estimative}
      />
    </>
  );
};

export default Page;
