import { createContext } from 'react';
export interface IBoardContext {
    board: string[][],
    setBoard: (b: string[][]) => void
};
export const BoardContext = createContext<IBoardContext>({board: [[]], setBoard: (s: string[][]) => {}});
