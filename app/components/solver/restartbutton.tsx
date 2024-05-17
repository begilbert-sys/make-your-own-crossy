import { useState, useContext } from 'react';

import clsx from 'clsx';

import Button from "@mui/material/Button";

import Modal from '@mui/material/Modal';

import RestartAltIcon from '@mui/icons-material/RestartAlt';

import homeStyles from "@/styles/Home.module.css";

import styles from "@/styles/Solver.module.css";

import { Crossy } from "@/app/types/crossy";

import { CrossyJSONContext, ICrossyJSONContext } from '@/app/contexts/crossyjsoncontext';

interface RestartButtonProps {
    startTimer: () => void,
    stopTimer: () => void
    resetTimer: () => void
}
export default function RestartButton({startTimer, stopTimer, resetTimer}: RestartButtonProps) {
    const {crossyJSON, setCrossyJSON} = useContext<ICrossyJSONContext>(CrossyJSONContext);
    const crossy = new Crossy(crossyJSON);

    const [paused, setPaused] = useState<boolean>(false);

    const handleOpen = () => {
        stopTimer();
        setPaused(true);
    }

    const handleClose = () => {
        startTimer();
        setPaused(false);
    }

    const handleReset = () => {
        resetTimer();
        crossy.clear();
        setCrossyJSON(crossy.toJSON());
        setPaused(false);
    }

    return (
        <>
        <button className={styles.solverButton} onClick={handleOpen}>
            <RestartAltIcon className={styles.pauseIcon}/>
        </button>

        <Modal
            open={paused}
            aria-labelledby="restart-modal-title"
            aria-describedby="restart-modal-description"
        >
            <div className={homeStyles.modal}>
                <h2 style={{marginBottom: "0"}} id="restart-modal-title">Are you sure you want to restart?</h2>
                <p id="restart-modal-description">The timer will reset!</p>
                <br />
                <div className = {styles.restartModalButtonWrapper}>
                    <Button 
                        className={clsx(styles.continueButton, styles.goBackButton)}
                        onClick={handleClose}
                    >
                        No thanks
                    </Button>
                    <Button 
                        className={styles.continueButton}
                        onClick={handleReset}
                    >
                        Yes, Please!
                    </Button>
                </div>
            </div>
        </Modal>
        </>
    );
}