export class coordinate {
    row: number;
    column: number;
    constructor(row: number, column: number) {
        this.row = row;
        this.column = column;
        Object.freeze(this); // makes the object immutable
    }
    equals(other: coordinate): boolean {
        return this.row === other.row && this.column === other.column;
    }
}

// this is what focus gets assigned to when there is no focused coord
// it's a lot easier than making focus a "coordinate | null" type 
export const NO_FOCUS: coordinate = new coordinate(-1, -1);

export interface dimensions {
    rows: number,
    columns: number
}

export type direction = "horizontal" | "vertical";