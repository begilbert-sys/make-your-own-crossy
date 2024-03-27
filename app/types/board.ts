import { Coordinate } from "@/app/types/coordinate";
import { Selection, Direction } from "@/app/types/selection";

export class Board {
    private board: string[][]
    rows: number
    columns: number

    constructor(rows: number, columns: number, oldBoard?: Board) {

        this.rows = rows;
        this.columns = columns;
        if (oldBoard) {
            this.board = [];
            for (let row = 0; row < rows; row++) {
                let newRow = [];
                for (let col = 0; col < columns; col++) {
                    if (row < oldBoard.rows && col < oldBoard.columns) {
                        newRow.push(oldBoard.get(row, col));  
                    } else {
                        newRow.push(' ');
                    }
                }
                this.board.push(newRow);
            }
        }
        else {
            this.board = [];
            for (let row = 0; row < rows; row++) {
                let newRow = [];
                for (let col = 0; col < columns; col++) {
                    newRow.push(' ');
                }
                this.board.push(newRow);
            }
        }
    }

    private verifyValue(value: string){
        const pattern = /^[a-z \.]$/
        return pattern.test(value);
    }

    set(row: number, column: number, value: string): void {
        if (!this.verifyValue(value)) {
            throw new Error("\"" + value + "\"is not a valid value");
        }
        this.board[row][column] = value;
    }
    setCoord(coord: Coordinate, value: string) {
        this.set(coord.row, coord.column, value);
    }
    get(row: number, column: number): string {
        return this.board[row][column];
    }
    getCoord(coord: Coordinate) {
        return this.get(coord.row, coord.column);
    }

    getAcrossList(): Coordinate[] {
        /* Get a list of all coordinates that should be marked with a horizontal ("across") corner value */
        let acrossList = [];
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.columns; col++) {
                if (this.board[row][col] !== '.' // space is not blank  
                && (col === 0 || this.board[row][col-1] === '.')
                && (col + 2 < this.columns && this.board[row][col+1] != '.' && this.board[row][col+2] != '.')) {
                    acrossList.push(new Coordinate(row, col));
                }
            }
        }
        return acrossList;
    }

    getDownList(): Coordinate[] {
        /* Get a list of all coordinates that should be marked with a vertical ("down") corner value */
        let downList = [];
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.columns; col++) {
                if (this.board[row][col] != '.' 
                && (row === 0 || this.board[row-1][col] === '.')
                && (row + 2 < this.rows && this.board[row+1][col] != '.' && this.board[row+2][col] != '.')) {
                    downList.push(new Coordinate(row, col));
                }
            }
        }
        return downList;
    }

    getWord(startCoord: Coordinate, direction: Direction): string {
        let result = "";
        let currentCoord = startCoord;
        while (true) {
            const char = this.getCoord(currentCoord);
            if (char === '.') {
                return result;
            }
            result += this.getCoord(currentCoord);
            if (direction === "horizontal") {
                if (currentCoord.column >= this.columns - 1) {
                    return result;
                }
                currentCoord = new Coordinate(currentCoord.row, currentCoord.column + 1);
            }
            else {
                if (currentCoord.row >= this.rows - 1) {
                    return result;
                }
                currentCoord = new Coordinate(currentCoord.row + 1, currentCoord.column);
            }
        }
    }

    setWord(startCoord: Coordinate, direction: Direction, word: string): void {
        let currentCoord = startCoord;
        for (let i = 0; i < word.length; i++) {
            if (this.getCoord(currentCoord) == '.') {
                throw new Error("word \"" + word + "\" does not fit at (" + startCoord.row + ", " + startCoord.column + ")");
            }
            this.setCoord(currentCoord, word[i]);
            if (direction === 'horizontal') {
                currentCoord = new Coordinate(currentCoord.row, currentCoord.column + 1);
            } else {
                currentCoord = new Coordinate(currentCoord.row + 1, currentCoord.column);
            }
        }
    }

    getSelectionWord(selection: Selection): Coordinate {
        /* Get the coordinate of the first letter of the selected word  */
        let wordList: Coordinate[] = (
            selection.direction === "horizontal" ? this.getAcrossList() : this.getDownList()
        ).reverse();

        if (wordList.length === 0) {
            return Coordinate.NONE;
        }
        let lastCoordinate = Coordinate.NONE
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.columns; col++) {
                const currentCoord = new Coordinate(row, col);
                if (wordList.length > 0 && currentCoord.equals(wordList.at(-1)!)) {
                    const popped = wordList.pop()!;
                    if (selection.direction === "horizontal" && selection.coordinate.row === row) {
                        lastCoordinate = popped;
                    }
                    else if (selection.direction === "vertical" && selection.coordinate.column === col) {
                        lastCoordinate = popped;
                    }
                }
                if (currentCoord.equals(selection.coordinate)) {
                    return lastCoordinate;
                }
            }
        }
        return Coordinate.NONE;
    }
}
