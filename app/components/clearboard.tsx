import { useContext } from 'react';

import Button from '@mui/material/Button';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import { Coordinates } from '@/app/types/coordinates';
import { Board } from '@/app/types/board';

import { ISelectionContext, SelectionContext } from '@/app/contexts/selectioncontext';
import { IBoardContext, BoardContext } from '@/app/contexts/boardcontext';

export default function ClearBoard() {
    const {board, setBoard} = useContext<IBoardContext>(BoardContext);

    const {selection, setSelection} = useContext<ISelectionContext>(SelectionContext);

    const handleClick = () => {
        board.clear();
        const newBoard = new Board({rows: board.rows, columns: board.columns, oldBoard: board});
        setBoard(newBoard);
        setSelection({
            coordinates: Coordinates.NONE,
            direction: "across",
            focus: false
        });
    }
    return (
        <Button variant="contained" onClick={handleClick}>
            Clear Board
            <DeleteForeverIcon />
        </Button>
    )
}