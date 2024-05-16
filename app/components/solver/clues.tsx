import { useContext, useRef } from 'react';

import clsx from 'clsx';

import styles from '@/styles/Home.module.css';


import { Coordinates } from '@/app/types/coordinates';
import { Crossy, Direction } from '@/app/types/crossy';

import { SelectionContext, ISelectionContext } from '@/app/contexts/selectioncontext';
import { CrossyJSONContext, ICrossyJSONContext } from '@/app/contexts/crossyjsoncontext';

interface ClueBoxProps {
    direction: Direction
}
export default function ClueBox({direction}: ClueBoxProps) {
    const {crossyJSON, setCrossyJSON} = useContext<ICrossyJSONContext>(CrossyJSONContext);
    const {selection, setSelection} = useContext<ISelectionContext>(SelectionContext);

    const crossy = new Crossy(crossyJSON);
    const wordList = crossy.getWordList(direction);
    const cornerValueMap = crossy.getCornerValueMap();

    const handleFocus = (coords: Coordinates) => {
        setSelection({
            coordinates: coords,
            direction: direction,
            focus: false
        });
    }

    let clueList = [];
    
    for (let i = 0; i < wordList.length; i++) {
        const coords = wordList[i];
        let classList = clsx(
            styles.clue,
            styles.clueDisplay,
        );
        const selectionWordStart = crossy.getWordStart(selection.coordinates, selection.direction);
        if (coords.equals(selectionWordStart) && selection.direction === direction) {
            classList = clsx(
                styles.clue,
                styles.clueDisplay,
                styles.clueDisplayHighlighted
            );
        }
        const cornerValue = cornerValueMap[coords.row][coords.column];
        const value = (direction === "across") ? (crossyJSON.acrossClues[i]) : (crossyJSON.downClues[i]);
        clueList.push(
            <li 
                value = {cornerValue} 
                key={cornerValue} 
                className={classList}
                onClick = {() => handleFocus(coords)}
            >
                {value}
            </li>
        )
    }

    return (
        <>
            <div className={styles.clueBox}>
                <h2 className={styles.clueHeader}>
                    <b>
                        {direction.toUpperCase()}
                    </b>
                </h2>
                <ol className={styles.clueList}>
                    {clueList}
                </ol>
            </div>
        </>
    )
}