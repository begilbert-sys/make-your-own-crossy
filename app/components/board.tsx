'use client';
import RefObject, { useEffect, useRef, useContext } from 'react';

import styles from '@/styles/Home.module.css';

import { useOutsideClick } from "@/app/hooks/useoutsideclick";

import { Coordinates } from '@/app/types/coordinates';
import { Selection } from '@/app/types/selection';
import { Crossy } from "@/app/types/crossy";

import { CrossyJSONContext, ICrossyJSONContext } from '@/app/contexts/crossyjsoncontext';
import { SelectionContext, ISelectionContext } from '@/app/contexts/selectioncontext';

import Square from '@/app/components/square';

interface BoardComponentProps {
    buildMode: boolean
}
export default function BoardComponent({buildMode}: BoardComponentProps) {
    const {selection, setSelection} = useContext<ISelectionContext>(SelectionContext);
    const {crossyJSON, setCrossyJSON} = useContext<ICrossyJSONContext>(CrossyJSONContext);

    const crossy = new Crossy(crossyJSON);
    const clickWrapperRef = useRef<HTMLDivElement>(null);
    if (buildMode) {
        useOutsideClick(clickWrapperRef, setSelection);
    }

    useEffect(() => {
        /* 
        sometimes when clicking on a square, the text inside of the square gets highlighted. 
        this clears the highlight.
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
  