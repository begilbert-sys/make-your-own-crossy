import {useContext} from 'react';
import {Coordinate, wordselection} from '@/app/components/types';
import {SelectionContext, ISelectionContext} from '@/app/components/selectioncontext';
interface ICluesProps {
    title: string,
    items: Coordinate[],
}
export default function clues({title, items}: ICluesProps) {
    const {selection, setSelection} = useContext<ISelectionContext>(SelectionContext);
    const reFocus = (index: number) => {
        setSelection({
            coordinate: items[index],
            direction: selection.direction,
            focus: false
        });

    }
    let clueList = [];
    for (let i = 0; i < items.length; i++) {
        clueList.push(<li key={i}><input type="text" onSelect = {() => reFocus(i)}/></li>)
    }
    return (
        <div>
            <h2><b>{title}</b></h2>
            <ol className="list-decimal">
                {clueList}
            </ol>
        </div>
    )
}