export interface IBoardContext {
    board: string[][],
    setBoard: (b: string[][]) => void
};

export class coordinate {
    row: number;
    column: number;
    constructor(row: number, column: number) {
        this.row = row;
        this.column = column;
    }
    equals(other: coordinate): boolean {
        return this.row === other.row && this.column === other.column;
    }

}

export interface dimensions {
    rows: number,
    columns: number
}

export type direction = "horizontal" | "vertical";