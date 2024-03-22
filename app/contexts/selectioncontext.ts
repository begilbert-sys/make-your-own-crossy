import { createContext } from 'react';
import { Selection } from '@/app/types/selection';
import { Coordinate } from '@/app/types/coordinate';

export interface ISelectionContext {
    selection: Selection,
    setSelection: (f: Selection) => void
};
export const SelectionContext = createContext<ISelectionContext>({
    selection: {coordinate: Coordinate.NONE, direction: "horizontal", focus: true}, 
    setSelection: (s) => {}
});