'use client';
import RefObject, { useEffect, useRef, useContext } from 'react';

import styles from '@/styles/Home.module.css';
import { Coordinate } from '@/app/types/coordinate';
import { Board } from '@/app/types/board';
import { Selection } from '@/app/types/selection';

import { BoardContext, IBoardContext } from '@/app/contexts/boardcontext';
import { SelectionContext, ISelectionContext } from '@/app/contexts/selectioncontext';

import Square from '@/app/components/square';


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
                    coordinate: Coordinate.NONE,
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

interface IBoardComponentProps {
}

export default function BoardComponent() {
    const {selection, setSelection} = useContext<ISelectionContext>(SelectionContext);
    const {board, setBoard} = useContext<IBoardContext>(BoardContext);
    const clickWrapperRef = useRef<HTMLDivElement>(null);
    useOutsideClick(clickWrapperRef, setSelection);

    const boardArray = [];
    const selectedWordCoords = board.getSelectionWord(selection);

    let acrossList = board.getAcrossList().reverse();
    let downList = board.getDownList().reverse();
    let cornerValue = 0;
    let highlight = false;
    for (let row = 0; row < board.rows; row++){
        let rowArray = []
        for (let col = 0; col < board.columns; col++) {
            const coords = new Coordinate(row, col);
            // get the cornerValue if applicable 
            let hasCornerValue = false;
            if (acrossList.length > 0 && coords.equals(acrossList.at(-1)!)) {
                hasCornerValue = true;
                cornerValue++;
                acrossList.pop();
            }
            if (downList.length > 0 && coords.equals(downList.at(-1)!)) {
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
            if (highlight && board.get(row, col) === '.') {
                highlight = !(selection.direction === "horizontal" ? row === selection.coordinate.row : col === selection.coordinate.column);
            }
            let shouldHighlight = highlight && (selection.direction === "horizontal" ? row === selection.coordinate.row : col === selection.coordinate.column);
            rowArray.push(
                <Square 
                key = {col}
                coords = {coords}
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
  