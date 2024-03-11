import { KeyboardEvent, useState, useRef, createContext, useContext } from 'react';
import styles from '@/styles/Home.module.css';
import clsx from 'clsx';

import {IBoardContext, direction, coordinate, dimensions} from '@/app/components/types';


export const BoardContext = createContext<IBoardContext>({board: [[]], setBoard: (s: string[][]) => {}});

interface ISquareProps {
    coords: coordinate,
    boardDimensions: dimensions,
    focus: coordinate,
    setFocus: (f: coordinate) => void,
    focusDirection: direction
    setFocusDirection: (d: direction) => void
    cornerValue?: number,
}

function isHighlighted(coords: coordinate, focus: coordinate, focusDirection: direction): boolean {
    return focusDirection === "horizontal" ? coords.row === focus.row : coords.column === focus.column;
}

function getNextSquare(coords: coordinate, boardDimensions: dimensions, focus: coordinate, focusDirection: direction): coordinate {
    // don't go anywhere if it's the last square on the board 
    if (coords.row === boardDimensions.rows - 1 && coords.column === boardDimensions.columns - 1) {
        return coords;
    }
    if (focusDirection === "horizontal") {
        return coords.column === boardDimensions.columns - 1 ? new coordinate(coords.row + 1, 0) : new coordinate(coords.row, coords.column + 1);
    } else {
        return coords.row === boardDimensions.rows - 1 ? new coordinate(0, coords.column + 1) : new coordinate(coords.row + 1, coords.column);
    }
}

function prevSquare(props: ISquareProps): coordinate {
    return props.coords;
}

export default function Square({coords, boardDimensions, focus, setFocus, focusDirection, setFocusDirection} : ISquareProps) {
    const {board, setBoard} = useContext<IBoardContext>(BoardContext);
    
    const char = board[coords.row][coords.column];
    const setChar = (newChar: string) => {
        var newBoard = board.map(arr => [...arr]);
        newBoard[coords.row][coords.column] = newChar;
        setBoard(newBoard);
    };

    const inputRef = useRef<HTMLInputElement>(null);
    if (inputRef.current != null && coords.equals(focus)) {
        inputRef.current.focus();
    }

    const classList = clsx(
        styles.square,
        {"bg-square-lightblue": !coords.equals(focus) && isHighlighted(coords, focus, focusDirection)},
        {"bg-black": char === ' '},
        {"bg-square-yellow": coords.equals(focus)}
    );

    const handleKeyPress = (e: KeyboardEvent) => {
        if (e.key.length === 1 && e.key.match(/[a-zA-Z]/)) {
            setChar(e.key);
            setFocus(getNextSquare(coords, boardDimensions, focus, focusDirection));
        }
        else if (e.key === "Backspace") {
            setChar(' ');
            setFocus(coords);
        }
    }
    const handleClick = () => {
        if (focus.equals(coords)) {
            setFocusDirection(focusDirection === "horizontal" ? "vertical" : "horizontal");
        }
        setFocus(coords);
    }
    return (
    <input 
        ref = {inputRef}
        type = "text"
        value = {char}
        maxLength = {1}
        className = {classList} 
        onKeyDown = {handleKeyPress}
        onClick = {handleClick}
        onChange = {(e) => {}} // onChange is required but it does nothing
    />
    )
}