import {dimensions, Coordinate, Selection, NO_SELECTION} from '@/app/components/crossyinput/types';
import Slider from '@mui/material/Slider';

interface IDimensionSlidersProps {
    boardDimensions: dimensions,
    changeBoardSize: (newRows: number, newColumns: number)=> void
}

export default function DimensionSliders({boardDimensions, changeBoardSize}: IDimensionSlidersProps) {
    return (
        <div>
            <br/>
            <h2>Rows:</h2>
            <Slider
            className="w-60"
                aria-label = "Rows"
                valueLabelDisplay="auto"
                value = {boardDimensions.rows}
                min = {3}
                max = {8}
                marks = {true}
                onChange = {(e) => changeBoardSize(Number((e.target as HTMLInputElement).value), boardDimensions.columns)}
            />
            <br />
            <h2>Columns:</h2>
            <Slider
            className="w-60"
                aria-label = "Rows"
                valueLabelDisplay="auto"
                value = {boardDimensions.columns}
                min = {3}
                max = {8}
                marks = {true}
                onChange = {(e) => changeBoardSize(boardDimensions.rows, Number((e.target as HTMLInputElement).value))}
            />
        </div>
    )
}