import { KeyboardEvent, useRef, useContext, useEffect } from 'react';

import clsx from 'clsx';

import styles from '@/styles/Home.module.css';

import { Coordinates } from '@/app/types/coordinates';
import { Crossy, CrossyJSON } from '@/app/types/crossy';

import { CrossyJSONContext, ICrossyJSONContext } from '@/app/contexts/crossyjsoncontext';
import { SelectionContext, ISelectionContext } from '@/app/contexts/selectioncontext';

interface SquareProps {
    coords: Coordinates,
    highlighted: boolean,
    cornerValue: string,
    buildMode: boolean
}
export default function Square({coords, highlighted, cornerValue, buildMode} : SquareProps) {
    /* 
    variable initialization 
    */
    const {selection, setSelection} = useContext<ISelectionContext>(SelectionContext);
    const {crossyJSON, setCrossyJSON} = useContext<ICrossyJSONContext>(CrossyJSONContext);
    const inputRef = useRef<HTMLInputElement>(null);
    if (inputRef.current != null && selection.focus && coords.equals(selection.coordinates)) {
        inputRef.current.focus();
    }

    const crossy = new Crossy(crossyJSON);

    const acrossWordCoords = crossy.getWordStart(coords, "across");
    const downWordCoords = crossy.getWordStart(coords, "down");

    const acrossCoordsList = crossy.getWordList("across");
    const downCoordsList = crossy.getWordList("down");

    /* 
    utility functions 
    */
    const getNextSquare = (): Coordinates => {
        if (coords.row === crossy.rows - 1 && coords.column === crossy.columns - 1) {
            return coords;
        }
        if (selection.direction === "across") {
            return coords.column === crossy.columns - 1 ? new Coordinates(coords.row + 1, 0) : new Coordinates(coords.row, coords.column + 1);
        } else {
            return coords.row === crossy.rows - 1 ? new Coordinates(0, coords.column + 1) : new Coordinates(coords.row + 1, coords.column);
        }
    }
    const getPrevSquare = (): Coordinates => {
        if (coords.row === 0 && coords.column === 0) {
            return coords;
        }
        if (selection.direction === "across") {
            return coords.column === 0 ? new Coordinates(coords.row - 1, crossy.columns - 1) : new Coordinates(coords.row, coords.column - 1);
        } else {
            return coords.row === 0 ? new Coordinates(crossy.rows - 1, coords.column - 1) : new Coordinates(coords.row - 1, coords.column);
        }
    }
    const getNextLetter = (): Coordinates => {
        if (selection.direction === "across") {
            if (coords.column === crossy.columns - 1 || crossy.get(coords.row, coords.column + 1) === Crossy.BLACKOUT) {
                return coords;
            }
            return new Coordinates(coords.row, coords.column + 1);
        } else {
            if (coords.row === crossy.rows - 1 || crossy.get(coords.row + 1, coords.column) === Crossy.BLACKOUT) {
                return coords;
            }
            return new Coordinates(coords.row + 1, coords.column);
        }
    }
    const getPrevLetter = (): Coordinates => {
        if (selection.direction === "across") {
            if (coords.column === 0 || crossy.get(coords.row, coords.column - 1) === Crossy.BLACKOUT) {
                return coords;
            }
            return new Coordinates(coords.row, coords.column - 1);
        } else {
            if (coords.row === 0 || crossy.get(coords.row - 1, coords.column) === Crossy.BLACKOUT) {
                return coords;
            }
            return new Coordinates(coords.row - 1, coords.column);
        }
    }

    /* 
    event handlers
    */

    const char: string = crossy.getCoord(coords);
    const disabled = char === Crossy.BLACKOUT;
    const setChar = (newChar: string) => {
        crossy.setCoord(coords, newChar);
        setCrossyJSON(crossy.toJSON());
    };

    const handleKeyPress = (e: KeyboardEvent) => {
        e.preventDefault(); // prevents the 'Tab' key from jumping to the next input
        /* handle different keypresses */
        let modifiedSelection = {...selection};
        switch (e.key) {
            case "Backspace":
                /* delete square value and move one square back */
                setChar(Crossy.BLANK);
                if (buildMode) {
                    modifiedSelection.coordinates = getPrevSquare();
                } else {
                    modifiedSelection.coordinates = getPrevLetter();
                }
                break;

            case "Enter":
            case "Tab":
                /* jump to the beginning of the next word */
                const wordCoords = crossy.getWordStart(coords, selection.direction);
                const coordsList = crossy.getWordList(selection.direction);
                const otherCoordsList = crossy.getWordList((selection.direction === "across") ? ("down") : ("across"));
                if (wordCoords == Coordinates.NONE) {
                    break;
                }
                const index = crossy.getWordListIndex(wordCoords, selection.direction);
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
                ((selection.coordinates.column === crossy.columns - 1) || 
                (crossy.get(selection.coordinates.row, selection.coordinates.column + 1) === Crossy.BLACKOUT))
                ) {
                    modifiedSelection.coordinates = acrossWordCoords;
                }
                else if (
                (selection.direction === "down") && 
                ((selection.coordinates.row === crossy.rows - 1) || 
                (crossy.get(selection.coordinates.row + 1, selection.coordinates.column) === Crossy.BLACKOUT))
                ) {
                    modifiedSelection.coordinates = downWordCoords;
                } 
                else {
                    modifiedSelection.coordinates = getNextSquare();
                }
                break;
            
            case '.':
                if (!buildMode) {
                    break;
                }
                /* toggle between disabling or enabling the square */
                if (disabled) {
                    setChar(Crossy.BLANK);
                } else {
                    setChar(Crossy.BLACKOUT);
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
                else if (selection.coordinates.row !== crossy.rows - 1) {
                    modifiedSelection.coordinates = new Coordinates(selection.coordinates.row  + 1, selection.coordinates.column);
                }
                break;

            case "ArrowRight":
                if (selection.direction === "down") {
                    modifiedSelection.direction = "across"
                } 
                else if (selection.coordinates.column !== crossy.columns - 1) {
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
                    if (buildMode) {
                        modifiedSelection.coordinates = getNextSquare();
                    } else {
                        modifiedSelection.coordinates = getNextLetter();
                    }
                }
        }
        setSelection(modifiedSelection);
    };

    const handleClick = () => {
        if (!buildMode && disabled) {
            return;
        }
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
    
    const maxBoardSize = crossy.rows > crossy.columns ? crossy.rows : crossy.columns;
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