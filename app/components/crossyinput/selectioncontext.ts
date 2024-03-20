import { createContext } from 'react';
import {Selection, NO_SELECTION} from '@/app/components/crossyinput/types';
export interface ISelectionContext {
    selection: Selection,
    setSelection: (f: Selection) => void
};
export const SelectionContext = createContext<ISelectionContext>({selection: {coordinate: NO_SELECTION, direction: "horizontal", focus: true}, setSelection: (s) => {}});