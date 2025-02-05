
export interface PositionType {
  x: number;
  y: number;
}
export type Distance = "close" | "near" | "mid" | "far"
export interface RoomPositionType extends PositionType {
  distance: Distance;
  side: Side;
}

export type MazeData = string[][];

export type Direction = "N" | "E" | "S" | "W";

type Turn = {
  left: string
  right: string
  back: string
}
export type Compass = Record<string, Turn>


export type Side = "forward" | "left" | "right"