import { useContext } from 'react';
import Slider from '@mui/material/Slider';

import styles from '@/styles/Home.module.css';

import { Board } from '@/app/types/board';

import { BoardContext, IBoardContext } from '@/app/contexts/boardcontext';

export default function DimensionSliders() {
    const {board, setBoard} = useContext<IBoardContext>(BoardContext);
    const handleChangeBoardSize = (rows: number, columns: number) => {
        setBoard(new Board(rows, columns, board));
    }
    return (
        <div>
            <br/>
            <h3>Change your board's size</h3>
            <div className={styles.sliderRow}>
                <span style={{marginRight: "55px"}}>Rows</span>
                <Slider
                    sx={{ width: "200px" }}
                    aria-label = "Rows"
                    valueLabelDisplay="auto"
                    value = {board.rows}
                    min = {3}
                    max = {8}
                    marks = {true}
                    onChange = {(e) => handleChangeBoardSize(Number((e.target as HTMLInputElement).value), board.columns)}
                />
            </div>
            <br />
            <div className={styles.sliderRow}>
                <span style={{marginRight: "30px"}}>Columns</span>
                <Slider
                    sx={{ width: "200px" }}
                    aria-label = "Rows"
                    valueLabelDisplay="auto"
                    value = {board.columns}
                    min = {3}
                    max = {8}
                    marks = {true}
                    onChange = {(e) => handleChangeBoardSize(board.rows, Number((e.target as HTMLInputElement).value))}
                />
            </div>
        </div>
    )
}