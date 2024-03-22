import { createContext } from 'react';
import { Board } from '@/app/types/board'; 

export interface IBoardContext {
    board: Board,
    setBoard: (b: Board) => void
};
export const BoardContext = createContext<IBoardContext>({
    board: new Board(5, 5), 
    setBoard: (b: Board) => {}
});
