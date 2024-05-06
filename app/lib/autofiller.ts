import wordBank from "@/data/wordbank.json";

import { Coordinate } from "@/app/types/coordinate";
import { Board } from "@/app/types/board";
import { Direction } from "@/app/types/selection";

import { shuffleArray } from "@/app/lib/shuffle";

var iter = 0;
/*
=============================
BINARY-FILTER UTILITY FUNCTIONS 
=============================
*/

type BinaryWord = {
    word: string
    value: number
}
type BinaryQuery = {
    query: string
    value: number
    filter: number
}

function wordToBinary(word: string): BinaryWord {
    /* convert a word to a BinaryWord object containing its binary value */
    const ordinalOffset = 96; // this is the char before 'a'
    let num = 0;
    for (let i = 0; i < word.length; i++) {
        const letter = word[i];
        num <<= 5;
        num |= letter.charCodeAt(0) - ordinalOffset;
    }
    return {word: word, value: num};
}

function queryToBinary(query: string): BinaryQuery {
    /* convert a query to a BinaryQuery object containing its binary value AND filter value */
    const ordinalOffset = 96;
    let num = 0;
    let filter = 0;
    for (let i = 0; i < query.length; i++) {
        const letter = query[i];
        num <<= 5;
        filter <<= 5;
        if (letter !== ' ') {
            num |= letter.charCodeAt(0) - ordinalOffset;
            filter |= 0b11111;
        }
    }
    return {query: query, value: num, filter: filter};
}

function matchesBinaryQuery(word: BinaryWord, query: BinaryQuery): boolean {
    /* return whether or not the BinaryWord matches the BinaryQuery */
    return (word.value & query.filter) === query.value;
}

function binarySearchContains(binaryWordList: BinaryWord[], query: BinaryQuery): boolean {
    iter++;
    /* return whether or not the list contains a word matching the query
    implements the standard binary search algorithm */
    let low = 0;
    let high = binaryWordList.length - 1;
    let mid;
    while (low <= high) {
        mid = Math.floor((low + high) / 2);
        const filteredBinaryWord = binaryWordList[mid].value & query.filter;
        if (filteredBinaryWord > query.value) {
            high = mid - 1;
        }
        else if (filteredBinaryWord < query.value) {
            low = mid + 1;
        }
        else {
            return true;
        }
    }
    return false;
}


/*
=============================
WORD BANK PREP
=============================
*/
// a shuffled version of the word bank
var shuffledWordBank = shuffleArray(wordBank);

// sorted
var sortedWordBank = wordBank.sort();

// a shuffled version of the word bank, split into arrays by length 
var shuffledSplitBank: BinaryWord[][] = [[], [], [], [], [], []];

// sorted version split the same way
var sortedSplitBank: BinaryWord[][] = [[], [], [], [], [], []];

// fill em up
for (let i = 0; i < wordBank.length; i++) {
    const shuffleWord = shuffledWordBank[i];
    const sortedWord = sortedWordBank[i];
    shuffledSplitBank[shuffleWord.length - 3].push(wordToBinary(shuffleWord));
    sortedSplitBank[sortedWord.length - 3].push(wordToBinary(sortedWord));
}

/*
=============================
ALGORITHM
=============================
*/

function checkWords(board: Board, wordList: Coordinate[], direction: Direction): boolean {
    /* iterate through the board's down words and ensure all are valid */
    for (let i = 0; i < wordList.length; i++) {
        const startCoord = wordList[i];
        const binaryQuery = queryToBinary(board.getWord(startCoord, direction));
        const candidateList = sortedSplitBank[binaryQuery.query.length - 3];
        if (!binarySearchContains(candidateList, binaryQuery)) {
            return false;
        }
    }
    return true;
}

var alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];

function nextSquare(board: Board, coord: Coordinate): Coordinate {
    if (coord.column === board.columns - 1) {
        return new Coordinate(coord.row + 1, 0);
    }
    return new Coordinate(coord.row, coord.column + 1);
}
function recur(
board: Board,
acrossList: Coordinate[],
acrossIndices: number[][],
downList: Coordinate[],
downIndices: number[][],
coord: Coordinate
): boolean {
    //console.log(coord);
    let final = (coord.row === board.rows - 1 && coord.column === board.columns - 1);
    const currentSquare = board.getCoord(coord);
    if (currentSquare !== ' ') {
        if (final) {
            return true;
        }
        return recur(board, acrossList, acrossIndices, downList, downIndices, nextSquare(board, coord));
    }
    const letterOffset = Math.floor(Math.random() * 26);
    for (let i = 0; i < 26; i++) {
        board.setCoord(coord, alphabet.at(i - letterOffset)!);
        if (checkWords(board, [acrossList[acrossIndices[coord.row][coord.column]]], "horizontal") && checkWords(board, [downList[downIndices[coord.row][coord.column]]], "vertical")) {
            if (final || recur(board, acrossList, acrossIndices, downList, downIndices, nextSquare(board, coord))) {
                return true;
            }
        }
    }
    board.setCoord(coord, ' ');
    return false;
}

export default function autoFiller(board: Board) {
    const startTime = new Date().getTime();
    const boardCopy = new Board({rows: board.rows, columns: board.columns, oldBoard: board});
    if (recur(boardCopy, board.getAcrossList(), board.mapAcrossIndices(), board.getDownList(), board.mapDownIndices(),new Coordinate(0, 0))) {
        const endTime = new Date().getTime();
        const executionTime: number = endTime - startTime;
        console.log(`Function hit ${iter/executionTime} iters per second`)
        return boardCopy;
    }
    console.log("failed");
    return board;
}