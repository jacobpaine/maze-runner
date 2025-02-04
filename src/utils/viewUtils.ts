import { PositionType, Direction, MazeData, Compass, Distance, Side} from "../types/index";
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
  side: "left" | "right" | "forward",
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
    "close": 1,
    "near": 2,
    "mid": 3,
    "far": 4
  }
  return distanceMap[roomDistance]
}

export const leftConfig = {
  perspective: "550px",
  rotateY: "260deg",
  translateX: (ind: number) => `${ind * 35 - 20}%`,
  translateY: "0%",
  scaleX: ".35",
  scaleY: ".45",
  zIndex: "10",
};

export const rightConfig = {
  perspective: "550px",
  rotateY: "-80deg",
  translateX: (ind: number) => `${ind * 35 - 20}%`,
  translateY: "0%",
  scaleX: ".35",
  scaleY: ".45",
  zIndex: "10",
};

const sideDistanceToTransform = (side: "left" | "right", distance: number) => {
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

const positionSideToSideRoom = ({ x, y }: PositionType, side: "left" | "right", distanceNumber: number) => {
  if (isWall(x, y, mazeData)) {
    const transform = sideDistanceToTransform(side, distanceNumber);
    console.log('transform', transform)
    const wall = {
      id: `${side}-${distanceNumber}`,
      side,
      width: "85%",
      height: "100%",
      transform,
      backgroundColor: `rgba(100, ${distanceNumber * 20}, 100, 1)`,
      zIndex: 10 - distanceNumber,
    }
    return wall;
  }
}

const roomSideDistanceDirectionToSideRoom = (room: PositionType, side: "left" | "right", distance: string, direction: Direction) => {
  const distanceNumber = roomDistanceToDistanceNumber(distance);

  if (!compassOperators[direction]) return

  const calculation = compassOperators[direction][side];
  if (!calculation) {
    console.error(`Invalid side: ${side} for direction: ${direction}`);
    return;
  }

  const roomPosition = calculation(room, distanceNumber);
  const sideRoom = positionSideToSideRoom(roomPosition, side, distanceNumber);
  if (!sideRoom) return
  return sideRoom;
};

function findRoomsInLine(distance:number, direction:Direction, side:Side, position:PositionType, roomsInline:PositionType[]) {
  if (distance === 1) return roomsInline;
  const nearbyRooms = currentPositionToNearbyRooms(position);
  const forwardRoom = directionSideAndRoomsToPosition(direction, side, nearbyRooms);
  const moreRooms = [...roomsInline, forwardRoom];
  const newDistance = distance - 1;
  findRoomsInLine(newDistance, direction, side, forwardRoom, moreRooms)
}

const findAllVisibleRoomCoords = (position: PositionType, direction: Direction) => {
  const distances: string[] = ["far", "mid", "near", "close"];
  const roomsInline = findRoomsInLine(distances.length, direction, "forward", position, []);
  const visibleRooms = roomsInline?.map((eachPosition: PositionType) => {
    const nearbyRooms = currentPositionToNearbyRooms(eachPosition);
    const left: PositionType = nearbyRooms[directionToLeft(direction)];
    const right: PositionType = nearbyRooms[directionToRight(direction)];
    const visibleCoords = [left, right].filter(({ x, y }: PositionType) => isWall(x, y, mazeData));
    return visibleCoords;
  }).flat();
  return visibleRooms;
}

const posCoordsDirectionToRenderableObjects = (position:PositionType, coordinates:PositionType[], direction:Direction) => {

}

const posDirectionDistanceToSideRooms = (playerPos: PositionType, direction: Direction) => {
  const visibleRoomCoords: PositionType[] = findAllVisibleRoomCoords(playerPos, direction) || [];



  // const sides: ("left" | "right")[] = ["left", "right"];
  // const room:PositionType = { x: playerPos.x, y: playerPos.y }
  // return sides.map((side) => {
  //   const sideRoom = roomSideDistanceDirectionToSideRoom(room, side, distance, direction);
  //   if (!sideRoom) return
  //   return sideRoom;
  // })
  // id = coordDirectionDistance = 1x1yEast4



  return [{ backgroundColor:"rgba(100, 80, 100, 1)", height:"100%", id:"left-4", side:
"left", transform:"perspective(550px) rotateY(260deg) translateX(120%) scaleX(.35) scaleY(.45)", width:"85%", zIndex: 6}]
}
