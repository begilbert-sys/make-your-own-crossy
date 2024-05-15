
import sql from "@/app/api/db";

import { CrossyJSON } from '@/app/types/crossy';


const path = require('path');
const querydir = process.cwd() + "/app/api/queries/";
/* Each row in the DB consists of the following: */
export interface DBMiniRow {
    id: number, // the serial ID
    rand: number, // a random integer, generated when the row is inserted
    title: string, // title of the puzzle
    author: string, // author of the puzzle
    content: string, // the content of the board
    across_clues: string[], // the across clues 
    down_clues: string[] // the down clues 
}
/* using the ID and the rand, a hex ID is generated to be used as the URL */


function getDBIds(hexID: string): [number, number] {
    /* given a hex ID, return the row's ID and random */
    const bigIntID = BigInt("0x" + hexID);
    const dbID = Number((bigIntID >> BigInt(32)) & BigInt(0xffffffff));
    const dbRand = Number(bigIntID & BigInt(0xffffffff));
    return [dbID, dbRand];
}

function getHexID(dbID: number, dbRand: number): string {
    /* given a row's ID and random, return its hex ID */
    const bigIntID = (BigInt(dbID) << BigInt(32)) | BigInt(dbRand);
    return bigIntID.toString(16);
}

export async function add_mini(crossyJSON: CrossyJSON): Promise<string> {
    /* add a mini to the DB and return iuts generated hex ID */
    const result = (await sql.file(
        querydir + 'insert.sql', 
        [crossyJSON.title, crossyJSON.author, crossyJSON.boardString, crossyJSON.acrossClues, crossyJSON.downClues]
    ) as DBMiniRow[])[0];

    return getHexID(result.id, result.rand);
}

export async function get_mini(hexID: string): Promise<CrossyJSON | undefined> {
    /* get a mini from the DB based on its hex ID */
    const [dbID, dbRand] = getDBIds(hexID);
    const row = (await sql.file(querydir + 'select.sql', [dbID, dbRand]) as DBMiniRow[])[0];
    if (row == undefined) {
        return undefined;
    }
    const crossyJSON = {
        title: row.title,
        author: row.author,
        boardString: row.content,
        acrossClues: row.across_clues,
        downClues: row.down_clues
    }
    return crossyJSON;
}