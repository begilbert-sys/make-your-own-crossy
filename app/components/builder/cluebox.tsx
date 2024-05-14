import { useContext, useRef } from 'react';
import styles from '@/styles/Home.module.css';


import { Coordinates } from '@/app/types/coordinates';
import { Direction } from '@/app/types/board';
import { Clues } from '@/app/types/clues';

import { SelectionContext, ISelectionContext } from '@/app/contexts/selectioncontext';
import { BoardContext, IBoardContext } from '@/app/contexts/boardcontext';

import TextField from '@mui/material/TextField';
interface ClueBoxProps {
    clues: Clues
    setClues: (c: Clues) => void
    direction: Direction
}
export default function ClueBox({clues, setClues, direction}: ClueBoxProps) {
    const {board, setBoard} = useContext<IBoardContext>(BoardContext);
    const {selection, setSelection} = useContext<ISelectionContext>(SelectionContext);

    const wordList = board.getWordList(direction);
    const cornerValueMap = board.getCornerValueMap();


    const handleFocus = (event: any, coords: Coordinates) => {
        setSelection({
            coordinates: coords,
            direction: direction,
            focus: false
        });
    }

    const handleChange = (wordIndex: number, input: string) => {
        if (direction === "across") {
            clues.across[wordIndex] = input;
        } else {
            clues.down[wordIndex] = input;
        }
        setClues({...clues});
    }


    let clueList = [];
    
    for (let i = 0; i < wordList.length; i++) {
        const coords = wordList[i];
        const cornerValue = cornerValueMap[coords.row][coords.column];
        const value = (direction === "across") ? (clues.across[i]) : (clues.down[i]);
        clueList.push(
            <li value = {cornerValue} key={cornerValue} className={styles.clue}>
                <TextField 
                    multiline 
                    hiddenLabel
                    size = "small" 
                    variant = "outlined"
                    value={value}
                    onFocus = {(e) => handleFocus(e, coords)}
                    onChange = {(e) => handleChange(i, e.target.value)}
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