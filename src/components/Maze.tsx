import React from "react";
import { useGame } from "../contexts/GameContext";

const Maze: React.FC = () => {
  const { playerPos, mazeData } = useGame();

  return (
    <div className="flex flex-col items-center mt-4 text-white">
      <div className="bg-gray-900 p-4 rounded mt-4">
        {mazeData.map((row, y) => (
          <div key={y} className="flex">
            {row.map((cell, x) => (
              <div
                key={x}
                className={`w-8 h-8 flex items-center justify-center border ${
                  cell === "#"
                    ? "bg-gray-700 border-gray-600"
                    : "bg-gray-300 border-gray-200"
                } ${
                  playerPos.x === x && playerPos.y === y ? "bg-blue-500" : ""
                }`}
              > {x}:{y}
                {playerPos.x === x && playerPos.y === y ? "🧑" : ""}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Maze;
