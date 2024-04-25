
import sql from "@/app/api/db";

const path = require('path');
const querydir = process.cwd() + "/app/api/queries/";

export interface DBMiniRow {
    id: number,
    rand: number,
    content: string
}

function getDBIds(hexID: string): [number, number] {
    const bigIntID = BigInt("0x" + hexID);
    const dbID = Number((bigIntID >> BigInt(32)) & BigInt(0xffffffff));
    const dbRand = Number(bigIntID & BigInt(0xffffffff));
    return [dbID, dbRand];
}

function getHexID(dbID: number, dbRand: number): string {
    const bigIntID = (BigInt(dbID) << BigInt(32)) | BigInt(dbRand);
    return bigIntID.toString(16);
}

export async function add_mini(boardString : string): Promise<string | null> {
    const result = await sql.file(querydir + 'insert.sql', [boardString]) as DBMiniRow[];
    return getHexID(result[0].id, result[0].rand);
}

export async function get_mini(hexID: string): Promise<DBMiniRow[]> {
    const [dbID, dbRand] = getDBIds(hexID);
    const result = await sql.file(querydir + 'select.sql', [dbID, dbRand]) as DBMiniRow[];
    return result;
}