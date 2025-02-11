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

const reverseDirection = (direction: Direction) => {
  if (isXAxis(direction)) return direction === "N" ? "S" : "N";
  else return direction === "W" ? "E" : "W";
}

export const directionSideAndRoomsToPosition = (
  direction: Direction,
  side: Side,
  nearbyPositions: Record<Direction, Position>
) => {
  const leftNearbyPositions = currentPositionToNearbyRooms(nearbyPositions[directionToLeft(direction)]);
  const rightNearbyPositions = currentPositionToNearbyRooms(nearbyPositions[directionToRight(direction)]);
  const positionMap: Record<Side, Position | null> = {
    leftLeft: leftNearbyPositions[directionToLeft(direction) as Direction] || null,
    left: nearbyPositions[directionToLeft(direction) as Direction] || null,
    right: nearbyPositions[directionToRight(direction) as Direction] || null,
    rightRight: rightNearbyPositions[directionToRight(direction) as Direction] || null,
    forward: nearbyPositions[direction as Direction] || null,
    backward: nearbyPositions[reverseDirection(direction as Direction)] || null,
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

const positionDirectionSideDistanceToTransform = (position: Position, direction: Direction, side: Side, distance: number) => {
  if (side === 'center') return `perspective(0px) rotateY(0deg) translateX(0%) translateZ(0px) scaleX(0) scaleY(0)`
  const transZLeft = "-100";
  const transZRight = "-110";
  const transZLeftLeft = "-300";
  const transZRightRight = "300";
  const transformMap: Record<string, Record<number, string>> = {
    center: {
      0: `perspective(550px) rotateY(90deg) translateX(-155%) translateZ(-36px) scaleX(0.5) scaleY(0.35)`,
      1: `perspective(0px) rotateY(0deg) translateX(0%) translateZ(0.3px) scaleX(0.4) scaleY(0.4)`,
      2: `perspective(0px) rotateY(0deg) translateX(-2%) translateZ(.2px) scaleX(0.28) scaleY(0.37)`,
      3: `perspective(0px) rotateY(0deg) translateX(-2%) translateZ(0px) scaleX(0.31) scaleY(0.37)`,
      4: `perspective(0px) rotateY(0deg) translateX(-2%) translateZ(0px) scaleX(0.32) scaleY(0.33)`,
      5: `perspective(0px) rotateY(0deg) translateX(-2%) translateZ(0px) scaleX(0.29) scaleY(0.27)`,
    },
    left: {
      0: `perspective(250px) rotateY(90deg) translateX(-100px) translateZ(${transZLeft}px) scaleX(1) scaleY(1)`,
      1: `perspective(250px) rotateY(90deg) translateX(100px) translateZ(${transZLeft}px) scaleX(1) scaleY(1)`,
      2: `perspective(250px) rotateY(90deg) translateX(280px) translateZ(${transZLeft}px) scaleX(1) scaleY(1)`,
      3: `perspective(250px) rotateY(90deg) translateX(500px) translateZ(${transZLeft}px) scaleX(1) scaleY(1)`,
      4: `perspective(250px) rotateY(90deg) translateX(650px) translateZ(${transZLeft}px) scaleX(1) scaleY(1)`,
      5: `perspective(250px) rotateY(90deg) translateX(900px) translateZ(${transZLeft}px) scaleX(1) scaleY(1)`
    },
    leftLeft: {
      0: `perspective(200px) rotateY(90deg) translateX(-30%) translateZ(-40px) scaleX(0) scaleY(0)`,
      1: `perspective(200px) rotateY(90deg) translateX(450px) translateZ(-160px) scaleX(0) scaleY(0)`,
      2: `perspective(200px) rotateY(90deg) translateX(150px) translateZ(${transZLeftLeft}px) scaleX(1) scaleY(1)`,
      3: `perspective(200px) rotateY(90deg) translateX(300px) translateZ(${transZLeftLeft}px) scaleX(1) scaleY(1)`,
      4: `perspective(200px) rotateY(90deg) translateX(550px) translateZ(${transZLeftLeft}px) scaleX(1) scaleY(1)`,
      5: `perspective(200px) rotateY(90deg) translateX(700px) translateZ(${transZLeftLeft}px) scaleX(1) scaleY(1)`
    },
    right: {
      0: `perspective(250px) rotateY(-90deg) translateX(50px) translateZ(${transZRight}px) scaleX(1) scaleY(1)`,
      1: `perspective(250px) rotateY(-90deg) translateX(-200px) translateZ(${transZRight}px) scaleX(1) scaleY(1)`,
      2: `perspective(300px) rotateY(-90deg) translateX(-350px) translateZ(${transZRight}px) scaleX(1) scaleY(1)`,
      3: `perspective(250px) rotateY(-90deg) translateX(-500px) translateZ(${transZRight}px) scaleX(1) scaleY(1)`,
      4: `perspective(250px) rotateY(-90deg) translateX(-750px) translateZ(${transZRight}px) scaleX(1) scaleY(1)`,
      5: `perspective(250px) rotateY(-90deg) translateX(-1000px) translateZ(${transZRight}px) scaleX(1) scaleY(1)`
    },
    rightRight: {
      0: `perspective(200px) rotateY(-80deg) translateX(100%) translateZ(${transZRightRight}px) scaleX(0) scaleY(0)`,
      1: `perspective(200px) rotateY(-80deg) translateX(100%) translateZ(${transZRightRight}px) scaleX(0) scaleY(0)`,
      2: `perspective(200px) rotateY(84deg) translateX(100%) translateZ(200px) scaleX(1) scaleY(1)`,
      3: `perspective(200px) rotateY(84deg) translateX(450px) translateZ(200px) scaleX(1) scaleY(1)`,
      4: `perspective(200px) rotateY(84deg) translateX(650px) translateZ(200px) scaleX(1) scaleY(1)`,
      5: `perspective(200px) rotateY(84deg) translateX(850px) translateZ(200px) scaleX(1) scaleY(1)`,
    }
  }
  return transformMap[side][distance];
}

const positionDirectionSideDistanceToFrontTransform = (position: Position, direction: Direction, side: Side, distance: number) => {

  const transformMap: Record<string, Record<number, string>> = {
    left: {
      0: `perspective(550px) rotateY(0deg) translateX(-250px) translateY(0px) translateZ(550px) scaleX(0) scaleY(0)`,
      1: `perspective(550px) rotateY(0deg) translateX(-250px) translateY(0px) translateZ(-100px) scaleX(1) scaleY(1.25)`,
      2: `perspective(550px) rotateY(0deg) translateX(-250px) translateY(0px) translateZ(-550px) scaleX(1) scaleY(1.25)`,
      3: `perspective(550px) rotateY(0deg) translateX(-250px) translateY(0px) translateZ(-1100px) scaleX(1) scaleY(1.25)`,
      4: `perspective(550px) rotateY(0deg) translateX(-250px) translateY(0px) translateZ(-1650px) scaleX(1) scaleY(1.25)`,
      5: `perspective(550px) rotateY(0deg) translateX(-250px) translateY(0px) translateZ(-2200px) scaleX(1) scaleY(1.25)`,
    },
    leftLeft: {
      0: `perspective(550px) rotateY(90deg) translateX(-330px) translateZ(0px) scaleX(0) scaleY(0)`,
      1: `perspective(550px) rotateY(90deg) translateX(-330px) translateZ(0px) scaleX(1) scaleY(1)`,
      2: `perspective(550px) rotateY(0deg) translateX(-500px) translateZ(-550px) scaleX(1) scaleY(1.25)`,
      3: `perspective(550px) rotateY(0deg) translateX(-500px) translateZ(-1100px) scaleX(1) scaleY(1.25)`,
      4: `perspective(550px) rotateY(0deg) translateX(-500px) translateZ(-1650px) scaleX(1) scaleY(1.25)`,
      5: `perspective(550px) rotateY(0deg) translateX(-500px) translateZ(-2200px) scaleX(1) scaleY(1.25)`
    },
    right: {
      0: `perspective(550px) rotateY(0deg) translateX(255px) translateZ(0px) scaleX(1) scaleY(1.25)`,
      1: `perspective(550px) rotateY(0deg) translateX(255px) translateZ(-350px) scaleX(1) scaleY(1.25)`,
      2: `perspective(550px) rotateY(0deg) translateX(255px) translateZ(-550px) scaleX(1) scaleY(1.25)`,
      3: `perspective(550px) rotateY(0deg) translateX(255px) translateZ(-1100px) scaleX(1) scaleY(1.25)`,
      4: `perspective(550px) rotateY(0deg) translateX(255px) translateZ(-1650px) scaleX(1) scaleY(1.25)`,
      5: `perspective(550px) rotateY(0deg) translateX(255px) translateZ(-2200px) scaleX(1) scaleY(1.25)`,
    },
    rightRight: {
      0: `perspective(550px) rotateY(0deg) translateX(510px) translateZ(0px) scaleX(1) scaleY(1.25)`,
      1: `perspective(550px) rotateY(0deg) translateX(510px) translateZ(0px) scaleX(1) scaleY(1.25)`,
      2: `perspective(550px) rotateY(0deg) translateX(510px) translateZ(-550px) scaleX(1) scaleY(1.25)`,
      3: `perspective(550px) rotateY(0deg) translateX(408px) translateZ(-1100px) scaleX(1) scaleY(1.25)`,
      4: `perspective(550px) rotateY(0deg) translateX(420px) translateZ(-1650px) scaleX(1) scaleY(1.25)`,
      5: `perspective(550px) rotateY(0deg) translateX(510px) translateZ(-2200px) scaleX(1) scaleY(1.25)`,
    },
    center: {
      0: `perspective(550px) rotateY(0deg) translateX(0px) translateY(0px) translateZ(0px) scaleX(1) scaleY(1)`,
      1: `perspective(550px) rotateY(0deg) translateX(0px) translateY(0px) translateZ(0px) scaleX(1) scaleY(1.25)`,
      2: `perspective(550px) rotateY(0deg) translateX(0px) translateY(0px) translateZ(-550px) scaleX(1) scaleY(1.25)`,
      3: `perspective(550px) rotateY(0deg) translateX(0px) translateY(0px) translateZ(-1100px) scaleX(1) scaleY(1.25)`,
      4: `perspective(550px) rotateY(0deg) translateX(0px) translateY(0px) translateZ(-1650px) scaleX(1) scaleY(1.25)`,
      5: `perspective(550px) rotateY(0deg) translateX(0px) translateY(0px) translateZ(-2200px) scaleX(1) scaleY(1.25)`,
    }
  }
  return transformMap[side][distance];
}

const findRoomsInDirection = (position: Position, direction: Direction, visiblity: number, rooms: Position[]) => {
  if (visiblity < 0) return rooms;
  const nextPosition = currentPositionToNearbyRooms(position)[direction]
  if (nextPosition.x < 0 || nextPosition.y < 0) return rooms;
  const uniqueRooms = new Set([...rooms, nextPosition, position])
  const moreRooms = Array.from(uniqueRooms)
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

const isDouble = (posAxis:number, origAxis:number) => (Math.abs(origAxis - posAxis)) > 1

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
  if ((direction === 'E' && position.y < origin.y) ||
      (direction === 'W' && position.y > origin.y)) {
      return isDouble(py, oy) ? 'leftLeft' : 'left';
  }
  if ((direction === 'E' && position.y > origin.y) ||
      (direction === 'W' && position.y < origin.y)) {
      return isDouble(py, oy) ? 'rightRight' : 'right';
  }
  return "center"
}

const isXAxis = (direction: Direction) => direction === "N" || direction === "S";

export const renderRooms = (origin: Position, coords: Position[], direction: Direction) => {
  console.log('coords', coords  )
  return coords.map((coord: Position) => {
    const { x: ox, y: oy } = origin;
    const { x: px, y: py } = coord;
    const domain = "";
    const { x, y } = coord;
    const position = { x, y }
    const side: Side = originPositionDirectionToSide(origin, position, direction)
    const distance = !isXAxis(direction) ? Math.abs(ox - px) : Math.abs(oy - py)
    const id = `${x}:${y} D:${distance} ${side}`;
    const texture = findTexture(domain, { x, y });
    const backgroundStyles = findbackgroundStyles(domain, { x, y });
    const transform = positionDirectionSideDistanceToTransform(position, direction, side, distance);

    const sideWall = {
      ...coord,
      id,
      key: id,
      height: `${100}%`,
      transform,
      width: `${100}%`,
      backgroundImage: texture,
      ...backgroundStyles,
      zIndex: 9 - distance
    };

    const frontTransform = positionDirectionSideDistanceToFrontTransform(position, direction, side, distance);
    const nearbyRooms = currentPositionToNearbyRooms(coord);
    const backPosition = directionSideAndRoomsToPosition(direction, "backward", nearbyRooms);
    if (backPosition === null || isWall(backPosition.x, backPosition.y, mazeData)) return [sideWall];

    const frontWall = {
      ...coord,
      id: `${id} front`,
      key: `${id} front`,
      height: `${100}%`,
      transform:frontTransform,
      width: `${100}%`,
      backgroundImage: texture,
      ...backgroundStyles,
      zIndex: 10 - distance,
    }


    return [frontWall, sideWall];
  });
};