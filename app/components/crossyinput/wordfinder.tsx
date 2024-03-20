import wordBank from "@/data/wordbank.json"
import styles from '@/styles/Home.module.css';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

export default function WordFinder() {
    
    return (
        <div>
            <h2>Feeling Stuck?</h2>
            <p>Use the word finder to think of a word!</p>
            <br />
            <div className={styles.wordFinderWrapper}>
                <TextField 
                    inputProps={{className: styles.wordFinderInput}}
                    fullWidth = {true}
                />
                <br />
                <Button variant="contained">GENERATE</Button>
            </div>
        </div>
    )
}