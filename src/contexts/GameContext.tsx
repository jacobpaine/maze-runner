import React, {
  useEffect,
  createContext,
  ReactNode,
  useContext,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import { Direction, MazeData, PositionType } from "../types";
import { mazeData } from "../constants/mazeData";

interface RoomType {
  name: string;
  description: string;
}
interface GameContextType {
  setPlayerPos: Dispatch<SetStateAction<PositionType>>;
  playerPos: PositionType;
  currentRoom: RoomType;
  setRoom: (room: RoomType) => void;
  direction: Direction;
  mazeData: MazeData;
  setDirection: Dispatch<SetStateAction<Direction>>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{
  children: ReactNode;
  mazeData: MazeData;
}> = ({ children }) => {
  const [playerPos, setPlayerPos] = useState<PositionType>({ x: 1, y: 1 });
  const [currentRoom, setCurrentRoom] = useState<RoomType>({
    name: "Starting Room",
    description: "You find yourself in a dark and damp stone chamber.",
  });
  const [direction, setDirection] = useState<"N" | "S" | "E" | "W">("N");

  useEffect(() => {
    console.log("Updated Direction:", direction);
  }, [direction]);

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
