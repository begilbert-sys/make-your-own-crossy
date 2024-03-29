'use client';
import {useState} from 'react';
import styles from '@/styles/Home.module.css';

import { Coordinate } from '@/app/types/coordinate';
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


export default function CrossyBuilder() { 
    const [board, setBoard] = useState<Board>(new Board(5, 5)); // board starts as 5x5 by default  

    const [selection, setSelection] = useState<Selection>({
        coordinate: Coordinate.NONE,
        direction: "horizontal",
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
                    </div>
                    <div className={styles.thing}>
                    <BoardComponent />
                    <AutoFill />
                    </div>
                    <Clues />
                </BoardContext.Provider>
            </SelectionContext.Provider>
        </div>
    </>
    )
}