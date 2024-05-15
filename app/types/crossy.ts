import { Coordinates } from '@/app/types/coordinates';

export type Direction = "across" | "down";


export interface CrossyJSON {
    title: string
    author: string
    boardString: string
    acrossClues: string[]
    downClues: string[]
}

export const defaultCrossyJSON: CrossyJSON = {
    title: "",
    author: "",
    boardString: "     \n     \n     \n     \n     ",
    acrossClues: ["", "", "", "", ""],
    downClues: ["", "", "", "", ""]
}

export class Crossy {
    static BLANK = ' ';
    static BLACKOUT = '.';

    rows: number
    columns: number
    private title: string
    private author: string
    private board: string[][]
    private acrossClues: string[]
    private downClues: string[]

    constructor(crossyJSON: CrossyJSON) {
        this.title = crossyJSON.title;
        this.author = crossyJSON.author;
        this.acrossClues = crossyJSON.acrossClues;
        this.downClues = crossyJSON.downClues;

        const rowStrings = crossyJSON.boardString.split('\n');
        this.rows = rowStrings.length;
        this.columns = rowStrings[0].length;
        this.board = [];
        for (let row = 0; row < this.rows; row++) {
            let newRow = [];
            for (let col = 0; col < this.columns; col++) {
                newRow.push(rowStrings[row][col]);
            }
            this.board.push(newRow);
        }
    }

    toJSON(): CrossyJSON {
        let boardString = "";
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.columns; col++) {
                boardString += this.get(row, col);
            }
            if (row !== this.rows - 1) {
                boardString += '\n'
            }
        }

        const newAcrossClues = [];
        for (let i = 0; i < this.getWordList("across").length; i++) {
            if (i > this.acrossClues.length) {
                newAcrossClues.push("");
            } else {
                newAcrossClues.push(this.acrossClues[i]);
            }
        }
        const newDownClues = [];
        for (let i = 0; i < this.getWordList("down").length; i++) {
            if (i > this.downClues.length) {
                newDownClues.push("");
            } else {
                newDownClues.push(this.downClues[i]);
            }
        }
        return ({
            title: this.title,
            author: this.author,
            boardString: boardString,
            acrossClues: newAcrossClues,
            downClues: newDownClues
        });
    }

    private verifyChar(char: string) {
        /* assert that all characters are lowercase alphabetical */
        const pattern = /^[a-z]$/
        if (!pattern.test(char) && char !== Crossy.BLANK && char !== Crossy.BLACKOUT) {
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

    setSize(rows: number, columns: number) {
        let newBoard = [];
        for (let row = 0; row < rows; row++) {
            let newRow = [];
            for (let col = 0; col < columns; col++) {
                if (row < this.rows - 1 && col < this.columns - 1) {
                    newRow.push(this.get(row, col))
                } else {
                    newRow.push(Crossy.BLANK);
                }
            }
            newBoard.push(newRow);
        }
        this.board = newBoard;
        this.rows = rows;
        this.columns = columns;
    }
    clear(): void {
        /*
        clear the board, except for blacked-out tiles 
        */
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.columns; col++) {
                if (this.get(row, col) !== Crossy.BLACKOUT) {
                    this.set(row, col, Crossy.BLANK);
                }
            }
        }
    }

    getCornerValueMap(): number[][] {
        /* 
        return a 2d array with the same dimensions as the board
        each coordinate is marked with its corner value, or -1 if it has none
        */ 
        let map = [];
        let cornerValue = 0;
        for (let row = 0; row < this.rows; row++) {
            let rowArray = [];
            for (let col = 0; col < this.columns; col++) {
                const coords = new Coordinates(row, col);
                if (this.getWordListIndex(coords, "across") !== -1 || this.getWordListIndex(coords, "down") !== -1) {
                    rowArray.push(++cornerValue);
                } else {
                    rowArray.push(-1);
                }
            }
            map.push(rowArray);
        }
        return map;
    }
    
    getWordList(direction: Direction): Coordinates[] {
        /* 
        return a list of all coordinates which begin a word in the specified direction 
        */
        let wordCoords = [];
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
                        wordCoords.push(currentCoord);
                    }
                    currentString = "";
                    currentCoord = new Coordinates(row, column);
                    reset = false;
                }
                let letter = this.get(row, column);
                if (letter === Crossy.BLACKOUT) {
                    reset = true;
                    continue;
                }
                currentString += letter;
            }
        }
        if (currentString.length > 2) {
            wordCoords.push(currentCoord);
        }
        return wordCoords;
    }

    getWordListIndex(coords: Coordinates, direction: Direction) {
        /* 
        return the index of a coordinate which begins a word in the specified direction, 
        or -1 otherwise
        */
        const wordList = this.getWordList(direction);
        for (let i = 0; i < wordList.length; i++) {
            if (coords.equals(wordList[i])) {
                return i;
            }
        }
        return -1;
    }

    getWordStart(coords: Coordinates, direction: Direction): Coordinates {
        /* 
        given a coordinate, return the coordinate of the first letter in that word 
        */
        let row = coords.row;
        let column = coords.column;
        if (this.getCoord(coords) === Crossy.BLACKOUT) {
            return Coordinates.NONE;
        }
        if (direction === "across") {
            while (column > 0 && this.get(row, column - 1) !== Crossy.BLACKOUT) {
                column--;
            }
        } else {
            while (row > 0 && this.get(row - 1, column) !== Crossy.BLACKOUT) {
                row--;
            }
        }
        // if the coordinate is not in the map of words, return the null coordinate
        // this can happen when with "words" that are length 1 or 2
        // because the board only recognizes words of length >= 3
        const startCoords = new Coordinates(row, column);
        if (this.getWordListIndex(startCoords, direction) !== -1) {
            return new Coordinates(row, column);
        }
        return Coordinates.NONE;
    }

    getWord(coords: Coordinates, direction: Direction): string | null {
        if (this.getWordListIndex(coords, direction) === -1) {
            return null;
        }
        let word = "";
        let currentCoords = coords;

        if (direction === "across") {
            while (currentCoords.column < this.columns) {
                const char = this.getCoord(currentCoords);
                if (char === Crossy.BLACKOUT) {
                    return word;
                }
                word += char;
                currentCoords = new Coordinates(currentCoords.row, currentCoords.column + 1);
            }
        } else {
            while (currentCoords.row < this.rows) {
                const char = this.getCoord(currentCoords);
                if (char === Crossy.BLACKOUT) {
                    return word;
                }
                word += char;
                currentCoords = new Coordinates(currentCoords.row + 1, currentCoords.column);
            }
        }
        return word;
    }
}