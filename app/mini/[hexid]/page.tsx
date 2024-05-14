import { get_mini } from '@/app/api/orm';

import { Board } from '@/app/types/board';
import { Mini } from '@/app/types/mini';


import CrossySolver from "@/app/components/solver/crossysolver";
interface PageParams {
    params: { hexID: string}
}


export default async function Page({ params }: PageParams) {
    const DBRow = await get_mini("46fa4b672");
    const mini: Mini = {
        boardString: DBRow.content, 
        acrossClues: DBRow.across_clues,
        downClues: DBRow.down_clues
    }
    return (
        <CrossySolver 
            mini={mini}
        />
    );
}