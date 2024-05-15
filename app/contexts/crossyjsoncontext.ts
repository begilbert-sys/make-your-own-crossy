import { createContext } from 'react';
import { defaultCrossyJSON, CrossyJSON } from '@/app/types/crossy'; 

export interface ICrossyJSONContext {
    crossyJSON: CrossyJSON,
    setCrossyJSON: (c: CrossyJSON) => void
};
export const CrossyJSONContext = createContext<ICrossyJSONContext>({
    crossyJSON: defaultCrossyJSON, 
    setCrossyJSON: (c: CrossyJSON) => {}
});
