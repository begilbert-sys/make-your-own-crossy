'use client';
import { useState } from 'react';
import styles from '@/styles/Home.module.css';

import { Coordinates } from '@/app/types/coordinates';
import { Crossy, CrossyJSON, defaultCrossyJSON } from '@/app/types/crossy';
import { Selection } from '@/app/types/selection';

import { CrossyJSONContext } from '@/app/contexts/crossyjsoncontext';
import { SelectionContext } from '@/app/contexts/selectioncontext';

import Board from "@/app/components/board";
import DimensionSliders from "@/app/components/builder/dimensionsliders";
import ClueBox from "@/app/components/builder/cluebox";
import WordFinder from "@/app/components/builder/wordfinder";
import AutoFill from "@/app/components/builder/autofill";
import Tools from "@/app/components/builder/tools";
import TitlePrompt from "@/app/components/builder/titleprompt";
import ClearBoard from '@/app/components/clearboard';
import Upload from '@/app/components/builder/upload';


export default function CrossyBuilder() { 
    const [crossyJSON, setCrossyJSON] = useState<CrossyJSON>(defaultCrossyJSON); // board starts as 5x5 by default  

    const [selection, setSelection] = useState<Selection>({
        coordinates: Coordinates.NONE,
        direction: "across",
        focus: false
    });
    console.log(crossyJSON);

    return (
    <>
        {/* Board + Question Lists */}
        <div className={styles.layout}>
            <SelectionContext.Provider value = {{selection, setSelection}}>
            <CrossyJSONContext.Provider value = {{crossyJSON, setCrossyJSON}}>
                <div className={styles.sidebarWrapper}>
                    <Tools />
                    <hr />
                    <DimensionSliders />
                    <hr/>
                    <AutoFill />
                    <hr/>
                    <WordFinder />
                </div>
                <div>
                    <TitlePrompt />
                    <div className={styles.layout}>
                        <div className={styles.boardCenterWrapper}>
                            <Board
                                buildMode = {true}
                            />
                            <div className={styles.bottomButtons}>
                                    <ClearBoard />
                                    <Upload/>
                            </div>
                        </div>
                        <ClueBox 
                            direction = {"across"}
                        />
                        <ClueBox 
                            direction = {"down"}
                        />
                    </div>
                </div>
            </CrossyJSONContext.Provider>
            </SelectionContext.Provider>
        </div>
    </>
    )
}