import { createContext } from 'react';
interface IBoardContext {
    board: string[],
    setBoard: (b: string[]) => void
};
const boardContextImplementation : IBoardContext = {
    board: Array(9).fill(' '),
    setBoard: (b: string[]) => {}
}
export const BoardContext = createContext<IBoardContext>(boardContextImplementation);