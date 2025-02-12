import React, { useState } from "react";
import { useNpc } from "../contexts/NpcContext";

const InteractionBox: React.FC = () => {
  const { activeNpc, setActiveNpc } = useNpc();
  const [dialogIndex, setDialogIndex] = useState(0);

  if (!activeNpc) return null; // Only show if interacting

  const dialogue = activeNpc.dialogue[dialogIndex];

  return (
    <div className="w-64 h-64 bg-gray-800 text-white p-4 rounded border border-gray-700">
      <h2 className="text-xl font-bold">{activeNpc.name}</h2>
      <p className="mt-2">{dialogue.text}</p>

      <div className="mt-4">
        {dialogue.options.map((option, index) => (
          <button
            key={index}
            className="block w-full p-2 mt-2 bg-gray-600 hover:bg-gray-500 rounded"
            onClick={() => {
              if (option.next === null) {
                setActiveNpc(null); // Close interaction
              } else {
                setDialogIndex(option.next); // Go to next dialogue
              }
            }}
          >
            {option.text}
          </button>
        ))}
      </div>
    </div>
  );
};

export default InteractionBox;
