interface IPageParams {
    hexid: string
}
export default function Page({params}: {params: IPageParams}) {
    return <p>{params.hexid}</p>;
}