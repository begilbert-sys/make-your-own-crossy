import { useRouter } from 'next/navigation';
import { useContext } from 'react';

import Button from '@mui/material/Button';

import { Board } from "@/app/types/board";

import { BoardContext, IBoardContext } from '@/app/contexts/boardcontext';

export default function Upload() {
    const router = useRouter();
    const uploadBoard = async (board: Board) => {
        const res = await fetch(process.env.WEBSITE_URL + "api/", {
            method: "POST",
            headers: { "Content-Type" : "text/plain" },
            body: board.toString()
        });
        const hexID = await res.text();
        router.push("/mini/" + hexID);
        
    }

    const {board, setBoard} = useContext<IBoardContext>(BoardContext);
    return (
        <Button variant="contained" onClick={() => uploadBoard(board)}>UPLOAD BOARD</Button>
    );
}