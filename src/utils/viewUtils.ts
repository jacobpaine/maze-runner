import { PositionType, Direction, MazeData, Compass, Distance, Side, RoomPositionType, SideRoom } from "../types/index";
import { mazeData } from "../constants/mazeData";
import { Dispatch, SetStateAction } from "react";

export const posToNorth = ({ x, y }: PositionType) => ({ x, y: y - 1 });
export const posToEast = ({ x, y }: PositionType) => ({ x: x + 1, y });
export const posToSouth = ({ x, y }: PositionType) => ({ x, y: y + 1 });
export const posToWest = ({ x, y }: PositionType) => ({ x: x - 1, y });

export const currentPositionToNearbyRooms = (currentPositon: PositionType) => {
  return {
    N: posToNorth(currentPositon),
    E: posToEast(currentPositon),
    W: posToWest(currentPositon),
    S: posToSouth(currentPositon),
  };
};

export const compass:Compass = {
  N: { left: "W", right: "E", back: "S" },
  E: { left: "N", right: "S", back: "W" },
  S: { left: "E", right: "W", back: "N" },
  W: { left: "S", right: "N", back: "E" },
};


export const directionToLeft = (currentDirection: Direction): Direction => {
  const directions = ["N", "W", "S", "E"];
  const index = directions.indexOf(currentDirection);
  if (index === -1) return currentDirection;
  return directions[(index + 1) % 4] as Direction;
};

export const directionToRight = (currentDirection: Direction): Direction => {
  const directions = ["N", "W", "S", "E"];
  const index = directions.indexOf(currentDirection);
  if (index === -1) return currentDirection;
  return directions[(index + 3) % 4] as Direction;
};

export const directionSideAndRoomsToPosition = (
  direction: Direction,
  side: Side,
  nearbyPositions: Record<Direction, PositionType>
) => {
  const defaultPosition = { x: 1, y: 1 };

  // Get positions based on direction
  const positionMap = {
    left: nearbyPositions[directionToLeft(direction) as Direction] || null,
    right: nearbyPositions[directionToRight(direction) as Direction] || null,
    forward: nearbyPositions[direction] || null,
  };

  return positionMap[side] || defaultPosition; // Return the position or default
};

export const isWall = (x: number, y: number, mazeData:MazeData) => mazeData[y]?.[x] === "#";

export const moveForward = (
  playerPos: PositionType,
  direction: Direction,
  setPlayerPosition: (prev: PositionType) => void
) => {
    const nearbyRooms = currentPositionToNearbyRooms(playerPos);
    const { x: newX, y: newY } = directionSideAndRoomsToPosition(
      direction,
      "forward",
      nearbyRooms
    );
    if (!isWall(newX, newY, mazeData)) {
      return setPlayerPosition({ x: newX, y: newY });
    }
  };

export const turnLeft = (setDirection: Dispatch<SetStateAction<Direction>>) => {
  return setDirection((prev: Direction) => directionToLeft(prev));
};

export const turnRight = (setDirection: Dispatch<SetStateAction<Direction>>) => {
  return setDirection((prev: Direction) => directionToRight(prev));
};

export const turnAround = (setDirection: Dispatch<SetStateAction<Direction>>) => {
  return setDirection((prev: Direction) =>
    prev === "N" ? "S" : prev === "S" ? "N" : prev === "E" ? "W" : "E"
  );
};

const roomDistanceToDistanceNumber = (roomDistance: string) => {
  const distanceMap: Record<string, number> = {
    "close": 4,
    "near": 3,
    "mid": 2,
    "far": 1
  }
  return distanceMap[roomDistance]
}

export const leftConfig = {
  perspective: "550px",
  rotateY: "260deg",
  translateX: (ind: number) => `${ind * 35 - 5 }%`,
  translateY: "0%",
  scaleX: ".35",
  scaleY: ".35",
  zIndex: "10",
};

export const rightConfig = {
  perspective: "550px",
  rotateY: "-80deg",
  translateX: (ind: number) => `${ind * 35 - 5}%`,
  translateY: "0%",
  scaleX: ".35",
  scaleY: ".35",
  zIndex: "10",
};

const sideDistanceToTransform = (side: Side, distance: number) => {
  console.log('distance: ', distance)
  const transformMap:Record<string, Record<number, string>> = {
    left: {
      4:  "perspective(550px) rotateY(-80deg) translateX(135%) scaleX(.35) scaleY(.35)",
      3: "",
      2: "",
      1: ""
    },
    right: {
      3: "",
      2: "",
      1: ""
    }
  };

  if (side === "left" || side === "right") {
    const transform:string = transformMap[side][distance];
    return transform
  }

  return "";
}

