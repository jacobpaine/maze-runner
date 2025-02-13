import React, { useState } from "react";
import { useNpc } from "../contexts/NpcContext";

const InteractionBox: React.FC = () => {
  const { activeNpc, setActiveNpc } = useNpc();
  const [dialogIndex, setDialogIndex] = useState(0);

  if (!activeNpc || !activeNpc.dialogue) return null;
  const dialogue = activeNpc.dialogue[dialogIndex];

  return (
    <div className="top-10 right-10 w-96 h-[30vh] bg-white p-4 pixel-border shadow-lg flex flex-col">
      <h2 className="text-xl font-bold text-gray-700 font-medieval text-center">
        {activeNpc.name}
      </h2>
      <p className="mt-2 text-gray-700 font-medieval flex-grow">
        {dialogue.text}
      </p>

      <div className="mt-4">
        {dialogue &&
          dialogue.options.map((option, index) => (
            <button
              key={index}
              className="block w-full p-2 mt-2 bg-gray-200 text-gray-800 font-medieval rounded border border-gray-500 hover:bg-gray-300"
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
  );
};

export default InteractionBox;
