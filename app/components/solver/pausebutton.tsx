import { useState } from 'react';

import Button from "@mui/material/Button";

import Modal from '@mui/material/Modal';

import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

import homeStyles from "@/styles/Home.module.css";

import styles from "@/styles/Solver.module.css";

interface PauseButtonProps {
    startTimer: () => void,
    stopTimer: () => void
}
export default function PauseButton({startTimer, stopTimer}: PauseButtonProps) {
    const [paused, setPaused] = useState<boolean>(false);

    const handleOpen = () => {
        stopTimer();
        setPaused(true);
    }

    const handleClose = () => {
        startTimer();
        setPaused(false);
    }

    return (
        <>
        <button className={styles.solverButton} onClick={handleOpen}>
            {paused ? (
                <PlayArrowIcon className={styles.pauseIcon} />
            ) : (
                <PauseIcon className={styles.pauseIcon}/>
            )}
        </button>

        <Modal
            open={paused}
            aria-labelledby="pause-modal-title"
            aria-describedby="pause-modal-description"
        >
            <div className={homeStyles.modal}>
                <h2 style={{marginBottom: "0"}} id="pause-modal-title">Your game has been paused</h2>
                <p id="pause-modal-description">Want to keep playing?</p>
                <br />
                <Button 
                    className={styles.continueButton}
                    onClick={handleClose}
                >continue</Button>
            </div>
        </Modal>
        </>
    );
}