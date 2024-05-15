import { useContext, useState } from 'react';

import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';

import styles from '@/styles/Home.module.css';

import { generateBoard } from "@/app/lib/boardgen";

import { CrossyJSONContext, ICrossyJSONContext } from "@/app/contexts/crossyjsoncontext";


export default function AutoFill() {
    const {crossyJSON, setCrossyJSON} = useContext<ICrossyJSONContext>(CrossyJSONContext);
    const [loading, setLoading] = useState<boolean> (false);
    const handleClick = async () => {
        setLoading(true);
        const newCrossyJSON = await generateBoard(crossyJSON);
        setCrossyJSON(newCrossyJSON);
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