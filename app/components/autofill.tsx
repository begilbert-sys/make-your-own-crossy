import { useContext } from 'react';
import Button from '@mui/material/Button';

import autoFiller from "@/app/lib/autofiller";

import { BoardContext, IBoardContext } from "@/app/contexts/boardcontext";
export default function AutoFill() {
    const {board, setBoard} = useContext<IBoardContext>(BoardContext);
    const handleClick = () => {
        const newBoard = autoFiller(board);
        setBoard(newBoard);

    }
    return <Button variant="contained" onClick={handleClick}>Generate</Button>

}