'use client';
import RefObject, { useState, useEffect, useRef, useContext } from 'react';
import Square from '@/app/components/square';
import {dimensions, Coordinate, Selection, NO_SELECTION} from '@/app/components/types';
import {SelectionContext, ISelectionContext} from '@/app/components/selectioncontext';
import {BoardContext, IBoardContext} from '@/app/components/boardcontext';

interface IBoardProps {
    dimensions: dimensions,
    acrossList: Coordinate[],
    downList: Coordinate[]
}
function outsideClickListener(ref: RefObject.RefObject<HTMLDivElement>, setSelection: (f: Selection) => void) {
    /*
    This de-focuses the focused square when the user clicks anywhere outside of the board
    */
    useEffect(() => {
        function handleClickOutside(event: globalThis.MouseEvent) {
            console.log(typeof event.target);
            if (ref.current && !ref.current.contains(event.target as Node) && !(event.target instanceof HTMLInputElement)) {
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
    }, [ref]);
}
export default function Board({dimensions: {rows, columns}, acrossList, downList} : IBoardProps) {
    const {selection, setSelection} = useContext<ISelectionContext>(SelectionContext);
    const {board, setBoard} = useContext<IBoardContext>(BoardContext);
    const clickWrapperRef = useRef<HTMLDivElement>(null);
    outsideClickListener(clickWrapperRef, setSelection);

    const boardArray = [];
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
            if (coords.equals(selection.coordinate)) {
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
            <div key = {row} className="flex">
                {rowArray}
            </div>
        )
    }
    return (
        <div ref={clickWrapperRef}>
            {boardArray}
        </div>
    );
  }
  