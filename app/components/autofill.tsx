import { useContext } from 'react';
import Button from '@mui/material/Button';

import autoFiller from "@/app/lib/autofiller";

import { BoardContext, IBoardContext } from "@/app/contexts/boardcontext";
export default function AutoFill() {
    const {board, setBoard} = useContext<IBoardContext>(BoardContext);
    const handleClick = () => {
        board.clearAutofill();
        const newBoard = autoFiller(board);
        setBoard(newBoard);
    }
    
    return (
        <div>
            <h3>Feeling Lazy?</h3>
            <p>The computer can try to generate a board for you!</p>
            <Button variant="contained" onClick={handleClick}>Generate Board</Button>
        </div>

    )

}