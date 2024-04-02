import { useContext } from 'react';
import styles from '@/styles/Home.module.css';

import { Coordinate } from '@/app/types/coordinate';

import {SelectionContext, ISelectionContext} from '@/app/contexts/selectioncontext';
import {BoardContext, IBoardContext} from '@/app/contexts/boardcontext';

import TextField from '@mui/material/TextField';
interface ICluesProps {
}
export default function Clues() {
    const {selection, setSelection} = useContext<ISelectionContext>(SelectionContext);
    const {board, setBoard} = useContext<IBoardContext>(BoardContext);

    let acrossList = board.getAcrossList().reverse();
    let downList = board.getDownList().reverse();
    const handleFocusAcross = (coords: Coordinate) => {
        setSelection({
            coordinate: coords,
            direction: "horizontal",
            focus: false
        });
    }
    const handleFocusDown = (coords: Coordinate) => {
        setSelection({
            coordinate: coords,
            direction: "vertical",
            focus: false
        });
    }
    let clueListAcross = [];
    let clueListDown = [];
    let clueNumber = 0;
    for (let row = 0; row < board.rows; row++) {
        for (let col = 0; col < board.columns; col++) {
            const coords = new Coordinate(row, col);
            let added = false;
            if (acrossList.length > 0 && coords.equals(acrossList.at(-1)!)) {
                clueNumber++;
                let acrossCoords = acrossList.pop()!;
                clueListAcross.push(
                    <li value = {clueNumber} key={clueNumber} className={styles.clue}>
                        <TextField multiline size="small" variant="outlined" onFocus= {() => handleFocusAcross(acrossCoords)}/>
                    </li>
                );
                added = true;
            }
            if (downList.length > 0 && coords.equals(downList.at(-1)!)) {
                if (!added) {
                    clueNumber++;
                }
                let downCoords = downList.pop()!;
                clueListDown.push(
                    <li value = {clueNumber} key={clueNumber} className={styles.clue}>
                        <TextField multiline size="small" variant="outlined" onFocus= {() => handleFocusDown(downCoords)}/>
                    </li>
                );
            }
        }
    }

    return (
        <>
            <div className={styles.clueBox}>
                <h2 className={styles.clueHeader}><b>ACROSS</b></h2>
                <ol className={styles.clueList}>
                    {clueListAcross}
                </ol>
            </div>
            <div className={styles.clueBox}>
                <h2 className={styles.clueHeader}><b>DOWN</b></h2>
                <ol className={styles.clueList}>
                    {clueListDown}
                </ol>
            </div>
        </>
    )
}