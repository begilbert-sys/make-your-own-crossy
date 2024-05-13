import { Coordinates } from '@/app/types/coordinate';

export type Direction = "across" | "down";

/* 
Three paramater options for constructor a Board: 
rows, columns - constructs a blank board of the specified size 
rows, columns, oldBoard - copies an existing board
string - initializes a board from a string 
*/

type params = {rows: number, columns: number, oldBoard?: Board} | string;

export class Board {
    static BLANK = ' ';
    static BLACKOUT = '.';
    // the '!' is because typescript can't tell that the attributes are initialized in the constructor
    // due to splitting contruction into multiple functions. so annoying.
    private board!: string[][]
    rows!: number
    columns!: number

    constructor(params: params) {
        if (typeof params === "string") {
            this.constructFromString(params);
        } else {
            this.constructFromBoard(params.rows, params.columns, params.oldBoard);
        }
    }

    private constructFromBoard(rows: number, columns: number, oldBoard?: Board) {
        /* 
        construct a blank board
        if oldBoard is provided, copy its contents
        */
        this.rows = rows;
        this.columns = columns;
        this.board = [];
        for (let row = 0; row < rows; row++) {
            let newRow = [];
            for (let col = 0; col < columns; col++) {
                if (oldBoard && row < oldBoard.rows && col < oldBoard.columns) {
                    newRow.push(oldBoard.get(row, col));  
                } else {
                    newRow.push(Board.BLANK);
                }
            }
            this.board.push(newRow);
        }
    }

    private constructFromString(boardString: string) {
        this.board = [];
        const boardRows = boardString.split('\n').filter((row) => row !== '');
        this.rows = boardRows.length;
        this.columns = boardRows[0].length;
        for (let row = 0; row < this.rows; row++) {
            const rowStr = boardRows[row];
            let newRow = [];
            if (rowStr.length !== this.columns) {
                throw new Error(`row "${rowStr}" must be length ${this.rows}`);
            }
            for (let col = 0; col < this.columns; col++) {
                const char = boardRows[row][col]
                this.verifyChar(char);
                newRow.push(char);
            }
            this.board.push(newRow);
        }
    }

    private verifyChar(char: string) {
        /* assert that all characters are lowercase alphabetical */
        const pattern = /^[a-z]$/
        if (!pattern.test(char) && char !== Board.BLANK && char !== Board.BLACKOUT) {
            throw new Error(`char: "${char}" is invalid`);
        }
    }

    set(row: number, column: number, value: string): void {
        this.board[row][column] = value;
    }
    get(row: number, column: number): string {
        return this.board[row][column];
    }

    setCoord(coord: Coordinates, value: string): void {
        this.board[coord.row][coord.column] = value;
    }
    getCoord(coord: Coordinates): string {
        return this.board[coord.row][coord.column];
    }

    toString(): string {
        /* note: this is used to pass the contents of the board into the C++ board generator */
        let result = "";
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.columns; col++) {
                const char = this.get(row, col);
                if (char === Board.BLANK) {
                    result += '_';
                } else {
                    result += this.get(row, col);
                }
            }
            result += '\n';
        }
        return result;
    }

    mapWordCoords(direction: Direction): Map<string, string> {
        /* returns a map of the form:
            key: the STRING VERSION of the coordinates of the first letter in a word
            value: the full word as a string
        */

        let wordCoords = new Map();
        let currentCoord = new Coordinates(0, 0);
        let currentString = "";
        let reset = false;

        const primary = (direction === "across") ? this.rows : this.columns;
        const secondary = (direction === "across") ? this.columns : this.rows;
        for (let p = 0; p < primary; p++) {
            reset = true;
            for (let s = 0; s < secondary; s++) {
                let row = (direction === "across") ? p : s;
                let column = (direction === "across") ? s : p;
                if (reset) {
                    if (currentString.length > 2) {
                        wordCoords.set(currentCoord.toString(), currentString);
                    }
                    currentString = "";
                    currentCoord = new Coordinates(row, column);
                    reset = false;
                }
                let letter = this.get(row, column);
                if (letter === Board.BLACKOUT) {
                    reset = true;
                    continue;
                }
                currentString += letter;
            }
        }
        if (currentString.length > 2) {
            wordCoords.set(currentCoord.toString(), currentString);
        }
        return wordCoords;
    }

    getWordStart(coords: Coordinates, direction: Direction): Coordinates {
        /* 
        given a coordinate, return the coordinate of the first letter in that word 
        */
        let row = coords.row;
        let column = coords.column;
        if (this.getCoord(coords) === Board.BLACKOUT) {
            return Coordinates.NONE;
        }
        if (direction === "across") {
            while (column > 0 && this.get(row, column - 1) !== Board.BLACKOUT) {
                column--;
            }
        } else {
            while (row > 0 && this.get(row - 1, column) !== Board.BLACKOUT) {
                row--;
            }
        }
        // if the coordinate is not in the map of words, return the null coordinate
        // this can happen when with "words" that are length 1 or 2
        // because the board only recognizes words of length >= 3
        const startCoords = new Coordinates(row, column);
        if (this.mapWordCoords(direction).has(startCoords.toString())) {
            return new Coordinates(row, column);
        }
        return Coordinates.NONE;
    }
}
