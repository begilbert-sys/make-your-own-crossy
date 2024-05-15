import { get_mini } from '@/app/api/orm';

import { Crossy, CrossyJSON } from '@/app/types/crossy';

import { notFound } from 'next/navigation'

import CrossySolver from "@/app/components/solver/crossysolver";

interface PageParams {
    params: { hexID: string }
}

export default async function Page({ params }: PageParams) {
    const crossyJSON = await get_mini(params.hexID) as CrossyJSON | undefined;

    // 404 if a crossword couldn't be found in the DB
    if (crossyJSON == undefined) {
        notFound();
    }


    return (
        <p>{JSON.stringify(crossyJSON)}</p>
    );
}