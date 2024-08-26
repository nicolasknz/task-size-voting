"use client";

const ESTIMATIVES = ["PP", "P", "M", "G", "GG"];

interface EstimativeSelectorProps {
  estimative: string;
  setEstimative: (value: string) => void;
}

const EstimativeSelector = ({
  setEstimative,
  estimative,
}: EstimativeSelectorProps) => {
  return (
    <select
      className="text text-black"
      value={estimative}
      onChange={(e) => setEstimative(e.target.value)}
    >
      {ESTIMATIVES.map((e) => (
        <option key={e} value={e}>
          {e}
        </option>
      ))}
    </select>
  );
};

export default EstimativeSelector;
