import { useRouter } from 'next/navigation';
import { useContext } from 'react';

import Button from '@mui/material/Button';
import UploadIcon from '@mui/icons-material/Upload';


import { Clues } from "@/app/types/clues";
import { Mini } from "@/app/types/mini";

import { BoardContext, IBoardContext } from '@/app/contexts/boardcontext';

interface UploadProps {
    clues: Clues
}
export default function Upload({clues}: UploadProps) {
    const {board, setBoard} = useContext<IBoardContext>(BoardContext);
    const router = useRouter();
    const uploadBoard = async () => {
        const mini: Mini = {boardString: board.toString(), acrossClues: clues.across, downClues: clues.down};
        const res = await fetch("/api/", {
            method: "POST",
            headers: { "Content-Type" : "application/json" },
            body: JSON.stringify(mini)
        });
        if (!res.ok) {
            console.error(res);
            throw new Error(`Something went wrong with response`);
        }
        const hexID = await res.text();
        router.push("/mini/" + hexID);
    }

    return (
        <Button
            sx={{backgroundColor: "green"}}
            variant="contained" 
            onClick={() => uploadBoard()}
        >
            UPLOAD BOARD
            <UploadIcon />
        </Button>
    );
}