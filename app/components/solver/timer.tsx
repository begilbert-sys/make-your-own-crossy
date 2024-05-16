import RestartAltIcon from '@mui/icons-material/RestartAlt';

import styles from "@/styles/Solver.module.css";

import PauseButton from "@/app/components/solver/pausebutton";


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

interface TimerProps {
    timeElapsed: number,
    startTimer: () => void,
    stopTimer: () => void,
    resetTimer: () => void,
}
export default function Timer({timeElapsed, startTimer, stopTimer, resetTimer}: TimerProps) {
    return (
        <div className={styles.timer}>
            <div className={styles.time}>
                {displayTime(timeElapsed)}
            </div>
            <PauseButton 
                startTimer = {startTimer}
                stopTimer = {stopTimer}
                resetTimer = {resetTimer}
            />
            <button className={styles.solverButton}>
                <RestartAltIcon className={styles.pauseIcon}/>
            </button>
        </div>
    )
}