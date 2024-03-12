'use client';
import { useState, useContext } from 'react';
import Square from '@/app/components/square';

import {direction, coordinate, dimensions} from '@/app/components/types';
import {BoardContext, IBoardContext} from '@/app/components/boardcontext';

function getAcrossList(board: string[][], {rows, columns} : dimensions): coordinate[] {
    /* Get a list of all coordinates that should be marked with a horizontal ("across") corner value */
    let acrossList = [];
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
            if (board[row][col] !== ' ' && (col === 0 || board[row][col-1] === ' ')) {
                acrossList.push(new coordinate(row, col));
            }
        }
    }
    // array is reversed to make it equivalent to a stack 
    return acrossList.reverse();
}

export default function Board({rows, columns} : dimensions) {
    const {board, setBoard} = useContext<IBoardContext>(BoardContext);
    const [focus, setFocus] = useState<coordinate>(new coordinate(0, 0));
    const [focusDirection, setFocusDirection] = useState<direction>("horizontal");


    const acrossList = getAcrossList(board, {rows, columns});

    const boardArray = [];
    let cornerValue = 0;
    for (let row = 0; row < rows; row++){
        let rowArray = []
        for (let col = 0; col < columns; col++) {
            const coords = new coordinate(row, col);
            // get the cornerValue if applicable 
            let hasCornerValue = false;
            if (acrossList.length > 0 && coords.equals(acrossList[acrossList.length - 1])) {
                hasCornerValue = true;
                acrossList.pop();
                cornerValue++;
            }
            rowArray.push(
                <Square 
                key = {col}
                coords = {coords}
                boardDimensions = {{rows: rows, columns: columns}}
                focus = {focus}
                setFocus = {setFocus}
                focusDirection = {focusDirection}
                setFocusDirection = {setFocusDirection}
                cornerValue = {hasCornerValue ? cornerValue : undefined}
                />
            )
        }
        boardArray.push(
            <div key = {row} className="flex">
                {rowArray}
            </div>
        )
    }
    return (
        <div>
            {boardArray}
        </div>
    );
  }
  