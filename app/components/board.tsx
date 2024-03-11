'use client';
import { useState, createContext } from 'react';
import Square, {BoardContext} from '@/app/components/square';

import {direction, coordinate, dimensions} from '@/app/components/types';

export default function Board({rows, columns} : dimensions) {
    const defaultBoard = Array(rows).fill(Array(columns).fill(' '));
    const [board, setBoard] = useState<string[][]>(defaultBoard);
    const [focus, setFocus] = useState<coordinate>(new coordinate(0, 0));
    const [focusDirection, setFocusDirection] = useState<direction>("horizontal");

    const boardArray = [];
    for (let row = 0; row < rows; row++){
        let rowArray = []
        for (let col = 0; col < columns; col++) {
            rowArray.push(
                <Square 
                key = {col}
                coords = {new coordinate(row, col)}
                boardDimensions = {{rows: rows, columns: columns}}
                focus = {focus}
                setFocus = {setFocus}
                focusDirection = {focusDirection}
                setFocusDirection = {setFocusDirection}
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
        <>
            <BoardContext.Provider value = {{board, setBoard}}>
                <div>
                    {boardArray}
                </div>
            </BoardContext.Provider>
        </>
    );
  }
  