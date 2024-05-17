import { useState, useContext, useEffect } from 'react';

import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";

import homeStyles from "@/styles/Home.module.css";

import styles from "@/styles/Solver.module.css";


import { Crossy, CrossyJSON } from '@/app/types/crossy';
import { Coordinates } from '@/app/types/coordinates';
import { Selection } from '@/app/types/selection';


import { CrossyJSONContext, ICrossyJSONContext } from '@/app/contexts/crossyjsoncontext';
function displayTime(time: number) {
    const elapsed_seconds = time / 1000;
    const minutes = Math.floor(elapsed_seconds / 60);
    const seconds = Math.floor(elapsed_seconds % 60);
    if (seconds < 10) {
        return minutes + ":0" + seconds;
    } else {
        return minutes + ":" + seconds;
    }
}

interface CompletionModalProps {
    solvedCrossyJSON: CrossyJSON
    timeElapsed: number
    startTimer: () => void,
    stopTimer: () => void
}
export default function CompletionModal({solvedCrossyJSON, timeElapsed, startTimer, stopTimer}: CompletionModalProps) {
    const {crossyJSON, setCrossyJSON} = useContext<ICrossyJSONContext>(CrossyJSONContext);

    // openModal is true by default so that as soon as the crossword is completed,
    // the modal will open. 

    const [openFilledModal, setOpenFilledModal] = useState<boolean>(true);
    const [openCompletedModal, setOpenCompletedModal] = useState<boolean>(true);

    // if the crossword contains no blank spaces
    const filled = !crossyJSON.boardString.includes(Crossy.BLANK);

    const handleFillClose = () => {
        setOpenFilledModal(false);
    }

    // if the crossword is filled correctly 
    const completed = solvedCrossyJSON.boardString === crossyJSON.boardString;
    const handleCompletedClose = () => {
        setOpenCompletedModal(false);
    }

    useEffect(() => {
        if (completed) {
            stopTimer();
        }
    }, [crossyJSON]);


    if (completed) {
        return (
            <Modal
                open={openCompletedModal}
                onClose={handleCompletedClose}
                aria-labelledby="completed-modal-title"
                aria-describedby="completed-modal-description"
            >
            <div className={homeStyles.modal}>
                <h2 style={{marginBottom: "0"}} id="completed-modal-title">Congratulations!</h2>
                <p id="completed-modal-description">You completed the mini crossword in</p>
                <h1>{displayTime(timeElapsed)}</h1>
                <br />
                <Button 
                    className={styles.continueButton}
                    onClick={handleCompletedClose}
                >continue</Button>
            </div>
        </Modal>
        )
    }
    else if (filled) {
        return (
            <Modal
                open={openFilledModal}
                onClose={handleFillClose}
                aria-labelledby="filled-modal-title"
                aria-describedby="filled-modal-description"
            >
            <div className={homeStyles.modal}>
                <h2 style={{marginBottom: "0"}} id="filled-modal-title">Uh-Oh!</h2>
                <p id="filled-modal-description">At least one square is incorrect! Want to keep trying?</p>
                <br />
                <Button 
                    className={styles.continueButton}
                    onClick={handleFillClose}
                >continue</Button>
            </div>
        </Modal>
        )
    }
}