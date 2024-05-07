import { Coordinate } from "@/app/types/coordinate";
import { Selection, Direction } from "@/app/types/selection";

/* 
contains all of the characters on the board 
auto-generated characters are suffixed with a "!"
*/ 

/* 
Three paramater options for constructor a Board: 
rows, columns - constructs a blank board of the specified size 
rows, columns, oldBoard - copies an existing board
string - initializes a board from a string 
*/
type params = {rows: number, columns: number, oldBoard?: Board} | string;

export class Board {
    private board: string[][]
    rows: number
    columns: number

    constructor(params: params) {
        if (typeof params === "string") {
            this.board = [];
            const boardRows = params.split('\n');
            this.rows = boardRows.length;
            this.columns = boardRows[0].length;
            for (let row = 0; row < this.rows; row++) {
                const rowStr = boardRows[row];
                let newRow = [];
                if (rowStr.length !== this.rows) {
                    throw new Error(`row "${rowStr}" must be length ${this.rows}`);
                }
                for (let col = 0; col < this.columns; col++) {
                    const char = boardRows[row][col]
                    this.verifyChar(char);
                    newRow.push(char);
                }
                this.board.push(newRow);
            }
        } else {
            const {rows, columns, oldBoard} = params;
            this.rows = rows;
            this.columns = columns;
            this.board = [];
            for (let row = 0; row < rows; row++) {
                let newRow = [];
                for (let col = 0; col < columns; col++) {
                    if (oldBoard && row < oldBoard.rows && col < oldBoard.columns) {
                        newRow.push(oldBoard.get(row, col));  
                    } else {
                        newRow.push(' ');
                    }
                }
                this.board.push(newRow);
            }
        }
    }

    private verifyChar(char: string) {
        const pattern = /^[a-z \.]$/
        if (!pattern.test(char)) {
            throw new Error(`char: "${char}" is invalid`);
        }
    }

    set(row: number, column: number, value: string): void {
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

    toString(): string {
        let result = "";
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.columns; col++) {
                result += this.get(row, col);
            }
            result += '\n';
        }
        return result;
    }

    getAcrossList(): Coordinate[] {
        /* Get a list of all coordinates that should be marked with a horizontal ("across") corner value */
        let acrossList = [];
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.columns; col++) {
                if (this.board[row][col] !== '.' // space is not blank  
                && (col === 0 || this.board[row][col-1] === '.')
                && (col + 2 < this.columns && this.board[row][col+1] !== '.' && this.board[row][col+2] !== '.')) {
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
        // this method needs to be optimized so it uses numbers instead of Coordinate objects 
        let currentRow = startCoord.row;
        let currentColumn = startCoord.column;
        while (true) {
            const char = this.get(currentRow, currentColumn)[0];
            if (char === '.') {
                return result;
            }
            result += char;
            if (direction === "horizontal") {
                if (currentColumn >= this.columns - 1) {
                    return result;
                }
                currentColumn++;
            }
            else {
                if (currentRow >= this.rows - 1) {
                    return result;
                }
                currentRow++;
            }
        }
    }

    setWord(startCoord: Coordinate, direction: Direction, word: string): void {
        let currentRow = startCoord.row;
        let currentColumn = startCoord.column;
        for (let i = 0; i < word.length; i++) {
            if (this.get(currentRow, currentColumn) == '.') {
                throw new Error("word \"" + word + "\" does not fit at (" + startCoord.row + ", " + startCoord.column + ")");
            }
            this.set(currentRow, currentColumn, word[i]);
            if (direction === 'horizontal') {
                currentColumn++;
            } else {
                currentRow++;
            }
        }
    }
    setAutofillWord(startCoord: Coordinate, direction: Direction, word: string): void {
        let currentRow = startCoord.row;
        let currentColumn = startCoord.column;
        for (let i = 0; i < word.length; i++) {
            const currentSquare = this.get(currentRow, currentColumn);
            if (currentSquare == '.') {
                throw new Error("word \"" + word + "\" does not fit at (" + startCoord.row + ", " + startCoord.column + ")");
            }
            else if (currentSquare.length == 1 && currentSquare != ' ') {
                continue;
            }
            this.set(currentRow, currentColumn, word[i] + '!');
            if (direction === 'horizontal') {
                currentColumn++;
            } else {
                currentRow++;
            }
        }
    }

    clearAutofill(): void {
        console.log("entered clearautofill");
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.columns; col++) {
                const char = this.get(row, col);
                if (char.length == 2) {
                    this.set(row, col, ' ');
                }
            }
        }
    }

    acceptAutofill(): void {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.columns; col++) {
                const char = this.get(row, col);
                if (char.length == 2) {
                    this.set(row, col, char[0]);
                }
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

    mapAcrossIndices(): number[][] {
        let reverseAcrossList = this.getAcrossList().reverse();
        let result = [];
        let currentIndex = -1;
        for (let row = 0; row < this.rows; row++) {
            let indexRow = [];
            for (let col = 0; col < this.columns; col++) {
                const coord = new Coordinate(row, col);
                if (this.getCoord(coord) === '.') {
                    indexRow.push(-1);
                    continue;
                }
                if (reverseAcrossList.length > 0 && coord.equals(reverseAcrossList.at(-1)!)) {
                    reverseAcrossList.pop();
                    currentIndex++;
                }
                indexRow.push(currentIndex);
            }
            result.push(indexRow);
        }
        return result;
    }
    mapDownIndices(): number[][] {
        let downList = this.getDownList();
        let result = [...Array(this.rows)].map(() => Array(this.columns).fill(-1));
        for (let i = 0; i < downList.length; i++) {
            let currentRow = downList[i].row;
            const column = downList[i].column;
            while (currentRow < this.rows && this.get(currentRow, column) !== '.') {
                result[currentRow++][column] = i;
            }
        }
        return result;
    }
}
