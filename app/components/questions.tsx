interface IQuestionsProps {
    title: string,
    itemCount: number
}
export default function Questions({title, itemCount}: IQuestionsProps) {
    let hintList = [];
    for (let i = 0; i < itemCount; i++) {
        hintList.push(<li key={i}><input type="text" /></li>)
    }
    return (
        <div>
            <h2><b>{title}</b></h2>
            <ol className="list-decimal">
                {hintList}
            </ol>
        </div>
    )
}