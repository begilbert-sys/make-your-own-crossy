'use client';
import RefObject, { useState, useEffect, useRef } from 'react';
import Square from '@/app/components/square';
import {direction, coordinate, dimensions, NO_FOCUS} from '@/app/components/types';

interface IBoardProps {
    dimensions: dimensions,
    acrossList: coordinate[],
    downList: coordinate[]
}
function outsideClickListener(ref: RefObject.RefObject<HTMLDivElement>, setFocus: (c: coordinate) => void) {
    /*
    This de-focuses any selected square when the user clicks anywhere outside of the board
    */
    useEffect(() => {
        function handleClickOutside(event: globalThis.MouseEvent) {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setFocus(NO_FOCUS);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]);
}
export default function Board({dimensions: {rows, columns}, acrossList, downList} : IBoardProps) {
    const [focus, setFocus] = useState<coordinate>(NO_FOCUS);
    const [focusDirection, setFocusDirection] = useState<direction>("horizontal");
    const clickWrapperRef = useRef<HTMLDivElement>(null);
    outsideClickListener(clickWrapperRef, setFocus);

    const boardArray = [];
    acrossList = [...acrossList].reverse();
    downList = [...downList].reverse();
    let cornerValue = 0;
    for (let row = 0; row < rows; row++){
        let rowArray = []
        for (let col = 0; col < columns; col++) {
            const coords = new coordinate(row, col);
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
        <div ref={clickWrapperRef}>
            {boardArray}
        </div>
    );
  }
  