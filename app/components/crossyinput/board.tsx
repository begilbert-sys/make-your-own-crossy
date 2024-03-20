'use client';
import styles from '@/styles/Home.module.css';

import RefObject, { useState, useEffect, useRef, useContext } from 'react';
import Square from '@/app/components/crossyinput/square';
import {dimensions, Coordinate, Selection, NO_SELECTION} from '@/app/components/crossyinput/types';
import {SelectionContext, ISelectionContext} from '@/app/components/crossyinput/selectioncontext';
import {BoardContext, IBoardContext} from '@/app/components/crossyinput/boardcontext';

function isTextBox(target: EventTarget | null) {
    /* checks if the event target is a textbox */
    return (target instanceof HTMLTextAreaElement) || (target as HTMLDivElement).classList.contains("MuiInputBase-root");
}
function useOutsideClick(ref: RefObject.RefObject<HTMLDivElement>, setSelection: (f: Selection) => void) {
    /*
    This de-focuses the focused square when the user clicks anywhere outside of the board
    */
    useEffect(() => {
        function handleClickOutside(event: globalThis.MouseEvent) {
            console.log(event.target);
            // note: clicking an textarea shouldn't de-focus, because when selecting a clue textarea the user needs to see which letters get highlighted
            if (ref.current && !ref.current.contains(event.target as Node) && !(isTextBox(event.target))) {
                // this just resets the selection/focus to nothing 
                setSelection({
                    coordinate: NO_SELECTION,
                    direction: "horizontal",
                    focus: false
                })
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]); // a compiler warning is generated because setSelection is not a dependency. but AFAIK since setSelection never changes, it doesn't need to be.

}

function getSelectedWordCoords(board: string[][], {rows, columns}: dimensions, selection: Selection, wordCoordinatesOriginal: Coordinate[]) : Coordinate {
    /* gets the number value of whatever word is currently selected, or null if no word is selected */
    let wordCoordinates = [...wordCoordinatesOriginal].reverse();
    if (wordCoordinates.length === 0) {
        return NO_SELECTION;
    }
    let lastCoordinate = NO_SELECTION;
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
            const coord = new Coordinate(row, col);
            if (wordCoordinates.length > 0 && coord.equals(wordCoordinates[wordCoordinates.length - 1])) {
                const popped = wordCoordinates.pop() as Coordinate;
                if (selection.direction === "horizontal" && selection.coordinate.row === row) {
                    lastCoordinate = popped;
                }
                else if (selection.direction === "vertical" && selection.coordinate.column === col) {
                    lastCoordinate = popped;
                }
            }
            if (coord.equals(selection.coordinate)) {
                return lastCoordinate;
            }
        }
    }
    return NO_SELECTION;
}

interface IBoardProps {
    dimensions: dimensions,
    acrossList: Coordinate[],
    downList: Coordinate[]
}

export default function Board({dimensions: {rows, columns}, acrossList, downList} : IBoardProps) {
    const {selection, setSelection} = useContext<ISelectionContext>(SelectionContext);
    const {board, setBoard} = useContext<IBoardContext>(BoardContext);
    const clickWrapperRef = useRef<HTMLDivElement>(null);
    useOutsideClick(clickWrapperRef, setSelection);

    const boardArray = [];

    const selectedWordCoords = selection.direction === "horizontal" ? getSelectedWordCoords(board, {rows, columns}, selection, acrossList) : getSelectedWordCoords(board, {rows, columns}, selection, downList);
    acrossList = [...acrossList].reverse();
    downList = [...downList].reverse();
    let cornerValue = 0;
    let highlight = false;
    for (let row = 0; row < rows; row++){
        let rowArray = []
        for (let col = 0; col < columns; col++) {
            const coords = new Coordinate(row, col);
            // get the cornerValue if applicable 
            let hasCornerValue = false;
            if (acrossList.length > 0 && coords.equals(acrossList[acrossList.length - 1])) {
                hasCornerValue = true;
                cornerValue++;
                acrossList.pop();
            }
            if (downList.length > 0 && coords.equals(downList[downList.length - 1])) {
                if (!hasCornerValue) {
                    hasCornerValue = true;
                    cornerValue++;
                }
                downList.pop();
            }
            let nextWord;
            if (selection.direction == "horizontal") {
                if (acrossList.length > 0) {
                    nextWord = acrossList.at(-1);
                }
            } else {
                if (downList.length > 0) {
                    nextWord = downList.at(-1);
                }
            }
            if (selectedWordCoords != null && coords.equals(selectedWordCoords)) {
                highlight = true;
            }
            if (highlight && board[row][col] === ' ') {
                highlight = !(selection.direction === "horizontal" ? row === selection.coordinate.row : col === selection.coordinate.column);
            }
            let shouldHighlight = highlight && (selection.direction === "horizontal" ? row === selection.coordinate.row : col === selection.coordinate.column);
            rowArray.push(
                <Square 
                key = {col}
                coords = {coords}
                boardDimensions = {{rows: rows, columns: columns}}
                highlighted = {shouldHighlight}
                nextWord = {nextWord}
                cornerValue = {hasCornerValue ? cornerValue : undefined}
                />
            )
        }
        boardArray.push(
            <div key = {row} className={styles.boardRow}>
                {rowArray}
            </div>
        )
    }
    return (
        <div className={styles.boardWrapper}>
            <div className={styles.board} ref={clickWrapperRef}>
                {boardArray}
            </div>
        </div>
    );
  }
  