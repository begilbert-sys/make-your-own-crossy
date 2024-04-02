import { useContext } from 'react';

import Button from '@mui/material/Button';

import { Coordinate } from '@/app/types/coordinate';
import { Selection } from '@/app/types/selection';
import { Board } from '@/app/types/board';

import { ISelectionContext, SelectionContext } from '@/app/contexts/selectioncontext';
import { IBoardContext, BoardContext } from '@/app/contexts/boardcontext';

export default function ClearBoard() {
    const {board, setBoard} = useContext<IBoardContext>(BoardContext);

    const {selection, setSelection} = useContext<ISelectionContext>(SelectionContext);

    const handleClick = () => {
        const newBoard = new Board(board.rows, board.columns);
        setBoard(newBoard);
        setSelection({
            coordinate: Coordinate.NONE,
            direction: "horizontal",
            focus: false
        });
    }
    return (
        <Button variant="contained" onClick={handleClick}>Clear Board</Button>
    )
}