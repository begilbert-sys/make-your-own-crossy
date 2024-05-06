import type { InferGetServerSidePropsType, GetServerSideProps } from 'next';

import { Board } from '@/app/types/board';
import { get_mini } from '@/app/api/orm';

interface IPageParams {
    board: Board,
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const hexID = context.params!.hexID as string;
    const boardString = await get_mini(hexID);
    const board = new Board(boardString);


};

export default function Page({params}: {params: IPageParams}) {

    const boardString = await downloadBoard(params.hexID);
    return <p>{boardString}</p>;
}