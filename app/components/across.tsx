export default function Across({itemCount}: {itemCount: number}) {
    let hintList = [];
    for (let i = 0; i < itemCount; i++) {
        hintList.push(<li key={i}><input type="text" /></li>)
    }
    return (
        <div>
            <h2><b>ACROSS</b></h2>
            <ol className="list-decimal">
                {hintList}
            </ol>
        </div>
    )
}