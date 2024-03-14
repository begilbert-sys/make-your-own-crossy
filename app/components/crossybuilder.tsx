'use client';
import {useState} from 'react';
import styles from '@/styles/Home.module.css';

import Board from "@/app/components/board";
import Questions from "@/app/components/questions";
import {BoardContext, IBoardContext} from '@/app/components/boardcontext';
import {direction, coordinate, dimensions} from '@/app/components/types';

function getAcrossList(board: string[][], {rows, columns} : dimensions): coordinate[] {
    /* Get a list of all coordinates that should be marked with a horizontal ("across") corner value */
    let acrossList = [];
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
            if (board[row][col] !== ' ' // space is not blank  
            && (col === 0 || board[row][col-1] === ' ')
            && (col + 2 < columns && board[row][col+1] != ' ' && board[row][col+2] != ' ')) {
                acrossList.push(new coordinate(row, col));
            }
        }
    }
    return acrossList;
}

function getDownList(board: string[][], {rows, columns} : dimensions): coordinate[] {
    let downList = [];
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
            if (board[row][col] != ' ' 
            && (row === 0 || board[row-1][col] === ' ')
            && (row + 2 < rows && board[row+1][col] != ' ' && board[row+2][col] != ' ')) {
                downList.push(new coordinate(row, col));
            }
        }
    }
    return downList;
}
export default function CrossyBuilder() {
    const defaultBoard = Array(5).fill(Array(5).fill(' '));
    const [board, setBoard] = useState<string[][]>(defaultBoard);
    const dimensions: dimensions = {rows: 5, columns: 5}
    const acrossList = getAcrossList(board, dimensions);
    const downList = getDownList(board, dimensions);
    return (
    <div className={styles.layout}>
        <BoardContext.Provider value = {{board, setBoard}}>
            <Board 
            dimensions={{rows:5, columns:5}} 
            acrossList = {acrossList}
            downList = {downList} />
        </BoardContext.Provider>
        
        <Questions title = "ACROSS" itemCount = {acrossList.length} />
        <Questions title = "DOWN" itemCount = {downList.length} />
    </div>
    )
}