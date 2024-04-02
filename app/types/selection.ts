import { Coordinate } from "@/app/types/coordinate";
export type Direction = "horizontal" | "vertical";

export interface Selection {
    coordinate: Coordinate,
    direction: Direction,
    focus: boolean
}
