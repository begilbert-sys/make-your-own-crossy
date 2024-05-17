import { useRef, useState } from 'react';

export function useStopwatch() {
    const [timeElapsed, setTimeElapsed] = useState<number>(0);
    const requestRef = useRef<number>();
    const previousTimeRef = useRef<number>();

    const animate = (time: number) => {
        if (previousTimeRef.current != undefined) {
            const deltaTime = time - previousTimeRef.current ;
            setTimeElapsed((prevTimeElapsed) => prevTimeElapsed + deltaTime);
        }
        previousTimeRef.current = time;
        requestRef.current = requestAnimationFrame(animate);
    };

    function stopTimer() {
        previousTimeRef.current = undefined;
        cancelAnimationFrame(requestRef.current!);
    }

    function startTimer() {
        cancelAnimationFrame(requestRef.current!);
        requestRef.current = requestAnimationFrame(animate);
    }

    function resetTimer() {
        setTimeElapsed(0);
        startTimer();
    }

    return { timeElapsed, startTimer, stopTimer, resetTimer };
}