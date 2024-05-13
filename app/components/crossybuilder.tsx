'use client';
import { useState, useEffect } from 'react';
import styles from '@/styles/Home.module.css';

import { Coordinates } from '@/app/types/coordinates';
import { Board } from '@/app/types/board';
import { Selection } from '@/app/types/selection';

import { BoardContext } from '@/app/contexts/boardcontext';
import { SelectionContext } from '@/app/contexts/selectioncontext';

import BoardComponent from "@/app/components/boardcomponent";
import DimensionSliders from "@/app/components/dimensionsliders";
import Clues from "@/app/components/clues";
import WordFinder from "@/app/components/wordfinder";
import AutoFill from "@/app/components/autofill";
import Tools from "@/app/components/tools";
import ClearBoard from '@/app/components/clearboard';
import Upload from '@/app/components/upload';


export default function CrossyBuilder() { 
    const [board, setBoard] = useState<Board>(new Board({rows: 5, columns: 5})); // board starts as 5x5 by default  

    const [selection, setSelection] = useState<Selection>({
        coordinates: Coordinates.NONE,
        direction: "across",
        focus: false
    });


    return (
    <>
        {/* Board + Question Lists */}
        <div className={styles.layout}>
            {/* Row and Column sliders */}
            <SelectionContext.Provider value = {{selection, setSelection}}>
                <BoardContext.Provider value = {{board, setBoard}}>
                    <div>
                        <DimensionSliders />
                        <hr/>
                        <Tools />
                        <hr/>
                        <WordFinder />
                        <hr/>
                        <AutoFill />
                    </div>
                    <div className={styles.boardCenterWrapper}>
                        <BoardComponent />
                        <ClearBoard />
                        <Upload/>
                    </div>
                </BoardContext.Provider>
            </SelectionContext.Provider>
        </div>
    </>
    )
}