import { MazeData, PositionType } from "../types";

export const mazeData: MazeData = [
    ["#", "#", "#", "#", "#", "#"],
    ["#", " ", "#", "#", " ", "#"],
    ["#", " ", "#", "#", " ", "#"],
    ["#", " ", "#", "#", " ", "#"],
    ["#", " ", "#", " ", " ", "#"],
    ["#", " ", " ", "#", " ", "#"],
    ["#", " ", " ", " ", " ", "#"],
    ["#", " ", " ", "#", " ", "#"],
    ["#", " ", " ", " ", " ", "#"],
    ["#", " ", " ", " ", " ", "#"],
    ["#", " ", " ", " ", " ", "#"],
    ["#", "#", "#", "#", "#", "#"],
];

const roundToZero = (n: number) => {
    console.log('n', n)
    if (n < 0) return 0;
    return n;
}

 export const compassOperators = {
    N: {
        left: ({ x, y }:PositionType, distanceNum:number) => ({ x: roundToZero(x - distanceNum), y }),
        right: ({ x, y }:PositionType, distanceNum:number) => ({ x: x + distanceNum, y })
    },
    E: {
        left: ({ x, y }:PositionType, distanceNum:number) => ({x, y:y - distanceNum}),
        right: ({ x, y }:PositionType, distanceNum:number) => ({x, y:roundToZero(y + distanceNum)})
    },
    S: {
        left: ({ x, y }:PositionType, distanceNum:number) => ({x:x, y}),
        right: ({ x, y }:PositionType, distanceNum:number) => ({x:roundToZero(x), y})
    },
    W: {
        left: ({ x, y }:PositionType, distanceNum:number) => ({x, y:roundToZero(y + distanceNum)}),
        right: ({ x, y }:PositionType, distanceNum:number) => ({x, y:y - distanceNum})
    }
 }