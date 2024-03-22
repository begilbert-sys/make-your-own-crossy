export class Coordinate {
    static NONE: Coordinate = new Coordinate(-1, -1);
    row: number;
    column: number;
    constructor(row: number, column: number) {
        this.row = row;
        this.column = column;
        Object.freeze(this); // makes the object immutable
    }
    equals(other: Coordinate): boolean {
        if (this == Coordinate.NONE || other == Coordinate.NONE) {
            return false;
        }
        return this.row === other.row && this.column === other.column;
    }
}