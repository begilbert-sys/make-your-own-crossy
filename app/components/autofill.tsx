import { useContext } from 'react';

import Button from '@mui/material/Button';

import { Board } from '@/app/types/board';
import { Coordinate } from '@/app/types/coordinate';
import { Direction } from '@/app/types/selection';

import { BoardContext, IBoardContext } from "@/app/contexts/boardcontext";

import wordBank from "@/data/wordbank.json";


function getWord(board: Board, currentCoord: Coordinate, direction: Direction): string {
    let result = "";
    while (true) {
        const currentChar = board.getCoord(currentCoord);
        if (currentChar === '.') {
            return result;
        }
        result += currentChar;
        if (direction === "horizontal") {
            if (currentCoord.column === board.columns - 1) {
                return result;
            }
            currentCoord = new Coordinate(currentCoord.row, currentCoord.column + 1);
        }
        else if (direction === "vertical") {
            if (currentCoord.row === board.rows - 1) {
                return result;
            }
            currentCoord = new Coordinate(currentCoord.row + 1, currentCoord.column);
        }
    }

}

function buildBoard(
    board: Board,
    acrossList: Coordinate[],
    downList: Coordinate[],
    acrossIndex: number,
    downIndex: number): boolean 
    {
    let startingCoord;
    let word;
    if (acrossIndex === -1) {
        startingCoord = downList[downIndex];
        word = getWord(board, startingCoord, "vertical");
    } else {
        startingCoord = acrossList[acrossIndex]
        word = getWord(board, startingCoord, "horizontal");
    }
    // set up a regexp to match the word
    let pattern = new RegExp("^" + word.replaceAll(" ", ".") + "$");
    const matches = wordBank.filter(bankWord => word.length == bankWord.length && pattern.test(bankWord));

    for (let match = 0; match < matches.length; match++) {
        const matchWord = matches[match];
        for (let i = 0; i < word.length; i++) {
            if (acrossIndex === -1) {
                board.set(startingCoord.row + i, startingCoord.column, matchWord[i]);
            } else {
                board.set(startingCoord.row, startingCoord.column + i, matchWord[i]);
            }
        }
        let result;
        if (acrossIndex === -1) {
            if (downIndex === downList.length - 1) {
                return true;
            }
            if (buildBoard(board, acrossList, downList, -1, downIndex + 1)) {
                return true;
            }
        } else {
            if (acrossIndex === acrossList.length - 1) {
                result = buildBoard(board, acrossList, downList, -1, 0);
            } else {
                result = buildBoard(board, acrossList, downList, acrossIndex + 1, -1);
            }
            if (result) {
                return true;
            }
        }
    }
    for (let i = 0; i < word.length; i++) {
        if (acrossIndex === -1) {
            board.set(startingCoord.row + i, startingCoord.column, word[i]);
        } else {
            board.set(startingCoord.row, startingCoord.column + i, word[i]);
        }
    }
    return false;
}
function fillBoard(board: Board): boolean {
    return buildBoard(board, board.getAcrossList(), board.getDownList(), 0, -1);
}

export default function AutoFill() {
    const {board, setBoard} = useContext<IBoardContext>(BoardContext);
    const handleClick = () => {
        const boardCopy = new Board(board.rows, board.columns, board);
        const result = fillBoard(boardCopy);
        if (result) {
            setBoard(boardCopy);
        }
    }
    return <Button variant="contained" onClick={handleClick}></Button>

}