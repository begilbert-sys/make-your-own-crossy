import { useContext } from 'react';

import Button from '@mui/material/Button';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import { Coordinates } from '@/app/types/coordinates';
import { Crossy } from '@/app/types/crossy';

import { ISelectionContext, SelectionContext } from '@/app/contexts/selectioncontext';
import { ICrossyJSONContext, CrossyJSONContext } from '@/app/contexts/crossyjsoncontext';

export default function ClearBoard() {
    const {crossyJSON, setCrossyJSON} = useContext<ICrossyJSONContext>(CrossyJSONContext);

    const {selection, setSelection} = useContext<ISelectionContext>(SelectionContext);

    const crossy = new Crossy(crossyJSON);

    const handleClick = () => {
        crossy.clear();
        setCrossyJSON(crossy.toJSON());
        setSelection({
            coordinates: Coordinates.NONE,
            direction: "across",
            focus: false
        });
    }
    return (
        <Button 
            variant="contained" 
            onClick={handleClick}
            sx={{backgroundColor: "red"}}
        >
            Clear Board
            <DeleteForeverIcon />
        </Button>
    )
}