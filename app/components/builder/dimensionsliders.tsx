import { useContext } from 'react';
import Slider from '@mui/material/Slider';

import styles from '@/styles/Builder.module.css';

import { Crossy } from '@/app/types/crossy';

import { CrossyJSONContext, ICrossyJSONContext } from '@/app/contexts/crossyjsoncontext';

export default function DimensionSliders() {
    const {crossyJSON, setCrossyJSON} = useContext<ICrossyJSONContext>(CrossyJSONContext);
    const crossy = new Crossy(crossyJSON);
    const handleChangeBoardSize = (rows: number, columns: number) => {
        crossy.setSize(rows, columns);
        setCrossyJSON(crossy.toJSON());
    }
    return (
        <div>
            <h3>Change your board's size</h3>
            <div className={styles.sliderRow}>
                <span style={{marginRight: "55px"}}>Rows</span>
                <Slider
                    sx={{ width: "200px" }}
                    aria-label = "Rows"
                    valueLabelDisplay="auto"
                    value = {crossy.rows}
                    min = {3}
                    max = {8}
                    marks = {true}
                    onChange = {(e) => handleChangeBoardSize(Number((e.target as HTMLInputElement).value), crossy.columns)}
                />
            </div>
            <br />
            <div className={styles.sliderRow}>
                <span style={{marginRight: "30px"}}>Columns</span>
                <Slider
                    sx={{ width: "200px" }}
                    aria-label = "Rows"
                    valueLabelDisplay="auto"
                    value = {crossy.columns}
                    min = {3}
                    max = {8}
                    marks = {true}
                    onChange = {(e) => handleChangeBoardSize(crossy.rows, Number((e.target as HTMLInputElement).value))}
                />
            </div>
        </div>
    )
}