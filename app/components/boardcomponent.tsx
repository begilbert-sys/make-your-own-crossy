'use client';
import RefObject, { useEffect, useRef, useContext } from 'react';

import styles from '@/styles/Home.module.css';
import { Coordinate } from '@/app/types/coordinate';
import { Board } from '@/app/types/board';
import { Selection, Direction } from '@/app/types/selection';

import { BoardContext, IBoardContext } from '@/app/contexts/boardcontext';
import { SelectionContext, ISelectionContext } from '@/app/contexts/selectioncontext';

import Square from '@/app/components/square';


function isClickable(target: EventTarget | null) {
    /* checks if the event target is a button or textbox  */
    return (
        (target as Element).closest("button") // if clicking a button
        || (target instanceof HTMLTextAreaElement) // if clicking a textbox
        || (target as HTMLDivElement).classList.contains("MuiInputBase-root") // if clicking a MUI textbox wrapper
    )
}

function useOutsideClick(ref: RefObject.RefObject<HTMLDivElement>, setSelection: (f: Selection) => void) {
    /*
    This de-focuses the focused square when the user clicks anywhere outside of the board
    */
    useEffect(() => {
        function handleClickOutside(event: globalThis.MouseEvent) {
            // clicking certain elements shouldn't de-focus
            if (ref.current && !ref.current.contains(event.target as Node) && !(isClickable(event.target))) {
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

export default function BoardComponent() {
    const {selection, setSelection} = useContext<ISelectionContext>(SelectionContext);
    const {board, setBoard} = useContext<IBoardContext>(BoardContext);
    const clickWrapperRef = useRef<HTMLDivElement>(null);
    useOutsideClick(clickWrapperRef, setSelection);

    const boardArray = [];
    const selectedWordCoords = board.getSelectionWord(selection);
    const acrossList = board.getAcrossList();
    const downList = board.getDownList();
    let reverseAcrossList = [...acrossList].reverse();
    let reverseDownList = [...downList].reverse();
    let cornerValue = 0;
    let highlight = false;
    const acrossIndices: number[][] = board.mapAcrossIndices();
    const downIndices: number[][] = board.mapDownIndices();
    for (let row = 0; row < board.rows; row++){
        let rowArray = []
        for (let col = 0; col < board.columns; col++) {
            const coords = new Coordinate(row, col);
            // get the cornerValue if applicable 
            let hasCornerValue = false;
            if (reverseAcrossList.length > 0 && coords.equals(reverseAcrossList.at(-1)!)) {
                hasCornerValue = true;
                cornerValue++;
                reverseAcrossList.pop();
            }
            if (reverseDownList.length > 0 && coords.equals(reverseDownList.at(-1)!)) {
                if (!hasCornerValue) {
                    hasCornerValue = true;
                    cornerValue++;
                }
                reverseDownList.pop();
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
                    acrossList = {acrossList}
                    acrossIndex = {acrossIndices[coords.row][coords.column]}
                    downList = {downList}
                    downIndex = {downIndices[coords.row][coords.column]}
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
  