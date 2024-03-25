import { useContext } from 'react';

import Button from '@mui/material/Button';

import { Board } from '@/app/types/board';
import { Coordinate } from '@/app/types/coordinate';
import { Direction } from '@/app/types/selection';

import { BoardContext, IBoardContext } from "@/app/contexts/boardcontext";

import wordBank from "@/data/wordbank.json";
import { BookmarkAddSharp } from '@mui/icons-material';

const alphabet = 'abcdefghijklmnopqrstuvwxyz';


interface wordInfo {
    acrossListIndex: number | null,
    acrossWordIndex: number | null,
    downListIndex: number | null,
    downWordIndex: number | null
}
function generateCandidateSet(): Set<number> {
    let newSet = new Set<number>();
    for (let i = 0; i < wordBank.length; i++) {
        newSet.add(i);
    }
    return newSet;
}
function generateWordBoard(board: Board, revAcrossList: Coordinate[], revDownList: Coordinate[]) : wordInfo[][]{
    let numberBoard = [];
    for (let row = 0; row < board.rows; row++) {
        let numberRow = [];
        for (let col = 0; col < board.columns; col++) {
            numberRow.push({
                acrossListIndex: null, 
                acrossWordIndex: null,
                downListIndex: null,
                downWordIndex: null
            } as wordInfo);
        }
        numberBoard.push(numberRow);
    }
    let currentAcrossIndex = -1;
    let currentAcrossWordIndex = 0;
    for (let row = 0; row < board.rows; row++) {
        for (let col = 0; col < board.columns; col++) {
            const coord = new Coordinate(row, col);
            if (board.getCoord(coord) === '.') {
                continue;
            }
            if (revAcrossList.length > 0 && coord.equals(revAcrossList.at(-1)!)) {
                numberBoard[row][col].acrossListIndex = ++currentAcrossIndex;
                currentAcrossWordIndex = 0;
                numberBoard[row][col].acrossWordIndex = currentAcrossWordIndex;
                revAcrossList.pop();
            } else {
                numberBoard[row][col].acrossListIndex = currentAcrossIndex;
                numberBoard[row][col].acrossWordIndex = ++currentAcrossWordIndex;
            }
        }
    }
    let currentDownIndex = -1;
    let currentDownWordIndex = 0;
    for (let col = 0; col < board.columns; col++) {
        for (let row = 0; row < board.rows; row++) {
            const coord = new Coordinate(row, col);
            if (board.getCoord(coord) === '.') {
                continue;
            }
            if (revDownList.length > 0 && coord.equals(revDownList.at(-1)!)) {
                numberBoard[row][col].downListIndex = ++currentDownIndex;
                currentDownWordIndex = 0;
                numberBoard[row][col].downWordIndex = currentDownWordIndex;
                revDownList.pop();
            } else {
                numberBoard[row][col].downListIndex = currentDownIndex;
                numberBoard[row][col].downWordIndex = ++currentDownWordIndex;
            }
        }
    }
    return numberBoard;
}

function recur(
    board: Board, 
    setBoard: (b: Board) => void,
    wordInfoBoard: wordInfo[][], 
    acrossListCandidates: Set<number>[],
    downListCandidates: Set<number>[],
    row: number,
    column: number): boolean {
    let lastTile = row === board.rows - 1 && column === board.columns - 1;
    const nextColumn = column === board.columns - 1 ? 0 : column + 1;
    const nextRow = column === board.columns - 1 ? row + 1 : row;
    if (board.get(row, column) === '.') {
        if (lastTile) {
            return true;
        } else {
            return recur(board, setBoard, wordInfoBoard, acrossListCandidates, downListCandidates, nextRow, nextColumn);
        }
    }
    const {acrossListIndex, acrossWordIndex, downListIndex, downWordIndex} = wordInfoBoard[row][column];
    // duplicate set of across candidates 
    let originalAcrossCandidates: Set<number> = new Set<number>();
    if (acrossListIndex != null) {
        originalAcrossCandidates = new Set<number>(acrossListCandidates[acrossListIndex]);
    }

    // duplicate set of down candidates
    let originalDownCandidates: Set<number> = new Set<number>();
    if (downListIndex != null) {
        originalDownCandidates = new Set<number>(downListCandidates[downListIndex]);
    }
    for (let letterIndex = 0; letterIndex < 26; letterIndex++) {
        const letter = alphabet[letterIndex];
        // across
        let newAcrossCandidates = new Set<number>();
        if (acrossListIndex != null) {
            originalAcrossCandidates.forEach((index) => {
                const word = wordBank[index];
                if (word.length > acrossWordIndex! && word[acrossWordIndex!] === letter) {
                    newAcrossCandidates.add(index);
                }
            });
            acrossListCandidates[acrossListIndex!] = newAcrossCandidates;
        }
        let newDownCandidates = new Set<number>();
        // down
        if (downListIndex != null) {
            originalDownCandidates.forEach((index) => {
                const word = wordBank[index];
                if (word.length > downWordIndex! && word[downWordIndex!] === letter) {
                    newDownCandidates.add(index);
                }
            });
            downListCandidates[downListIndex!] = newDownCandidates;
        }
        // console.log("function no. ", row, column, "\nletter: ", letter, 
        // "\n", acrossListIndex, acrossWordIndex, Array.from(newAcrossCandidates).map((i: number) => wordBank[i]),
        // Array.from(originalAcrossCandidates).map((i: number) => wordBank[i]),
        // "\n", downListIndex, downWordIndex, Array.from(newDownCandidates).map((i: number) => wordBank[i]),
        // Array.from(originalDownCandidates).map((i: number) => wordBank[i]), 
        // "\n---", board);
        if (newAcrossCandidates.size > 0 && newDownCandidates.size > 0) {
            board.set(row, column, letter);
            if (lastTile) {
                return true;
            } else if (recur(board, setBoard, wordInfoBoard, acrossListCandidates, downListCandidates, nextRow, nextColumn)) {
                return true;
            }
        }
    }
    if (acrossListIndex != null) {
        acrossListCandidates[acrossListIndex] = originalAcrossCandidates;
    }
    if (downListIndex != null) {
        downListCandidates[downListIndex!] = originalDownCandidates;
    }
    board.set(row, column, ' ');
    return false;

}
export default function AutoFill() {
    const {board, setBoard} = useContext<IBoardContext>(BoardContext);
    const acrossList = board.getAcrossList();
    const downList = board.getDownList();
    const wordInfoBoard: wordInfo[][] = generateWordBoard(board, board.getAcrossList().reverse(), board.getDownList().reverse());
    const acrossCandidates: Set<number>[] = [];
    for (let i = 0; i < acrossList.length; i++) {
        acrossCandidates.push(generateCandidateSet());
    }
    const downCandidates: Set<number>[] = [];
    for (let i = 0; i < downList.length; i++) {
        downCandidates.push(generateCandidateSet());
    }
    const handleClick = () => {
        const boardCopy = new Board(board.rows, board.columns, board);
        console.log(recur(board, setBoard, wordInfoBoard, acrossCandidates, downCandidates, 0, 0));
        setBoard(board);

    }
    return <Button variant="contained" onClick={handleClick}></Button>

}