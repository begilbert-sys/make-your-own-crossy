import { useContext } from 'react';

import Button from '@mui/material/Button';

import { Board } from '@/app/types/board';
import { Coordinate } from '@/app/types/coordinate';
import { Direction } from '@/app/types/selection';

import { BoardContext, IBoardContext } from "@/app/contexts/boardcontext";

import wordBank from "@/data/wordbank.json";

function shuffleArray(array: any[]) {
    const copyList = [...array];
    for (let max = copyList.length - 1; max >= 0; max--) {
        const randomIndex = Math.floor(Math.random() * (max + 1));
        const val = copyList[randomIndex];
        copyList[randomIndex] = copyList[max];
        copyList[max] = val;
    }
    return copyList;
}

var shuffledWordBank = shuffleArray(wordBank);
var lenWordBank: string[][] = [[], [], [], [], [], []];
for (let i = 0; i < shuffledWordBank.length; i++) {
    const word = shuffledWordBank[i];
    lenWordBank[word.length - 3].push(word);
}
var iters = 0;
function queryMatch(query: string, word: string): boolean {
    if (query.length != word.length) {
        return false;
    }
    for (let i = 0; i < query.length; i++) {
        if (query[i] !== ' ' && query[i] !== word[i]) {
            return false;
        }
    }
    return true;
}

function checkDownWords(board: Board, downList: Coordinate[]): boolean {
    for (let i = 0; i < downList.length; i++) {
        const startCoord = downList[i];
        const query = board.getWord(startCoord, "vertical");
        const candidateList = lenWordBank[query.length - 3];
        let valid = false;
        for (let j = 0; j < candidateList.length; j++) {
            iters++;
            const word = candidateList[j];
            if (queryMatch(query, word)) {
                valid = true;
                break;
            }
        }
        if (!valid) {
            return false;
        }
    }
    return true;
}
function recur(
    board: Board,
    setBoard: (b: Board) => void,
    acrossList: Coordinate[],
    downList: Coordinate[],
    acrossListIndex: number,
    used: string[]): boolean {
    console.log(used);
    if (acrossListIndex >= acrossList.length) {
        return true;
    }
    const startCoord = acrossList[acrossListIndex];
    const query = board.getWord(startCoord, "horizontal");
    const candidateList = lenWordBank[query.length - 3];
    for (let i = 0; i < candidateList.length; i++) {
        const word = candidateList[i];
        if (queryMatch(query, word) && !used.includes(word)) {
            board.setWord(startCoord, "horizontal", word);
            if (checkDownWords(board, downList) && recur(board, setBoard, acrossList, downList, acrossListIndex + 1, used.concat([word]))) {
                return true;
            }
        }
    }
    board.setWord(startCoord, "horizontal", query);
    return false;
}
export default function AutoFill() {
    const {board, setBoard} = useContext<IBoardContext>(BoardContext);
    const handleClick = () => {
        const boardCopy = new Board(board.rows, board.columns, board);
        console.log(boardCopy);
        if (recur(boardCopy, setBoard, board.getAcrossList(), board.getDownList(), 0, [])) {
            setBoard(boardCopy);
        } else {
            console.log("failed");
            console.log(iters);
        }
    }
    return <Button variant="contained" onClick={handleClick}></Button>

}