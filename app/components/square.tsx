import { KeyboardEvent, useRef, useContext, useEffect } from 'react';

import clsx from 'clsx';

import styles from '@/styles/Home.module.css';

import { Coordinates } from '@/app/types/coordinates';
import { Board } from '@/app/types/board';

import { BoardContext, IBoardContext } from '@/app/contexts/boardcontext';
import { SelectionContext, ISelectionContext } from '@/app/contexts/selectioncontext';

interface SquareProps {
    coords: Coordinates,
    highlighted: boolean,
    cornerValue: string
}
export default function Square({coords, highlighted, cornerValue} : SquareProps) {
    /* 
    variable initialization 
    */
    const {selection, setSelection} = useContext<ISelectionContext>(SelectionContext);
    const {board, setBoard} = useContext<IBoardContext>(BoardContext);
    const inputRef = useRef<HTMLInputElement>(null);
    if (inputRef.current != null && selection.focus && coords.equals(selection.coordinates)) {
        inputRef.current.focus();
    }

    const acrossWordCoords = board.getWordStart(coords, "across");
    const downWordCoords = board.getWordStart(coords, "down");

    const acrossCoordsList = board.getWordList("across");
    const downCoordsList = board.getWordList("down");

    /* 
    utility functions 
    */
    const getNextSquare = (): Coordinates => {
        if (coords.row === board.rows - 1 && coords.column === board.columns - 1) {
            return coords;
        }
        if (selection.direction === "across") {
            return coords.column === board.columns - 1 ? new Coordinates(coords.row + 1, 0) : new Coordinates(coords.row, coords.column + 1);
        } else {
            return coords.row === board.rows - 1 ? new Coordinates(0, coords.column + 1) : new Coordinates(coords.row + 1, coords.column);
        }
    }
    const getPrevSquare = (): Coordinates => {
        if (coords.row === 0 && coords.column === 0) {
            return coords;
        }
        if (selection.direction === "across") {
            return coords.column === 0 ? new Coordinates(coords.row - 1, board.columns - 1) : new Coordinates(coords.row, coords.column - 1);
        } else {
            return coords.row === 0 ? new Coordinates(board.rows - 1, coords.column - 1) : new Coordinates(coords.row - 1, coords.column);
        }
    }

    /* 
    event handlers
    */

    const char: string = board.getCoord(coords);
    const disabled = char === Board.BLACKOUT;
    const setChar = (newChar: string) => {
        let newBoard = new Board({rows: board.rows, columns: board.columns, oldBoard: board});
        newBoard.setCoord(coords, newChar);
        setBoard(newBoard);
    };

    const handleKeyPress = (e: KeyboardEvent) => {
        e.preventDefault(); // prevents the 'Tab' key from jumping to the next input
        /* handle different keypresses */
        let modifiedSelection = {...selection};
        switch (e.key) {
            case "Backspace":
                /* delete square value and move one square back */
                setChar(Board.BLANK);
                modifiedSelection.coordinates = getPrevSquare();
                break;

            case "Enter":
            case "Tab":
                /* jump to the beginning of the next word */
                const wordCoords = board.getWordStart(coords, selection.direction);
                const coordsList = board.getWordList(selection.direction);
                const otherCoordsList = board.getWordList((selection.direction === "across") ? ("down") : ("across"));
                if (wordCoords == Coordinates.NONE) {
                    break;
                }
                const index = board.getWordListIndex(coords, selection.direction);
                // if it's the last word on the board, switch the direction and jump to the beginning of the board
                let coordsString;
                if (index === coordsList.length - 1 && otherCoordsList.length !== 0) {
                    modifiedSelection.coordinates = otherCoordsList[0];
                    modifiedSelection.direction = (selection.direction === "across") ? ("down") : ("across"); 
                } else {
                    modifiedSelection.coordinates = coordsList[index + 1];
                }
                break;

            case ' ':
                /* jump to the next letter in the word. if at end of word, jump back to start */
                if (disabled) {
                    break;
                }
                if (
                (selection.direction === "across") && 
                ((selection.coordinates.column === board.columns - 1) || 
                (board.get(selection.coordinates.row, selection.coordinates.column + 1) === Board.BLACKOUT))
                ) {
                    modifiedSelection.coordinates = acrossWordCoords;
                }
                else if (
                (selection.direction === "down") && 
                ((selection.coordinates.row === board.rows - 1) || 
                (board.get(selection.coordinates.row + 1, selection.coordinates.column) === Board.BLACKOUT))
                ) {
                    modifiedSelection.coordinates = downWordCoords;
                } 
                else {
                    modifiedSelection.coordinates = getNextSquare();
                }
                break;
            
            case '.':
                /* toggle between disabling or enabling the square */
                if (disabled) {
                    setChar(Board.BLANK);
                } else {
                    setChar(Board.BLACKOUT);
                }
                break;

            case "ArrowUp":
                /* switch direction to up or move up one square */
                if (selection.direction === "across") {
                    modifiedSelection.direction = "down"
                } 
                else if (selection.coordinates.row !== 0) {
                    modifiedSelection.coordinates = new Coordinates(selection.coordinates.row - 1, selection.coordinates.column);
                }
                break;

            case "ArrowDown":
                /* switch direction to down or move down one square */
                if (selection.direction === "across") {
                    modifiedSelection.direction = "down"
                } 
                else if (selection.coordinates.row !== board.rows - 1) {
                    modifiedSelection.coordinates = new Coordinates(selection.coordinates.row  + 1, selection.coordinates.column);
                }
                break;

            case "ArrowRight":
                if (selection.direction === "down") {
                    modifiedSelection.direction = "across"
                } 
                else if (selection.coordinates.column !== board.columns - 1) {
                    modifiedSelection.coordinates = new Coordinates(selection.coordinates.row, selection.coordinates.column + 1);
                }
                break;

            case "ArrowLeft":
                if (selection.direction === "down") {
                    modifiedSelection.direction = "across"
                } 
                else if (selection.coordinates.column !== 0) {
                    modifiedSelection.coordinates = new Coordinates(selection.coordinates.row, selection.coordinates.column - 1);
                }
                break;

            default:
                /* if the keypress was a letter, assign the square to that letter */
                if (e.key.length === 1 && e.key.match(/[a-zA-Z]/)) {
                    setChar(e.key.toLowerCase());
                    modifiedSelection.coordinates = getNextSquare();
                }
        }
        setSelection(modifiedSelection);
    };

    const handleClick = () => {
        /* focus the square. if the square is already focused, toggle the direction */
        let modifiedSelection = {...selection};
        if (coords.equals(selection.coordinates)) {
            modifiedSelection.direction = (selection.direction === "across" ? "down" : "across");
        }
        modifiedSelection.coordinates = coords;
        modifiedSelection.focus = true;
        setSelection(modifiedSelection);
    };

    /*
    styling
    */
    const classList = clsx(
        styles.square,
        {[styles.highlighted]: highlighted},
        {[styles.disabled]: disabled},
        {[styles.selected]: coords.equals(selection.coordinates) && selection.focus},
        {[styles.disabledSelected]: disabled && coords.equals(selection.coordinates) && selection.focus}
    );
    
    const maxBoardSize = board.rows > board.columns ? board.rows : board.columns;
    return (
    <div style={{ "--board-size": maxBoardSize } as React.CSSProperties}>
        <div className = {styles.cornerValue}>{cornerValue}</div>
        <input
            ref = {inputRef}
            type = "text"
            value = {char === '.' ? ' ' : char} // disabled spaces should be blank
            maxLength = {1}
            className = {classList} 
            onKeyDown = {handleKeyPress}
            onClick = {handleClick}
            onChange = {(e) => {}} // onChange is required but it does nothing
        />
    </div>
    )
}