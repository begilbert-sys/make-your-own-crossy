'use client';
import { useState } from 'react';
import styles from '@/styles/Home.module.css';

import { Coordinates } from '@/app/types/coordinates';
import { Board } from '@/app/types/board';
import { Selection } from '@/app/types/selection';
import { Clues } from '@/app/types/clues';

import { BoardContext } from '@/app/contexts/boardcontext';
import { SelectionContext } from '@/app/contexts/selectioncontext';

import BoardComponent from "@/app/components/boardcomponent";
import DimensionSliders from "@/app/components/builder/dimensionsliders";
import ClueBox from "@/app/components/builder/cluebox";
import WordFinder from "@/app/components/builder/wordfinder";
import AutoFill from "@/app/components/builder/autofill";
import Tools from "@/app/components/tools";
import ClearBoard from '@/app/components/clearboard';
import Upload from '@/app/components/builder/upload';


export default function CrossyBuilder() { 
    const [board, setBoard] = useState<Board>(new Board({rows: 5, columns: 5})); // board starts as 5x5 by default  

    const [selection, setSelection] = useState<Selection>({
        coordinates: Coordinates.NONE,
        direction: "across",
        focus: false
    });

    const [clues, setClues] = useState<Clues>({
        across: new Array<string>(board.getWordList("across").length).fill(""), 
        down: new Array<string>(board.getWordList("down").length).fill("")
    });


    return (
    <>
        {/* Board + Question Lists */}
        <div className={styles.layout}>
            <SelectionContext.Provider value = {{selection, setSelection}}>
            <BoardContext.Provider value = {{board, setBoard}}>
                <div>
                    <DimensionSliders />
                    <hr/>
                    <AutoFill />
                    <hr/>
                    <WordFinder />
                </div>
                <div className={styles.boardCenterWrapper}>
                    <BoardComponent />
                    <ClearBoard />
                    <Upload
                        clues = {clues}
                    />
                </div>
                <ClueBox 
                    clues = {clues}
                    setClues = {setClues}
                    direction = {"across"}
                />
                <ClueBox 
                    clues = {clues}
                    setClues = {setClues}
                    direction = {"down"}
                />
            </BoardContext.Provider>
            </SelectionContext.Provider>
        </div>
    </>
    )
}