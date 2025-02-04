import { Direction, MazeData, PostionType } from "../types";

export const mazeData: MazeData = [
    ["#", "#", "#", "#", "#", "#"],
    ["#", " ", " ", "#", " ", "#"],
    ["#", " ", " ", "#", " ", "#"],
    ["#", " ", " ", "#", " ", "#"],
    ["#", " ", " ", " ", " ", "#"],
    ["#", " ", " ", " ", " ", "#"],
    ["#", " ", " ", " ", " ", "#"],
    ["#", " ", " ", "#", " ", "#"],
    ["#", " ", " ", " ", " ", "#"],
    ["#", " ", " ", " ", " ", "#"],
    ["#", " ", " ", " ", " ", "#"],
    ["#", "#", "#", "#", "#", "#"],
];

 export const compassOperators = {
    N: {
        left: ({ x, y }:PostionType, distanceNum:number) => ({ x: x - distanceNum, y }),
        right: ({ x, y }:PostionType, distanceNum:number) => ({ x: x + distanceNum, y })
    },
    E: {
        left: ({ x, y }:PostionType, distanceNum:number) => ({x, y:y + distanceNum}),
        right: ({ x, y }:PostionType, distanceNum:number) => ({x, y:y - distanceNum})
    },
    S: {
        left: ({ x, y }:PostionType, distanceNum:number) => ({x:x + distanceNum, y}),
        right: ({ x, y }:PostionType, distanceNum:number) => ({x:x - distanceNum, y})
    },
    W: {
        left: ({ x, y }:PostionType, distanceNum:number) => ({x, y:y - distanceNum}),
        right: ({ x, y }:PostionType, distanceNum:number) => ({x, y:y + distanceNum})
    }
 }