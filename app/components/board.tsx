'use client';
import { useState } from 'react';
import { BoardContext } from '@/app/components/boardcontext';
import Square from '@/app/components/square';


export default function Board() {
    const [focus, setFocus] = useState(0);
    const squareArray = [];
    for (let i = 0; i < 3; i++){
        squareArray.push(
            <Square index={i} key={i} focus = {focus} setFocus={setFocus} />
        );
    }
    return (
    <div>
        <div className="flex">
            {squareArray}
        </div>
        <div className="flex">
            <Square index={4} focus = {focus} setFocus={setFocus} />
            <Square index={5} focus = {focus} setFocus={setFocus} />
            <Square index={6} focus = {focus} setFocus={setFocus} />
        </div>
        <div className="flex">
            <Square index={7} focus = {focus} setFocus={setFocus} />
            <Square index={8} focus = {focus} setFocus={setFocus} />
            <Square index={9} focus = {focus} setFocus={setFocus} />
        </div>
    </div>
    );
  }
  