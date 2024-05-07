import dynamic from 'next/dynamic';
import { useContext } from 'react';

import Button from '@mui/material/Button';
import { generateBoard } from "@/app/lib/boardgen";

import { BoardContext, IBoardContext } from "@/app/contexts/boardcontext";


export default function AutoFill() {
    const {board, setBoard} = useContext<IBoardContext>(BoardContext);
    const handleClick = async () => {
        const newBoard = await generateBoard(board);
        setBoard(newBoard);
    };
    
    return (
        <div>
            <h3>Feeling Lazy?</h3>
            <p>The computer can try to generate a board for you!</p>
            <Button variant="contained" onClick={handleClick}>Generate Board</Button>
        </div>

    )

}