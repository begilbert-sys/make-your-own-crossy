import RefObject, { useEffect } from 'react';

import { Coordinates } from '@/app/types/coordinates';
import { Selection } from '@/app/types/selection';

/* 
This hook is used to remove focus from the board whenever the user
clicks anywhere outside of the board 
*/

function isClickable(target: EventTarget | null) {
    /* 
    return true if the element is a button or an input 
    */
    return (
        (target as Element).closest("button") // if clicking a button
        || (target instanceof HTMLTextAreaElement) // if clicking a textbox
    );
}

export function useOutsideClick(ref: RefObject.RefObject<HTMLDivElement>, setSelection: (f: Selection) => void) {
    /*
    When the user clicks anywhere outside of the board, the board's selection is de-focused
    */
    useEffect(() => {
        function handleClickOutside(event: globalThis.MouseEvent) {
            // clicking certain elements (buttons and inputd) shouldn't de-focus
            if (ref.current && !ref.current.contains(event.target as Node) && !(isClickable(event.target))) {
                // reset the selection / focus to nothing 
                setSelection({
                    coordinates: Coordinates.NONE,
                    direction: "across",
                    focus: false
                })
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref]);

}