import { KeyboardEvent, useState, useRef, createContext, useContext } from 'react';
import styles from '@/styles/Home.module.css';
import clsx from 'clsx';

import {dimensions, Selection, Coordinate} from '@/app/components/crossyinput/types';
import {SelectionContext, ISelectionContext} from '@/app/components/crossyinput/selectioncontext';
import {BoardContext, IBoardContext} from '@/app/components/crossyinput/boardcontext';

function getBoardSize({rows, columns} : dimensions) {
    /* returns some tailwind based on the board's dimensions */
    return rows > columns ? rows : columns;
}

function getNextSquare(coords: Coordinate, boardDimensions: dimensions, selection: Selection): Coordinate {
    const focusDirection = selection.direction;
    // don't go anywhere if it's the last square on the board 
    if (coords.row === boardDimensions.rows - 1 && coords.column === boardDimensions.columns - 1) {
        return coords;
    }
    if (focusDirection === "horizontal") {
        return coords.column === boardDimensions.columns - 1 ? new Coordinate(coords.row + 1, 0) : new Coordinate(coords.row, coords.column + 1);
    } else {
        return coords.row === boardDimensions.rows - 1 ? new Coordinate(0, coords.column + 1) : new Coordinate(coords.row + 1, coords.column);
    }
}
function getPrevSquare(coords: Coordinate, boardDimensions: dimensions, selection: Selection): Coordinate {
    const focusDirection = selection.direction;
    // don't go anywhere if it's the last square on the board 
    if (coords.row === 0 && coords.column === 0) {
        return coords;
    }
    if (focusDirection === "horizontal") {
        return coords.column === 0 ? new Coordinate(coords.row - 1, boardDimensions.columns - 1) : new Coordinate(coords.row, coords.column - 1);
    } else {
        return coords.row === 0 ? new Coordinate(boardDimensions.rows - 1, coords.column - 1) : new Coordinate(coords.row - 1, coords.column);
    }
}

interface ISquareProps {
    coords: Coordinate,
    boardDimensions: dimensions,
    highlighted: boolean,
    nextWord?: Coordinate,
    cornerValue?: number,
}
export default function Square({coords, boardDimensions, highlighted, nextWord, cornerValue} : ISquareProps) {
    const {selection, setSelection} = useContext<ISelectionContext>(SelectionContext);
    const {board, setBoard} = useContext<IBoardContext>(BoardContext);
    const char = board[coords.row][coords.column];
    const setChar = (newChar: string) => {
        var newBoard = board.map(arr => [...arr]);
        newBoard[coords.row][coords.column] = newChar;
        setBoard(newBoard);
    };

    const inputRef = useRef<HTMLInputElement>(null);
    if (inputRef.current != null && selection.focus && coords.equals(selection.coordinate)) {
        inputRef.current.focus();
    }

    const classList = clsx(
        styles.square,
        {[styles.highlighted]: highlighted},
        {[styles.blank]: char === ' '},
        {[styles.selected]: coords.equals(selection.coordinate) && selection.focus} 
    );

    const handleKeyPress = (e: KeyboardEvent) => {
        /* handle different keypresses */
        let modifiedSelection = { ...selection};
        switch (e.key) {
            case "Backspace":
                /* delete square value and move one square back */
                setChar(' ');
                modifiedSelection.coordinate = getPrevSquare(coords, boardDimensions, selection);
                break;

            case "Enter":
                /* jump to the next word */
                if (nextWord) {
                    modifiedSelection.coordinate = nextWord;
                }
                break;

            case "ArrowUp":
                /* switch direction to up or move up one square */
                if (modifiedSelection.direction === "horizontal") {
                    modifiedSelection.direction = "vertical"
                } 
                else if (selection.coordinate.row !== 0) {
                    modifiedSelection.coordinate = new Coordinate(selection.coordinate.row - 1, selection.coordinate.column);
                }
                break;

            case "ArrowDown":
                if (modifiedSelection.direction === "horizontal") {
                    modifiedSelection.direction = "vertical"
                } 
                else if (selection.coordinate.row !== boardDimensions.rows - 1) {
                    modifiedSelection.coordinate = new Coordinate(selection.coordinate.row  + 1, selection.coordinate.column);
                }
                break;

            case "ArrowRight":
                if (modifiedSelection.direction === "vertical") {
                    modifiedSelection.direction = "horizontal"
                } 
                else if (selection.coordinate.column !== boardDimensions.columns - 1) {
                    modifiedSelection.coordinate = new Coordinate(selection.coordinate.row, selection.coordinate.column + 1);
                }
                break;

            case "ArrowLeft":
                if (modifiedSelection.direction === "vertical") {
                    modifiedSelection.direction = "horizontal"
                } 
                else if (selection.coordinate.column !== 0) {
                    modifiedSelection.coordinate = new Coordinate(selection.coordinate.row, selection.coordinate.column - 1);
                }
                break;

            default:
                /* if the keypress was a letter, assign the square to that letter */
                if (e.key.length === 1 && e.key.match(/[a-zA-Z]/)) {
                    setChar(e.key);
                    modifiedSelection.coordinate = getNextSquare(coords, boardDimensions, selection);
                }
        }
        setSelection(modifiedSelection);
    }

    const handleClick = () => {
        /* focus the square. if the square is already focused, swap the direction */
        let modifiedSelection = { ...selection };
        if (coords.equals(selection.coordinate)) {
            modifiedSelection.direction = (selection.direction === "horizontal" ? "vertical" : "horizontal")
        }
        modifiedSelection.coordinate = coords;
        modifiedSelection.focus = true;
        setSelection(modifiedSelection);
    }
    return (
    <div style={{ "--board-size": getBoardSize(boardDimensions) } as React.CSSProperties}>
        <div className = {styles.cornerValue}>{cornerValue}</div>
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
    </div>
    )
}