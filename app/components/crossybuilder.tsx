'use client';
import {useState} from 'react';
import styles from '@/styles/Home.module.css';

import Board from "@/app/components/board";
import Across from "@/app/components/across";
import {BoardContext, IBoardContext} from '@/app/components/boardcontext';

export default function CrossyBuilder() {
    const defaultBoard = Array(5).fill(Array(5).fill(' '));
    const [board, setBoard] = useState<string[][]>(defaultBoard);
    return (
    <div className={styles.layout}>
        <BoardContext.Provider value = {{board, setBoard}}>
            <Board rows={5} columns={5} />
        </BoardContext.Provider>
        
        <Across itemCount = {5} />
        <Across itemCount = {5} />
    </div>
    )
}