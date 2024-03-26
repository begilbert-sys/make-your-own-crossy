import wordBank from "@/data/wordbank.json";

import { Coordinate } from "@/app/types/coordinate";
import { Board } from "@/app/types/board";

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

function binarySearchContains(binaryWordList: BinaryWord[], query: BinaryQuery) {
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
function shuffleArray(array: any[]) {
    /* randomly shuffle an array. return a copy of the shuffled array */
    const copyList = [...array];
    for (let max = copyList.length - 1; max >= 0; max--) {
        const randomIndex = Math.floor(Math.random() * (max + 1));
        const val = copyList[randomIndex];
        copyList[randomIndex] = copyList[max];
        copyList[max] = val;
    }
    return copyList;
}
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

function checkDownWords(board: Board, downList: Coordinate[]): boolean {
    /* iterate through the board's down words and ensure all are valid */
    for (let i = 0; i < downList.length; i++) {
        const startCoord = downList[i];
        const binaryQuery = queryToBinary(board.getWord(startCoord, "vertical"));
        const candidateList = sortedSplitBank[binaryQuery.query.length - 3];
        if (!binarySearchContains(candidateList, binaryQuery)) {
            return false;
        }
    }
    return true;
}


function recur(
board: Board,
acrossList: Coordinate[],
downList: Coordinate[],
acrossListIndex: number,
used: Set<string>
): boolean {
    console.log(used);
    if (acrossListIndex >= acrossList.length) {
        return true;
    }
    const startCoord: Coordinate = acrossList[acrossListIndex];
    const binaryQuery = queryToBinary(board.getWord(startCoord, "horizontal"));
    const candidateList = shuffledSplitBank[binaryQuery.query.length - 3];
    for (let i = 0; i < candidateList.length; i++) {
        const binaryWord = candidateList[i];
        if (matchesBinaryQuery(binaryWord, binaryQuery) && !used.has(binaryWord.word)) {
            used.add(binaryWord.word);
            board.setWord(startCoord, "horizontal", binaryWord.word);
            if (checkDownWords(board, downList) && recur(board, acrossList, downList, acrossListIndex + 1, used)) {
                return true;
            }
            used.delete(binaryWord.word);
        }
    }
    board.setWord(startCoord, "horizontal", binaryQuery.query);
    return false;
}

export default function autoFiller(board: Board) {
    const boardCopy = new Board(board.rows, board.columns, board);
    if (recur(boardCopy, board.getAcrossList(), board.getDownList(), 0, new Set<string>)) {
        return boardCopy;
    }
    console.log("failed");
    return board;
}