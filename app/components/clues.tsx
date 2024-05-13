import { useContext } from 'react';
import styles from '@/styles/Home.module.css';


import { Coordinates } from '@/app/types/coordinates';
import { Direction } from '@/app/types/board';

import { SelectionContext, ISelectionContext } from '@/app/contexts/selectioncontext';
import { BoardContext, IBoardContext } from '@/app/contexts/boardcontext';

import TextField from '@mui/material/TextField';
interface ClueProps {
    direction: Direction
}
export default function Clues({direction}: ClueProps) {
    const {board, setBoard} = useContext<IBoardContext>(BoardContext);
    const {selection, setSelection} = useContext<ISelectionContext>(SelectionContext);


    const handleFocus = (coords: Coordinates) => {
        setSelection({
            coordinates: coords,
            direction: direction,
            focus: false
        });
    }

    
    let clueList: React.JSX.Element[] = [];
    board.mapCornerValues(direction).forEach((cornerValue, coordsStr) => {
        const coords = Coordinates.fromString(coordsStr);
        clueList.push(
            <li value = {cornerValue} key={cornerValue} className={styles.clue}>
                <TextField multiline size="small" variant="outlined" onFocus= {() => handleFocus(coords)}/>
            </li>
        )
    });
    return (
        <>
            <div className={styles.clueBox}>
                <h2 className={styles.clueHeader}>
                    <b>
                        {direction === "across" ? "ACROSS" : "DOWN"}
                    </b>
                </h2>
                <ol className={styles.clueList}>
                    {clueList}
                </ol>
            </div>
        </>
    )
}