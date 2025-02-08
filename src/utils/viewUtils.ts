import { Position, Direction, MazeData, Compass, Distance, Side, RoomPosition, SideRoom } from "../types/index";
import { mazeData } from "../constants/mazeData";
import { Dispatch, SetStateAction } from "react";

export const posToNorth = ({ x, y }: Position) => ({ x, y: y - 1 });
export const posToEast = ({ x, y }: Position) => ({ x: x + 1, y });
export const posToSouth = ({ x, y }: Position) => ({ x, y: y + 1 });
export const posToWest = ({ x, y }: Position) => ({ x: x - 1, y });

export const currentPositionToNearbyRooms = (currentPosition: Position) => {
  return {
    N: posToNorth(currentPosition),
    E: posToEast(currentPosition),
    W: posToWest(currentPosition),
    S: posToSouth(currentPosition),
    center: currentPosition
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
  nearbyPositions: Record<Direction, Position>
) => {
  console.log('nearbyPositions', nearbyPositions)
  const leftNearbyPositions = currentPositionToNearbyRooms(nearbyPositions[directionToLeft(direction)]);
  const rightNearbyPositions = currentPositionToNearbyRooms(nearbyPositions[directionToRight(direction)]);
  console.log('nearbyPositions["center"]', nearbyPositions["center"])
  console.log('directionToRight(direction)', directionToRight(direction))
  console.log('directionToLeft(direction)', directionToLeft(direction))
  const positionMap: Record<Side, Position | null> = {
    leftLeft: leftNearbyPositions[directionToLeft(direction) as Direction] || null,
    left: nearbyPositions[directionToLeft(direction) as Direction] || null,
    right: nearbyPositions[directionToRight(direction) as Direction] || null,
    rightRight: rightNearbyPositions[directionToRight(direction) as Direction] || null,
    forward: nearbyPositions[direction as Direction] || null,
    center: nearbyPositions["center"],
  };
  return positionMap[side as Side];
};

export const isWall = (x: number, y: number, mazeData:MazeData) => mazeData[y]?.[x] === "#";

export const moveForward = (
  playerPos: Position,
  direction: Direction,
  setPlayerPosition: (prev: Position) => void
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

const distanceNumberToTranslateX = (distance: number) => `${distance * 35 - 5}%`;

const positionDirectionSideDistanceToTransform = (position: Position, direction: Direction, side: Side, distance: number) => {
  if(side === 'center') return
  const translateX = distanceNumberToTranslateX(distance);
  console.log(`side: ${side} - distance:${distance} - translateX:${translateX}`)


  const transformMap: Record<string, Record<number, string>> = {
    left: {
      4: `perspective(550px) rotateY(258deg) translateX(130%) scaleX(.35) scaleY(.37)`,
      3: `perspective(550px) rotateY(259deg) translateX(100%) scaleX(.35) scaleY(.36)`,
      2: `perspective(550px) rotateY(260deg) translateX(70%) scaleX(.35) scaleY(.34)`,
      1: `perspective(550px) rotateY(262deg) translateX(45%) scaleX(.35) scaleY(.33)`
    },
    right: {
      4: `perspective(550px) rotateY(-80deg) translateX(100%) scaleX(0.5) scaleY(0.35 )`,
      3: `perspective(550px) rotateY(-80deg) translateX(100%) scaleX(.35) scaleY(.35)`,
      2: `perspective(550px) rotateY(-81deg) translateX(70%) scaleX(.35) scaleY(.33)`,
      1: `perspective(550px) rotateY(-83deg) translateX(45%) scaleX(.35) scaleY(.3)`
    },
    forward: {
      4: `perspective(0px) rotateY(0deg) translateX(0px) translateZ(0.035px) scaleX(1) scaleY(1)`,
      3: `perspective(0px) rotateY(0deg) translateX(-175px) translateZ(-3px) scaleX(3) scaleY(3.3)`,
      2: `perspective(0px) rotateY(0deg) translateX(-275px) translateZ(-4px) scaleX(6) scaleY(5.3)`,
      1: `perspective(0px) rotateY(0deg) translateX(-175px) translateZ(-3px) scaleX(3) scaleY(3.3)`
    }
  }

  return transformMap[side][distance];
}

const findRoomsInDirection = (position: Position, direction: Direction, visiblity: number, rooms: Position[]) => {
  console.log('position', position, 'direction', direction, 'visiblity', visiblity, 'rooms', rooms)
  if (visiblity < 0) return rooms;
  const nextPosition = currentPositionToNearbyRooms(position)[direction]
  console.log('nextPosition', nextPosition)
  if (nextPosition.x < 0 || nextPosition.y < 0) return rooms;
  const uniqueRooms = new Set([...rooms, nextPosition, position])
  const moreRooms = Array.from(uniqueRooms)
  console.log('moreRooms', moreRooms)
  const newVisiblity = visiblity - 1;
  return findRoomsInDirection(nextPosition, direction, newVisiblity, moreRooms)
}

const checkPosition = (position: Position) => {
  return position !== null && position !== undefined && position.x >= 0 && position.y >= 0
}

export const findAllVisibleRoomCoords = ({ x, y }: Position, direction: Direction, visibility: number) => {
  const nearbyRooms = currentPositionToNearbyRooms({ x, y });
  const sides: Side[] = ["left", "leftLeft", "right", "rightRight", "center"];
  const positions = sides.map((eachSide: Side) => directionSideAndRoomsToPosition(direction, eachSide, nearbyRooms));
  const validPositions = positions.filter((position): position is Position => position !== null && checkPosition(position));
  const rooms = validPositions.map((position: Position) => findRoomsInDirection(position, direction, visibility, [])).flat()
  const visibleRooms = rooms.filter(({ x, y }) => isWall(x, y, mazeData))
  return visibleRooms;
}

export const distancePosToForwardWall = (distance: number, { x, y }: Position, mazeData: MazeData) => {
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

export const findTexture = (domain:string, position:Position) => {
  return "/textures/brick_wall.png"
}

export const findbackgroundStyles = (domain: string, position: Position) => {
  return {
    backgroundSize: "contain",
    backgroundColor: "grey",
    backgroundPosition:  Math.floor(Math.random() * 2) ? "top" : "center center",
    backgroundBlendMode: Math.floor(Math.random() * 2) ? "hard-light" : "",
  }
};

const isDouble = (posAxis:number, origAxis:number) => (Math.abs(origAxis) - Math.abs(posAxis)) > 1

const originPositionDirectionToSide = (origin: Position, position: Position, direction: Direction) => {
  const { x: px, y: py } = position
  const { x: ox, y: oy } = origin
  if ((direction === 'N' && position.x > origin.x) ||
    (direction === 'S' && position.x < origin.x)) {
    return isDouble(px, ox) ? 'rightRight' : 'right';
  }
  if ((direction === 'S' && position.x > origin.x) ||
      (direction === 'N' && position.x < origin.x)) {
    return isDouble(px, ox) ? 'leftLeft' : 'left';
  }
  if ((direction === 'E' && position.y > origin.y) ||
      (direction === 'W' && position.y < origin.y)) {
      return isDouble(py, oy) ? 'leftLeft' : 'left';
  }
  if ((direction === 'E' && position.y < origin.y) ||
      (direction === 'W' && position.y > origin.y)) {
      return isDouble(py, oy) ? 'rightRight' : 'right';
  }
  return "center"
}

export const renderRooms = (origin:Position, coords: Position[], direction:Direction) => {
  return coords.map((coord: Position) => {
    console.log('coord', coord)
    const { x: ox, y: oy } = origin;
    const { x: px, y: py } = coord;
    const domain = "";
    const { x, y } = coord;
    const position = { x, y }
    const side: Side = originPositionDirectionToSide(origin, position, direction)
    const distance = Math.max(Math.abs(ox - px), Math.abs(oy - py))
    const id = `${x}:${y} D:${distance} ${side}`;
    const texture = findTexture(domain, { x, y });
    const backgroundStyles = findbackgroundStyles(domain, { x, y });
    const transform = positionDirectionSideDistanceToTransform(position, direction, side, distance);
    return {
      ...coord,
      id,
      key: id,
      height: `${100}%`,
      transform,
      width: `${100}%`,
      backgroundImage: texture,
      ...backgroundStyles,
      zIndex: 10,
    };
  });
};