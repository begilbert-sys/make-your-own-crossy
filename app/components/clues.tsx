import { useContext } from 'react';
import styles from '@/styles/Home.module.css';

import { Coordinate } from '@/app/types/coordinate';
import { Board } from '@/app/types/board';

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
    const reFocusAcross = (coords: Coordinate) => {
        setSelection({
            coordinate: coords,
            direction: "horizontal",
            focus: false
        });
    }
    const reFocusDown = (coords: Coordinate) => {
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
                const index = acrossList.length - acrossList.length;
                let acrossCoords = acrossList.pop()!;
                clueListAcross.push(
                    <li value = {clueNumber} key={index} className={styles.clue}>
                        <TextField multiline size="small" variant="outlined" onFocus= {() => reFocusAcross(acrossCoords)}/>
                    </li>
                );
                added = true;
            }
            if (downList.length > 0 && coords.equals(downList.at(-1)!)) {
                if (!added) {
                    clueNumber++;
                }
                const index = downList.length - downList.length;
                let downCoords = downList.pop()!;
                clueListDown.push(
                    <li value = {clueNumber} key={index} className={styles.clue}>
                        <TextField multiline size="small" variant="outlined" onFocus= {() => reFocusDown(downCoords)}/>
                    </li>
                );
            }
        }
    }

    return (
        <>
            <div>
                <h2><b>ACROSS</b></h2>
                <ol className={styles.clueList}>
                    {clueListAcross}
                </ol>
            </div>
            <div>
                <h2><b>DOWN</b></h2>
                <ol className={styles.clueList}>
                    {clueListDown}
                </ol>
            </div>
        </>
    )
}