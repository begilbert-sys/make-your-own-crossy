import {useContext} from 'react';
import {Coordinate} from '@/app/components/types';
import {SelectionContext, ISelectionContext} from '@/app/components/selectioncontext';
interface ICluesProps {
    title: string,
    items: Coordinate[],
}
export default function Clues({title, items}: ICluesProps) {
    const {selection, setSelection} = useContext<ISelectionContext>(SelectionContext);
    const reFocus = (index: number) => {
        setSelection({
            coordinate: items[index],
            direction: title === "ACROSS" ? "horizontal" : "vertical",
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