"use client";

const ESTIMATIVES = ["PP", "P", "M", "G", "GG"];

const EstimativeSelector = ({ setEstimative, estimative }) => {
  return (
    <select
      className="text text-black"
      value={estimative}
      onChange={(e) => setEstimative(e.target.value)}
    >
      {ESTIMATIVES.map((e) => (
        <option value={e}>{e}</option>
      ))}
    </select>
  );
};

export default EstimativeSelector;
