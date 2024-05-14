'use client';
import { useState } from 'react';
import styles from '@/styles/Home.module.css';

import { Board } from '@/app/types/board';
import { Coordinates } from '@/app/types/coordinates';
import { Selection } from '@/app/types/selection';
import { Clues } from '@/app/types/clues';
import { Mini } from '@/app/types/mini';


import { BoardContext } from '@/app/contexts/boardcontext';
import { SelectionContext } from '@/app/contexts/selectioncontext';

import BoardComponent from "@/app/components/boardcomponent";


interface CrossySolverProps {
    mini: Mini
}
export default function CrossySolver({mini}: CrossySolverProps) {
    const solvedBoard = new Board(mini.boardString);
    const clearedBoard = new Board({rows: solvedBoard.rows, columns: solvedBoard.columns, oldBoard: solvedBoard});
    clearedBoard.clear();
    const [board, setBoard] = useState<Board>(clearedBoard);
    const [selection, setSelection] = useState<Selection>({
        coordinates: Coordinates.NONE,
        direction: "across",
        focus: false
    });
    return (
        <div className={styles.layout}>
            <SelectionContext.Provider value = {{selection, setSelection}}>
            <BoardContext.Provider value = {{board, setBoard}}>
                <BoardComponent />

            </BoardContext.Provider>
            </SelectionContext.Provider>
        </div>
    )
}