import React, {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
} from "react";
import { Direction, MazeData, Position } from "../types";
import { mazeData } from "../constants/mazeData";
import { currentPositionToNearbyRooms } from "../utils/viewUtils";
import { npcData } from "../constants/npcData";
import { useNpc } from "./NpcContext";

interface RoomType {
  name: string;
  description: string;
}
interface GameContextType {
  setPlayerPos: Dispatch<SetStateAction<Position>>;
  playerPos: Position;
  currentRoom: RoomType;
  setRoom: (room: RoomType) => void;
  direction: Direction;
  mazeData: MazeData;
  setDirection: Dispatch<SetStateAction<Direction>>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { setActiveNpc } = useNpc();
  const [playerPos, setPlayerPos] = useState<Position>({ x: 2, y: 2 });
  const [currentRoom, setCurrentRoom] = useState<RoomType>({
    name: "Starting Room",
    description: "You find yourself in a dark and damp stone chamber.",
  });
  const [direction, setDirection] = useState<"N" | "S" | "E" | "W">("N");

  useEffect(() => {
    const newPos = currentPositionToNearbyRooms(playerPos)[direction];
    if (newPos.x !== playerPos.x || newPos.y !== playerPos.y) {
      const npc = npcData.find(
        (npc) =>
          npc.position.x === playerPos.x && npc.position.y === playerPos.y
      );
      console.log("npc", npc);
      if (npc) {
        setActiveNpc(npc);
      } else {
        setActiveNpc(null);
      }
    }
  }, [playerPos]);

  return (
    <GameContext.Provider
      value={{
        setPlayerPos,
        playerPos,
        currentRoom,
        setRoom: setCurrentRoom,
        mazeData,
        setDirection,
        direction,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};
