'use client';
import RefObject, { useEffect, useRef, useContext } from 'react';

import styles from '@/styles/Home.module.css';

import { Coordinates } from '@/app/types/coordinates';
import { Selection } from '@/app/types/selection';
import { Crossy } from "@/app/types/crossy";

import { CrossyJSONContext, ICrossyJSONContext } from '@/app/contexts/crossyjsoncontext';
import { SelectionContext, ISelectionContext } from '@/app/contexts/selectioncontext';

import Square from '@/app/components/square';


function isClickable(target: EventTarget | null) {
    /* 
    return true if the element is a button or an input 
    */
    return (
        (target as Element).closest("button") // if clicking a button
        || (target instanceof HTMLTextAreaElement) // if clicking a textbox
        || (target as HTMLDivElement).classList.contains("MuiInputBase-root") // if clicking a MUI textbox wrapper
    )
}

function useOutsideClick(ref: RefObject.RefObject<HTMLDivElement>, setSelection: (f: Selection) => void) {
    /*
    When the user clicks anywhere outside of the board, the board's selection is de-focused
    */
    useEffect(() => {
        function handleClickOutside(event: globalThis.MouseEvent) {
            // clicking certain elements (buttons and inputd) shouldn't de-focus
            if (ref.current && !ref.current.contains(event.target as Node) && !(isClickable(event.target))) {
                // reset the selection / focus to nothing 
                setSelection({
                    coordinates: Coordinates.NONE,
                    direction: "across",
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
interface BoardComponentProps {
    buildMode: boolean
}
export default function BoardComponent({buildMode}: BoardComponentProps) {
    const {selection, setSelection} = useContext<ISelectionContext>(SelectionContext);
    const {crossyJSON, setCrossyJSON} = useContext<ICrossyJSONContext>(CrossyJSONContext);

    const crossy = new Crossy(crossyJSON);
    const clickWrapperRef = useRef<HTMLDivElement>(null);
    useOutsideClick(clickWrapperRef, setSelection);

    useEffect(() => {
        /* 
        sometimes when clicking on a square, the text inside of the square gets highlighted. 
        this clears the highlight
        */
        if (window.getSelection) {
            window.getSelection()!.removeAllRanges();
        } else if (document.getSelection()) {
            document.getSelection()!.empty();
        }
    }, [selection])

    const boardArray = [];

    let selectedWordCoords = null;
    if (!selection.coordinates.equals(Coordinates.NONE)) {
        const wordStart = crossy.getWordStart(selection.coordinates, selection.direction);
        if (!wordStart.equals(Coordinates.NONE)) {
            selectedWordCoords = wordStart;
        }
    }
    const cornerValuesMap = crossy.getCornerValueMap();
    for (let row = 0; row < crossy.rows; row++) {
        let rowArray = [];
        for (let col = 0; col < crossy.columns; col++) {
            const coords = new Coordinates(row, col);
            const shouldHighlight = (selectedWordCoords != null) && (selectedWordCoords.equals(crossy.getWordStart(coords, selection.direction)));
            const cornerValue = cornerValuesMap[row][col];

            rowArray.push(
                <Square 
                    key = {col}
                    coords = {coords}
                    highlighted = {shouldHighlight}
                    cornerValue = {(cornerValue !== -1) ? (cornerValue.toString()) : ('')}
                    buildMode = {buildMode}
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
  