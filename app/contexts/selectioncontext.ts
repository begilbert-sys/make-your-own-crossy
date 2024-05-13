import { createContext } from 'react';
import { Selection } from '@/app/types/selection';
import { Coordinates } from '@/app/types/coordinates';

export interface ISelectionContext {
    selection: Selection,
    setSelection: (f: Selection) => void
};
export const SelectionContext = createContext<ISelectionContext>({
    selection: {coordinates: Coordinates.NONE, direction: "across", focus: false}, 
    setSelection: (s) => {}
});