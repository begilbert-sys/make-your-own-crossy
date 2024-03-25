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

function wordToBinary(word: string): number {
    const offset = 96;
    let num = 0;
    for (let i = 0; i < word.length; i++) {
        const letter = word[i];
        num <<= 5;
        if (letter !== ' ') {
            num |= letter.charCodeAt(0) - offset;
        }
    }
    return num;
}
function getQueryFilter(query: string) {
    const offset = 96;
    let num = 0;
    for (let i = 0; i < query.length; i++) {
        const letter = query[i];
        num <<= 5;
        if (letter !== ' ') {
            num |= 0b11111;
        }
    }
    return num;
}

var shuffledWordBank = shuffleArray(wordBank);
var lenWordBank: {word: string, bin: number}[][] = [[], [], [], [], [], []];
for (let i = 0; i < shuffledWordBank.length; i++) {
    const word = shuffledWordBank[i];
    lenWordBank[word.length - 3].push({word: word, bin: wordToBinary(word)});
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
function queryMatchBinary(queryBin: number, queryFilterBin: number, wordBin: number): boolean {
    return (wordBin & queryFilterBin) === queryBin;
}

function checkDownWords(board: Board, downList: Coordinate[]): boolean {
    for (let i = 0; i < downList.length; i++) {
        const startCoord = downList[i];
        const query = board.getWord(startCoord, "vertical");
        const queryBin = wordToBinary(query);
        const queryFilterBin = getQueryFilter(query);
        const candidateList = lenWordBank[query.length - 3];
        let valid = false;
        for (let j = 0; j < candidateList.length; j++) {
            iters++;
            const word = candidateList[j];
            if (queryMatchBinary(queryBin, queryFilterBin, word.bin)) {
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
    const queryBin = wordToBinary(query);
    const queryFilterBin = getQueryFilter(query);
    for (let i = 0; i < candidateList.length; i++) {
        const word = candidateList[i];
        if (queryMatchBinary(queryBin, queryFilterBin, word.bin) && !used.includes(word.word)) {
            board.setWord(startCoord, "horizontal", word.word);
            if (checkDownWords(board, downList) && recur(board, setBoard, acrossList, downList, acrossListIndex + 1, used.concat([word.word]))) {
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