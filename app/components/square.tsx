import { KeyboardEvent, useRef, useContext } from 'react';

import clsx from 'clsx';

import styles from '@/styles/Home.module.css';

import { Coordinate } from '@/app/types/coordinate';
import { Board } from '@/app/types/board';
import { Selection, Direction } from '@/app/types/selection';

import { BoardContext, IBoardContext } from '@/app/contexts/boardcontext';
import { SelectionContext, ISelectionContext } from '@/app/contexts/selectioncontext';

function getMaxBoardSize(board: Board) {
    /* return max(rows, columns) */
    return board.rows > board.columns ? board.rows : board.columns;
}

function getNextSquare(coords: Coordinate, selection: Selection, rows: number, columns: number): Coordinate {
    const focusDirection = selection.direction;
    // don't go anywhere if it's the last square on the board 
    if (coords.row === rows - 1 && coords.column === columns - 1) {
        return coords;
    }
    if (focusDirection === "horizontal") {
        return coords.column === columns - 1 ? new Coordinate(coords.row + 1, 0) : new Coordinate(coords.row, coords.column + 1);
    } else {
        return coords.row === rows - 1 ? new Coordinate(0, coords.column + 1) : new Coordinate(coords.row + 1, coords.column);
    }
}
function getPrevSquare(coords: Coordinate, selection: Selection, rows: number, columns: number): Coordinate {
    const focusDirection = selection.direction;
    // don't go anywhere if it's the last square on the board 
    if (coords.row === 0 && coords.column === 0) {
        return coords;
    }
    if (focusDirection === "horizontal") {
        return coords.column === 0 ? new Coordinate(coords.row - 1, columns - 1) : new Coordinate(coords.row, coords.column - 1);
    } else {
        return coords.row === 0 ? new Coordinate(rows - 1, coords.column - 1) : new Coordinate(coords.row - 1, coords.column);
    }
}

interface ISquareProps {
    coords: Coordinate,
    highlighted: boolean,
    acrossList: Coordinate[],
    acrossIndex: number,
    downList: Coordinate[],
    downIndex: number,
    cornerValue?: number,
}
export default function Square({coords, highlighted, acrossIndex, downIndex, cornerValue} : ISquareProps) {
    const {selection, setSelection} = useContext<ISelectionContext>(SelectionContext);
    const {board, setBoard} = useContext<IBoardContext>(BoardContext);

    const acrossList = board.getAcrossList();
    const downList = board.getDownList();

    const inputRef = useRef<HTMLInputElement>(null);
    if (inputRef.current != null && selection.focus && coords.equals(selection.coordinate)) {
        inputRef.current.focus();
    }
    
    const char: string = board.getCoord(coords)[0];
    // if a square's contents is length 2 then it's been autofilled
    const autofilled = board.getCoord(coords).length === 2;
    const disabled = char === '.';
    const setChar = (newChar: string) => {
        let newBoard = new Board(board.rows, board.columns, board);
        newBoard.setCoord(coords, newChar);
        setBoard(newBoard);
    };

    const classList = clsx(
        styles.square,
        {[styles.highlighted]: highlighted},
        {[styles.disabled]: disabled},
        {[styles.selected]: coords.equals(selection.coordinate) && selection.focus},
        {[styles.disabledSelected]: disabled && coords.equals(selection.coordinate) && selection.focus},
        {[styles.autofilled]: autofilled}
    );

    const handleKeyPress = (e: KeyboardEvent) => {
        /* handle different keypresses */
        let modifiedSelection = { ...selection};
        switch (e.key) {
            case "Backspace":
                /* delete square value and move one square back */
                setChar(' ');
                modifiedSelection.coordinate = getPrevSquare(coords, selection, board.rows, board.columns);
                break;

            case "Enter":
            case "Tab":
                /* jump to the next word */
                if (selection.direction === "horizontal") {
                    if (acrossIndex < acrossList.length - 1) {
                        modifiedSelection.coordinate = acrossList[acrossIndex + 1];
                    } else {
                        modifiedSelection.coordinate = downList[0];
                        modifiedSelection.direction = "vertical";
                    }
                } else {
                    if (downIndex < downList.length - 1) {
                        modifiedSelection.coordinate = downList[downIndex + 1];
                    } else {
                        modifiedSelection.coordinate = acrossList[0];
                        modifiedSelection.direction = "horizontal";
                    } 
                }
                break;
            case ' ':
                if (selection.direction === "horizontal") {
                    if (acrossIndex === -1) {
                        break;
                    }
                    else if (selection.coordinate.column === board.columns - 1 || board.get(selection.coordinate.row, selection.coordinate.column + 1) === '.') {
                        console.log(acrossIndex);
                        console.log(acrossList[acrossIndex]);
                        modifiedSelection.coordinate = acrossList[acrossIndex];
                    }
                    else {
                        modifiedSelection.coordinate = getNextSquare(coords, selection, board.rows, board.columns);
                    }
                } else {
                    if (downIndex === -1) {
                        break;
                    }
                    else if (selection.coordinate.row === board.rows - 1 || board.get(selection.coordinate.row + 1, selection.coordinate.column) === '.') {
                        modifiedSelection.coordinate = downList[downIndex];
                    }
                    else {
                        modifiedSelection.coordinate = getNextSquare(coords, selection, board.rows, board.columns);
                    }
                }
                break;
            case '.':
                if (disabled) {
                    setChar(' ');
                } else {
                    setChar('.');
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
                else if (selection.coordinate.row !== board.rows - 1) {
                    modifiedSelection.coordinate = new Coordinate(selection.coordinate.row  + 1, selection.coordinate.column);
                }
                break;

            case "ArrowRight":
                if (modifiedSelection.direction === "vertical") {
                    modifiedSelection.direction = "horizontal"
                } 
                else if (selection.coordinate.column !== board.columns - 1) {
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
                    setChar(e.key.toLowerCase());
                    modifiedSelection.coordinate = getNextSquare(coords, selection, board.rows, board.columns);
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
    <div style={{ "--board-size": getMaxBoardSize(board) } as React.CSSProperties}>
        <div className = {styles.cornerValue}>{cornerValue}</div>
        <input
            ref = {inputRef}
            type = "text"
            value = {char === '.' ? ' ' : char}
            maxLength = {1}
            className = {classList} 
            onKeyDown = {handleKeyPress}
            onClick = {handleClick}
            onChange = {(e) => {}} // onChange is required but it does nothing
        />
    </div>
    )
}