export type direction = "horizontal" | "vertical";

export class Coordinate {
    row: number;
    column: number;
    constructor(row: number, column: number) {
        this.row = row;
        this.column = column;
        Object.freeze(this); // makes the object immutable
    }
    equals(other: Coordinate): boolean {
        return this.row === other.row && this.column === other.column;
    }
}

export interface Selection {
    coordinate: Coordinate,
    direction: direction,
    focus: boolean
}

// this is what focus gets assigned to when there is no focused coord
// it's a lot easier than making focus a "coordinate | null" type 
export const NO_SELECTION: Coordinate = new Coordinate(-1, -1);

export interface dimensions {
    rows: number,
    columns: number
}

export interface wordselection {
    word: number,
    direction: direction
}