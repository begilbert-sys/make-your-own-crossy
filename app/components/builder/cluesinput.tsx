import { useContext, useRef } from 'react';

import styles from '@/styles/Home.module.css';


import { Coordinates } from '@/app/types/coordinates';
import { Crossy, Direction } from '@/app/types/crossy';

import { SelectionContext, ISelectionContext } from '@/app/contexts/selectioncontext';
import { CrossyJSONContext, ICrossyJSONContext } from '@/app/contexts/crossyjsoncontext';

interface CluesInputProps {
    direction: Direction
}
export default function CluesInput({direction}: CluesInputProps) {
    const {crossyJSON, setCrossyJSON} = useContext<ICrossyJSONContext>(CrossyJSONContext);
    const {selection, setSelection} = useContext<ISelectionContext>(SelectionContext);

    const crossy = new Crossy(crossyJSON);
    const wordList = crossy.getWordList(direction);
    const cornerValueMap = crossy.getCornerValueMap();


    const handleFocus = (event: any, coords: Coordinates) => {
        setSelection({
            coordinates: coords,
            direction: direction,
            focus: false
        });
    }

    const handleChange = (wordIndex: number, input: string) => {
        if (direction === "across") {
            crossyJSON.acrossClues[wordIndex] = input;
        } else {
            crossyJSON.downClues[wordIndex] = input;
        }
        setCrossyJSON({...crossyJSON});
    }

    const handleResize = (e:any) => {
        /* 
        this handler (pulled from stackoverflow) resizes the textbox on every input
        to adjust the line length
        */
        e.target.style.height = "0px";
        const scrollHeight = e.target.scrollHeight;
        e.target.style.height = scrollHeight + "px";
    }


    let clueList = [];
    
    for (let i = 0; i < wordList.length; i++) {
        const coords = wordList[i];
        const cornerValue = cornerValueMap[coords.row][coords.column];
        const value = (direction === "across") ? (crossyJSON.acrossClues[i]) : (crossyJSON.downClues[i]);
        clueList.push(
            <li value = {cornerValue} key={cornerValue} className={styles.clue}>
                <textarea
                    className={styles.clueTextbox}
                    value={value}
                    maxLength={140}
                    onFocus = {(e) => handleFocus(e, coords)}
                    onChange = {(e) => handleChange(i, e.target.value)}
                    onInput = {(e) => handleResize(e)}
                />
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