'use client';
import { useState, useEffect } from 'react';

import styles from '@/styles/Home.module.css';


import { useStopwatch } from "@/app/hooks/usetimer";

import { Crossy, CrossyJSON } from '@/app/types/crossy';
import { Coordinates } from '@/app/types/coordinates';
import { Selection } from '@/app/types/selection';


import { CrossyJSONContext } from '@/app/contexts/crossyjsoncontext';
import { SelectionContext } from '@/app/contexts/selectioncontext';

import Header from "@/app/components/header";
import Board from "@/app/components/board";
import CompletionModal from "@/app/components/solver/completionmodal";
import Controls from "@/app/components/solver/controls";
import Title from "@/app/components/solver/title";

import Clues from "@/app/components/solver/clues";

import Timer from "@/app/components/solver/timer";


interface CrossySolverProps {
    solvedCrossyJSON: CrossyJSON
}
export default function CrossySolver({solvedCrossyJSON}: CrossySolverProps) {
    const solvedCrossy = new Crossy(solvedCrossyJSON);
    const clearedCrossy = new Crossy(solvedCrossyJSON);
    clearedCrossy.clear();
    const [crossyJSON, setCrossyJSON] = useState<CrossyJSON>(clearedCrossy.toJSON());
    const [selection, setSelection] = useState<Selection>({
        coordinates: Coordinates.NONE,
        direction: "across",
        focus: false
    });

    const {timeElapsed, startTimer, stopTimer, resetTimer} = useStopwatch();
    
    // start the timer on the first render
    useEffect(() => startTimer(), []);

    // check if the crossword has been completed
    const [completed, setCompleted] = useState<boolean>(false);
    

    return (
        <>
        
        <Header />
        <SelectionContext.Provider value = {{selection, setSelection}}>
        <CrossyJSONContext.Provider value = {{crossyJSON, setCrossyJSON}}>
        <CompletionModal 
            solvedCrossyJSON = {solvedCrossyJSON}
            timeElapsed = {timeElapsed}
            startTimer = {startTimer}
            stopTimer = {stopTimer}

        />
        <div className={styles.layout}>
            <div className={styles.sidebarWrapper}>
                <Title />
                <hr />
                <Timer
                    timeElapsed = {timeElapsed}
                    startTimer = {startTimer}
                    stopTimer = {stopTimer}
                    resetTimer = {resetTimer}
                />
                <hr />
                <Controls />
                <hr />
            </div>
            <div>
                <Board
                    buildMode = {false}
                />
            </div>
            <Clues 
                direction = {"across"}
            />
            <Clues
                direction = {"down"}
            />
        </div>
        </CrossyJSONContext.Provider>
        </SelectionContext.Provider>
        </>
    )
}