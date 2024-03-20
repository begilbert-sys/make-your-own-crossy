'use client';
import {useState, useRef} from 'react';
import styles from '@/styles/Home.module.css';

import Board from "@/app/components/crossyinput/board";
import DimensionSliders from "@/app/components/crossyinput/dimensionsliders";
import Clues from "@/app/components/crossyinput/clues";
import WordFinder from  "@/app/components/crossyinput/wordfinder";
import {BoardContext} from '@/app/components/crossyinput/boardcontext';
import {SelectionContext} from '@/app/components/crossyinput/selectioncontext';
import {dimensions, Coordinate, Selection, NO_SELECTION} from '@/app/components/crossyinput/types';

function getAcrossList(board: string[][], {rows, columns} : dimensions): Coordinate[] {
    /* Get a list of all coordinates that should be marked with a horizontal ("across") corner value */
    let acrossList = [];
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
            if (board[row][col] !== ' ' // space is not blank  
            && (col === 0 || board[row][col-1] === ' ')
            && (col + 2 < columns && board[row][col+1] != ' ' && board[row][col+2] != ' ')) {
                acrossList.push(new Coordinate(row, col));
            }
        }
    }
    return acrossList;
}

function getDownList(board: string[][], {rows, columns} : dimensions): Coordinate[] {
    /* Get a list of all coordinates that should be marked with a vertical ("down") corner value */
    let downList = [];
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
            if (board[row][col] != ' ' 
            && (row === 0 || board[row-1][col] === ' ')
            && (row + 2 < rows && board[row+1][col] != ' ' && board[row+2][col] != ' ')) {
                downList.push(new Coordinate(row, col));
            }
        }
    }
    return downList;
}

export default function CrossyBuilder() { 
    // board starts as 5x5 by default  
    const [boardDimensions, setBoardDimensions] = useState<dimensions>({rows: 5, columns: 5})

    const defaultBoard = Array(boardDimensions.rows).fill(Array(boardDimensions.columns).fill(' '));
    const [board, setBoard] = useState<string[][]>(defaultBoard);

    const [selection, setSelection] = useState<Selection>({
        coordinate: NO_SELECTION,
        direction: "horizontal",
        focus: false
    });

    const acrossList = getAcrossList(board, boardDimensions);
    const downList = getDownList(board, boardDimensions);

    function changeBoardSize (newRows: number, newColumns: number): void {
        /* change the board's size */
        let newBoard = [];
        for (let row = 0; row < newRows; row++) {
            let newRow = [];
            for (let col = 0; col < newColumns; col++) {
                if (row < boardDimensions.rows && col < boardDimensions.columns) {
                    newRow.push(board[row][col]);  
                } else {
                    newRow.push(' ');
                }
            }
            newBoard.push(newRow);
        }
        setBoardDimensions({rows: newRows, columns: newColumns});
        setBoard(newBoard);
    }

    const directionText = selection.direction === "horizontal" ? "Across →  " : "Down ↓ ";

    return (
    <>
        {/* Board + Question Lists */}
        <div className={styles.layout}>
        {/* Row and Column sliders */}
            <div>
            <DimensionSliders
                boardDimensions = {boardDimensions}
                changeBoardSize = {changeBoardSize}
            />
            <WordFinder />
            </div>
            <SelectionContext.Provider value = {{selection, setSelection}}>
                <BoardContext.Provider value = {{board, setBoard}}>
                    <Board 
                    dimensions = {boardDimensions} 
                    acrossList = {acrossList}
                    downList = {downList} />
                </BoardContext.Provider>
                
                <Clues
                boardDimensions = {boardDimensions}
                acrossList = {acrossList} 
                downList = {downList}
                />
            </SelectionContext.Provider>
        </div>
    </>
    )
}