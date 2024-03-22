import { useState } from 'react';

import wordBank from "@/data/wordbank.json"
import styles from '@/styles/Home.module.css';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CachedIcon from '@mui/icons-material/Cached';

function wordMatch(prompt: string, word: string): boolean {
    if (prompt.length != word.length) {
        return false;
    }
    for (let i = 0; i < prompt.length; i++) {
        if (prompt[i] !== '_' && prompt[i] !== word[i]) {
            return false;
        }
    }
    return true;
}
export default function WordFinder() {
    const [prompt, setPrompt] = useState<string>("CR__S");
    const [clickCount, setClickCount] = useState<number>(0);
    const validWords = wordBank.filter((word) => wordMatch(prompt.toLowerCase(), word));
    const word = validWords.length === 0 ? 'Couldn\'t find anything :(' : validWords[clickCount % validWords.length].toUpperCase();
    return (
        <div>
            <h3>Feeling Stuck?</h3>
            <p>Use the word finder to think of a word!</p>
            <br />
            <div className={styles.wordFinderWrapper}>
                <TextField 
                    inputProps={{
                        className: styles.wordFinderInput,
                        maxLength: 8,
                        minLength: 3,
                        autocomplete: "one-time-code"
                    }}
                    fullWidth = {true}
                    value = {prompt}
                    onChange = {(e) => setPrompt(e.target.value)}
                />
                <br />
                <Button variant="contained" onClick={() => setClickCount(clickCount + 1)}>REGENERATE <CachedIcon /></Button>
                <h2>{word}</h2>
            </div>
        </div>
    )
}