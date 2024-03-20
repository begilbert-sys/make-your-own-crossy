import {useContext} from 'react';
import {dimensions, Coordinate, NO_SELECTION} from '@/app/components/crossyinput/types';
import {SelectionContext, ISelectionContext} from '@/app/components/crossyinput/selectioncontext';
import TextField from '@mui/material/TextField';
interface ICluesProps {
    boardDimensions: dimensions,
    acrossList: Coordinate[],
    downList: Coordinate[]
}
export default function Clues({boardDimensions: {rows, columns}, acrossList, downList}: ICluesProps) {
    let acrossListCopy = [...acrossList].reverse();
    let downListCopy = [...downList].reverse();
    const {selection, setSelection} = useContext<ISelectionContext>(SelectionContext);
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
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
            const coords = new Coordinate(row, col);
            let added = false;
            if (acrossListCopy.length > 0 && coords.equals(acrossListCopy.at(-1) as Coordinate)) {
                clueNumber++;
                const index = acrossList.length - acrossListCopy.length;
                let acrossCoords = acrossListCopy.pop() as Coordinate;
                clueListAcross.push(
                    <li value = {clueNumber} key={index}>
                        <TextField multiline size="small" variant="outlined" onSelect = {() => reFocusAcross(acrossCoords)}/>
                    </li>
                );
                added = true;
            }
            if (downListCopy.length > 0 && coords.equals(downListCopy.at(-1) as Coordinate)) {
                if (!added) {
                    clueNumber++;
                }
                const index = downList.length - downListCopy.length;
                let downCoords = downListCopy.pop() as Coordinate;
                clueListDown.push(
                    <li value = {clueNumber} key={index}>
                        <TextField multiline size="small" variant="outlined" onSelect = {() => reFocusDown(downCoords)}/>
                    </li>
                );
            }
        }
    }

    return (
        <>
            <div>
                <h2><b>ACROSS</b></h2>
                <ol className="list-decimal">
                    {clueListAcross}
                </ol>
            </div>
            <div>
                <h2><b>DOWN</b></h2>
                <ol className="list-decimal">
                    {clueListDown}
                </ol>
            </div>
        </>
    )
}