const positionSideToSideRoom = ({ x, y }: PositionType, side: Side, distanceNumber: number) => {
  console.log('isWall(x, y, mazeData)', `${x}:${y}`,isWall(x, y, mazeData), side)
  if (isWall(x, y, mazeData)) {
    const transform = sideDistanceToTransform(side, distanceNumber);
    const wall = {
      id: `${side} ${x}:${y} ${distanceNumber}`,
      side,
      width: "100%",
      height: "90%",
      transform,
      texture: "/textures/brick_wall.png",
      zIndex: 10 - distanceNumber,
    }
    return wall;
  }
}

const roomDirectionToSideRooms = (room: RoomPositionType) => {
  const { x, y, distance, side } = room;
  const distanceNumber = roomDistanceToDistanceNumber(distance);
  const roomPosition = { x, y }
  const sides = ["front", "left", "right"]
  const sideRooms = sides.map((eachSide) => positionSideToSideRoom(roomPosition, eachSide, distanceNumber))
  if (!sideRooms) return;
  return sideRooms;
};

const findRoomsInLine = (distances: Distance[], direction: Direction, side: Side, position: PositionType, roomsInline: RoomPositionType[]): RoomPositionType[] => {
  if (roomsInline.length === distances.length) return roomsInline;
  const nearbyRooms = currentPositionToNearbyRooms(position);
  const forwardRoomPosition = directionSideAndRoomsToPosition(direction, side, nearbyRooms);
  const currentRoom: RoomPositionType = { ...position, distance: distances[roomsInline.length], side };
  const forwardRoom: RoomPositionType = { ...forwardRoomPosition, distance: distances[roomsInline.length], side };
  const moreRooms = [...roomsInline, currentRoom];
  return findRoomsInLine(distances, direction, side, forwardRoom, moreRooms);
};

export const findAllVisibleRoomCoords = (position: PositionType, direction: Direction) => {
  const distances: Distance[] = ["close", "near", "mid", "far"];
  const roomsInline = findRoomsInLine(distances, direction, "forward", position, []);
  const visibleRooms = roomsInline?.map((room: RoomPositionType) => {
    const { x, y, distance } = room;
    const nearbyRooms = currentPositionToNearbyRooms({ x, y });
    const coords = [
      { ...nearbyRooms[directionToLeft(direction)], distance, side: 'left' as "left" },
      { ...nearbyRooms[directionToRight(direction)], distance, side: 'right' as "right" },
      { ...nearbyRooms[direction], distance, side: 'forward' as "forward" }
    ]
    const visibleCoords = coords.filter(({ x, y }: PositionType) => {
      return isWall(x, y, mazeData)
    });
    return visibleCoords;
  }).flat();
  return visibleRooms;
}

export const posDirectionToSideRooms = (playerPos: PositionType, direction: Direction) => {
  const visibleRooms: RoomPositionType[] = findAllVisibleRoomCoords(playerPos, direction) || [];
  return visibleRooms.map((room) => {
    const sideRooms = roomDirectionToSideRooms(room);
    if (!sideRooms) return;
    return { ...sideRooms };
  });
}

export const forwardXPos = (direction: Direction, distance: number, pos:PositionType) =>
  direction === "E" ? pos.x + distance : direction === "W" ? pos.x - distance : pos.x;
export const forwardYPos = (direction: Direction, distance: number, pos:PositionType) =>
  direction === "N" ? pos.y - distance : direction === "S" ? pos.y + distance : pos.y;

export const distancePosToForwardWall = (distance: number, { x, y }: PositionType, mazeData: MazeData) => {
  if (mazeData[y]?.[x] === "#") {
    const wallWidth: Record<string, number> = { "3": 30, "2": 50, "1": 88 };
    const wallHeight: Record<string, number> = {
      "3": 44,
      "2": 52,
      "1": 68,
    };
    const wallTop: Record<string, number> = { "3": 23, "2": 19, "1": 11 };
    return {
      id: `wall-${distance}`,
      width: `${wallWidth[distance]}%`,
      height: `${wallHeight[distance]}%`,
      top: `${wallTop[distance]}%`,
      texture: "/textures/brick_wall.png",
      zIndex: 30 - distance,
    };
  }
}

