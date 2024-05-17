import { get_mini } from '@/app/api/orm';

import { Crossy, CrossyJSON } from '@/app/types/crossy';

import { notFound } from 'next/navigation'

import CrossySolver from "@/app/components/solver/crossysolver";

function isValidHex(hexString: string) {
    /* check if a string is a valid hex representation */
    return /^[0-9a-fA-F]+$/.test(hexString);
}

interface PageParams {
    params: { hexID: string }
}

export default async function Page({ params }: PageParams) {
    if (!isValidHex(params.hexID)) {
        notFound();
    }
    const crossyJSON = await get_mini(params.hexID) as CrossyJSON | undefined;
    // 404 if a crossword couldn't be found in the DB
    if (crossyJSON == undefined) {
        notFound();
    }

    return (
        <CrossySolver 
            solvedCrossyJSON = {crossyJSON}
        />
    );
}