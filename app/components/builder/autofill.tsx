import { useContext, useState } from 'react';

import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';

import styles from '@/styles/Home.module.css';

import { generateBoard } from "@/app/lib/boardgen";

import { BoardContext, IBoardContext } from "@/app/contexts/boardcontext";


export default function AutoFill() {
    const {board, setBoard} = useContext<IBoardContext>(BoardContext);
    const [loading, setLoading] = useState<boolean> (false);
    const handleClick = async () => {
        setLoading(true);
        const newBoard = await generateBoard(board);
        setBoard(newBoard);
        setLoading(false);
    };
    
    return (
        <div>
            <h3>Feeling Lazy?</h3>
            <p>The autofiller can try to generate a board for you!</p>
            <Button className={styles.generateBoardButton} variant="contained" onClick={handleClick}>
                {loading ? (
                    <>
                    {"Generating. . . "}
                    <CircularProgress 
                        size={20}
                        sx={{ color: 'black' }}
                    />
                    </>
                ): (
                    <>
                    {"Generate Board"}
                    <AppRegistrationIcon />
                    </>
                )}
            </Button>
        </div>

    )

}