export class Coordinates {
    static NONE: Coordinates = new Coordinates(-1, -1);
    row: number;
    column: number;
    constructor(row: number, column: number) {
        this.row = row;
        this.column = column;
        Object.freeze(this); // makes the object immutable
    }
    equals(other: Coordinates): boolean {
        return this.row === other.row && this.column === other.column;
    }
    toString(): string {
        return `${this.row}, ${this.column}`;
    }
    static fromString(coordsStr: string): Coordinates {
        const [rowStr, colStr] = coordsStr.split(',');
        return new Coordinates(parseInt(rowStr), parseInt(colStr));
    }
}