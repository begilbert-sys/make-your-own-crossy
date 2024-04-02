'use client';
import { useState, useContext, useEffect } from 'react';

import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CachedIcon from '@mui/icons-material/Cached';

import wordBank from "@/data/wordbank.json"
import styles from '@/styles/Home.module.css';

import { Coordinate } from "@/app/types/coordinate";

import {SelectionContext, ISelectionContext} from '@/app/contexts/selectioncontext';
import {BoardContext, IBoardContext} from '@/app/contexts/boardcontext';

import { shuffleArray } from "@/app/lib/shuffle";

const shuffledWordBank = shuffleArray(wordBank);

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
    const {board, setBoard} = useContext<IBoardContext>(BoardContext);
    const {selection, setSelection} = useContext<ISelectionContext>(SelectionContext);

    const defaultPrompt = '_'.repeat(board.columns);
    const [prompt, setPrompt] = useState<string>(defaultPrompt);
    const [clickCount, setClickCount] = useState<number>(0);

    // update the prompt whenever the selection changes 
    useEffect(() => {
        if (!selection.coordinate.equals(Coordinate.NONE) && board.getCoord(selection.coordinate) !== '.') {
            const selectionWord = board.getSelectionWord(selection);
            if (!selectionWord.equals(Coordinate.NONE)) {
                const currentPrompt = board.getWord(board.getSelectionWord(selection), selection.direction).replaceAll(' ', '_');
                if (prompt !== currentPrompt) {
                    setPrompt(currentPrompt);
                }
            }
        }
    }, [selection]);

    const validWords = shuffledWordBank.filter((word) => wordMatch(prompt.toLowerCase(), word));
    const word = validWords.length === 0 ? 'Couldn\'t find anything :(' : validWords[clickCount % validWords.length].toUpperCase();
    return (
        <div>
            <h3>Feeling Stuck?</h3>
            <p>Use the word finder to think of a word!</p>
            <div className={styles.wordFinderWrapper}>
                <TextField 
                    inputProps={{
                        className: styles.wordFinderInput,
                        maxLength: 8,
                        minLength: 3,
                        autoComplete: "one-time-code" // this disables autocomplete suggestions 
                    }}
                    fullWidth = {true}
                    value = {prompt}
                    onChange = {(e) => setPrompt(e.target.value)}
                    suppressHydrationWarning
                />
                <br/>
                <Button variant="contained" onClick={() => setClickCount(clickCount + 1)}>REGENERATE <CachedIcon /></Button>
                <h2 suppressHydrationWarning>{word}</h2>
            </div>
        </div>
    )
}