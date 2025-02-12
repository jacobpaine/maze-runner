import React, { useState } from "react";
import { useNpc } from "../contexts/NpcContext";

const NpcDialog: React.FC = () => {
  const { activeNpc, setActiveNpc } = useNpc();
  const [dialogIndex, setDialogIndex] = useState(0);

  if (!activeNpc) return null;

  const dialogue = activeNpc.dialogue[dialogIndex];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center">
      <div className="bg-gray-800 p-6 rounded text-white max-w-md">
        <h2 className="text-xl font-bold">{activeNpc.name}</h2>
        <p className="mt-2">{dialogue.text}</p>

        <div className="mt-4">
          {dialogue.options.map((option, index) => (
            <button
              key={index}
              className="block w-full p-2 mt-2 bg-gray-600 hover:bg-gray-500 rounded"
              onClick={() => {
                if (option.next === null) {
                  setActiveNpc(null);
                } else {
                  setDialogIndex(option.next);
                }
              }}
            >
              {option.text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NpcDialog;
