import { useEffect } from "react";
import { FirstPersonView } from "./components/FirstPersonView";
import Maze from "./components/Maze";
import { useGame } from "./contexts/GameContext";
import { useNpc } from "./contexts/NpcContext";
import { npcData } from "./constants/npcData";
import {
  moveForward,
  turnAround,
  turnLeft,
  turnRight,
} from "./utils/viewUtils";
import InteractionBox from "./components/InteractionBox";

export default function App() {
  const { playerPos, setDirection, direction, setPlayerPos } = useGame();
  const { activeNpc, setActiveNpc } = useNpc();

  const handleLeft = () => {
    turnLeft(setDirection);
  };

  const handleRight = () => {
    turnRight(setDirection);
  };

  const handleTurnAround = () => {
    turnAround(setDirection);
  };

  const handleMoveForward = () => {
    moveForward(playerPos, direction, setPlayerPos);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      event.preventDefault(); // Prevent default behavior for arrow keys
      switch (event.key) {
        case "ArrowUp":
        case "w":
          handleMoveForward();
          break;
        case "ArrowLeft":
        case "a":
          handleLeft();
          break;
        case "ArrowRight":
        case "d":
          handleRight();
          break;
        case "ArrowDown":
        case "s":
          handleTurnAround();
          break;
        default:
          break; // Ignore other keys
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [playerPos, direction]); // Add direction to dependencies


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      {/* Game Title */}
      <h1 className="text-3xl font-bold mb-4">Maze Runner</h1>

      <div className="flex space-x-4">
        <FirstPersonView />
        <InteractionBox />
      </div>
      <div className="mt-4 p-2 bg-gray-800 rounded text-center">
        <p>
          📍 Position: {playerPos.x}, {playerPos.y} | 🧭 Facing: {direction}
        </p>
      </div>

      <Maze />

      {/* Movement Controls */}
      <div className="mt-4 space-x-4">
        <button onClick={handleLeft} className="p-2 bg-gray-700 rounded">
          ↩️ Left
        </button>
        <button onClick={handleMoveForward} className="p-2 bg-gray-700 rounded">
          ⬆️ Forward
        </button>
        <button onClick={handleRight} className="p-2 bg-gray-700 rounded">
          ↪️ Right
        </button>
        <button onClick={handleTurnAround} className="p-2 bg-gray-700 rounded">
          🔄 Turn Around
        </button>
      </div>
      <button
        className="p-2 mt-4 bg-gray-700 rounded"
        onClick={() => setActiveNpc(npcData[0])}
      >
        Open NPC Dialog
      </button>
    </div>
  );
}
