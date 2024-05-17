import { useContext, useState } from 'react';

import Button from '@mui/material/Button';

import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import styles from '@/styles/Builder.module.css';

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
            <div className={styles.autoFillTitleWrapper}>
                <h3 className={styles.autoFillTitle}>Feeling Lazy?</h3>
                <div className={styles.generatorTooltip}>
                    <Tooltip 
                        arrow
                        title="If the generator is taking too long, try adding a few black boxes"
                        placement="top"
                        componentsProps={{
                            tooltip: {
                                sx: {
                                    textAlign: "center",
                                    maxWidth: "200px",
                                    fontSize: "12px"
                                }
                            }
                        }}

                    >
                        <InfoOutlinedIcon
                            sx = {{height: "20px"}}
                        />
                    </Tooltip>
                </div>
            </div>
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