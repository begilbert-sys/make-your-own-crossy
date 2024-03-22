import {useContext} from 'react';
import {BoardContext, IBoardContext} from "@/app/components/crossyinput/boardcontext";
import wordBank from "@/data/wordbank.json";


function getWord(board: string[][], {rows, columns}: dimensions, currentCoord: Coordinate, direction: direction): string {
    let result = "";
    while (true) {
        const currentChar = board[currentCoord.row][currentCoord.column];
        if (currentChar == '.') {
            return result;
        }
        result += currentChar;
        if (direction === "horizontal") {
            if (currentCoord.column === columns - 1) {
                return result;
            }
            currentCoord = new Coordinate(currentCoord.row, currentCoord.column + 1);
        }
        else if (direction === "vertical") {
            if (currentCoord.row === rows - 1) {
                return result;
            }
            currentCoord = new Coordinate(currentCoord.row + 1, currentCoord.column);
        }
    }
}

function wordMatch(prompt: string, word: string): boolean {
    if (prompt.length != word.length) {
        return false;
    }
    for (let i = 0; i < prompt.length; i++) {
        if (prompt[i] !== ' ' && prompt[i] !== word[i]) {
            return false;
        }
    }
    return true;
}

function buildBoard(
    board: string[][], 
    boardDimensions: dimensions,
    acrossList: Coordinate[], 
    downList: Coordinate[], 
    acrossIndex: number,
    downIndex: number): boolean 
    {
    const startingCoord = acrossList[acrossIndex];
    let word;
    if (acrossIndex === -1) {
        word = getWord(board, boardDimensions, startingCoord, "vertical");
    } else {
        word = getWord(board, boardDimensions, startingCoord, "horizontal");
    }
    const matches = wordBank.filter((word) => wordMatch(word.toLowerCase(), word));
    for (let match = 0; match < matches.length; match++) {
        const matchWord = matches[match];
        for (let i = 0; i < word.length; i++) {
            board[startingCoord.row][startingCoord.column + i] = matchWord[i];
        }
        let result;
        if (acrossIndex === -1) {
            if (downIndex === downList.length - 1) {
                return true;
            }
            if (buildBoard(board, boardDimensions, acrossList, downList, -1, downIndex + 1)) {
                return true;
            }
        } else {
            if (acrossIndex === acrossList.length - 1) {
                result = buildBoard(board, boardDimensions, acrossList, downList, -1, 0);
            } else {
                result = buildBoard(board, boardDimensions, acrossList, downList, acrossIndex + 1, -1);
            }
            if (result) {
                return true;
            }
        }
    }
    return false;
}
function fillBoard(board:string[][], boardDimensions: dimensions, acrossList: Coordinate[], downList: Coordinate[]): string[][] {
    const boardCopy =  board.map(function(arr) {
        return [...arr];
    });
    const result = buildBoard(board, boardDimensions, acrossList, downList, 0, -1);

}

interface IAutoFillProps {
    boardDimensions: dimensions,
    acrossList: Coordinate[],
    downList: Coordinate[]
}
export default function AutoFill() {
    const {board, setBoard} = useContext<IBoardContext>(BoardContext);

}