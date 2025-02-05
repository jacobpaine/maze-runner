import { PositionType, Direction, MazeData, Compass, Distance, Side, RoomPositionType } from "../types/index";
import { compassOperators, mazeData } from "../constants/mazeData";
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
  rotateY: "258deg",
  translateX: (ind: number) => `${ind * 35}%`,
  translateY: "0%",
  scaleX: ".35",
  scaleY: ".35",
  zIndex: "10",
};

export const rightConfig = {
  perspective: "550px",
  rotateY: "-78deg",
  translateX: (ind: number) => `${ind * 35}%`,
  translateY: "0%",
  scaleX: ".35",
  scaleY: ".35",
  zIndex: "10",
};

const sideDistanceToTransform = (side: Side, distance: number) => {
  if (side === "left") {
    const leftTransform = leftConfig.translateX(distance)
    const { perspective, rotateY, scaleX, scaleY} = leftConfig;
    return `perspective(${perspective}) rotateY(${rotateY}) translateX(${leftTransform}) scaleX(${scaleX}) scaleY(${scaleY})`
  }
  if (side === "right") {
    const rightTransform = rightConfig.translateX(distance);
    const { perspective, rotateY, scaleX, scaleY} = rightConfig;
    return `perspective(${perspective}) rotateY(${rotateY}) translateX(${rightTransform}) scaleX(${scaleX}) scaleY(${scaleY})`
  }
    return ``;
}

const positionSideToSideRoom = ({ x, y }: PositionType, side: Side, distanceNumber: number) => {
  if (isWall(x, y, mazeData)) {
    const transform = sideDistanceToTransform(side, distanceNumber);
    const wall = {
      id: `${side} x${x}/y${y} ${distanceNumber}`,
      side,
      width: "88%",
      height: "90%",
      transform,
      texture: "/textures/brick_wall.png",
      zIndex: 10 - distanceNumber,
    }
    return wall;
  }
}

const roomDirectionToSideRoom = (room: RoomPositionType) => {
  const { x, y, distance, side } = room;
  const distanceNumber = roomDistanceToDistanceNumber(distance);
  const roomPosition = {x, y}
  const sideRoom = positionSideToSideRoom(roomPosition, side, distanceNumber);
  if (!sideRoom) return;
  return sideRoom;
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

const findAllVisibleRoomCoords = (position: PositionType, direction: Direction) => {
  const distances: Distance[] = ["close", "near", "mid", "far"];
  const roomsInline = findRoomsInLine(distances, direction, "forward", position, []);
  const visibleRooms = roomsInline?.map((room: RoomPositionType) => {
    const { x, y, distance } = room;
    const nearbyRooms = currentPositionToNearbyRooms({ x, y });
    const visibleCoords = [
      { ...nearbyRooms[directionToLeft(direction)], distance, side: 'left' as "left" },
      { ...nearbyRooms[directionToRight(direction)], distance, side: 'right' as "right" }
    ].filter(({ x, y }: PositionType) => isWall(x, y, mazeData));
    return visibleCoords;
  }).flat();
  return visibleRooms;
}

export const posDirectionToSideRooms = (playerPos: PositionType, direction: Direction) => {
  const visibleRooms: RoomPositionType[] = findAllVisibleRoomCoords(playerPos, direction) || [];
  return visibleRooms.map((room) => {
    const sideRoom = roomDirectionToSideRoom(room, direction);
    if (!sideRoom) return;
    return { ...sideRoom, side: sideRoom.side as Side };
  });
}
