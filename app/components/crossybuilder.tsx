'use client';
import {useState, useRef} from 'react';
import styles from '@/styles/Home.module.css';

import Board from "@/app/components/board";
import Clues from "@/app/components/clues";
import {BoardContext} from '@/app/components/boardcontext';
import {SelectionContext} from '@/app/components/selectioncontext';
import {dimensions, Coordinate, Selection, NO_SELECTION} from '@/app/components/types';

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
    const rows  = useRef<number>(5);
    const columns = useRef<number>(5);

    const defaultBoard = Array(rows.current).fill(Array(columns.current).fill(' '));
    const [board, setBoard] = useState<string[][]>(defaultBoard);

    const [selection, setSelection] = useState<Selection>({
        coordinate: NO_SELECTION,
        direction: "horizontal",
        focus: false
    });

    const dimensions: dimensions = {rows: rows.current, columns: columns.current}

    const acrossList = getAcrossList(board, dimensions);
    const downList = getDownList(board, dimensions);

    function changeBoardSize (newRows: number, newColumns: number): void {
        /* change the board's size */
        const oldRows = board.length;
        const oldColumns = board[0].length;
        let newBoard = [];
        for (let row = 0; row < newRows; row++) {
            let newRow = [];
            for (let col = 0; col < newColumns; col++) {
                if (row < oldRows && col < oldColumns) {
                    newRow.push(board[row][col]);  
                } else {
                    newRow.push(' ');
                }
            }
            newBoard.push(newRow);
        }
        rows.current = newRows;
        columns.current = newColumns;
        setBoard(newBoard);
    }
    
    return (
    <>
        {/* Row and Column sliders */}
        <input type="range" min="3" max="8" 
            value={rows.current} 
            onChange = {(e) => changeBoardSize(Number(e.target.value), columns.current)}
        />
        <input type="range" min="3" max="8" 
            value={columns.current} 
            onChange = {(e) => changeBoardSize(rows.current, Number(e.target.value))}
        />

        {/* Board + Question Lists */}
        <div className={styles.layout}>
            <SelectionContext.Provider value = {{selection, setSelection}}>
                <BoardContext.Provider value = {{board, setBoard}}>
                    <Board 
                    dimensions = {dimensions} 
                    acrossList = {acrossList}
                    downList = {downList} />
                </BoardContext.Provider>
                
                <Clues
                boardDimensions = {dimensions}
                acrossList = {acrossList} 
                downList = {downList}
                />
            </SelectionContext.Provider>
        </div>
    </>
    )
}