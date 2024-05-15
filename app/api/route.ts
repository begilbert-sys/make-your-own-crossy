import { NextRequest, NextResponse } from "next/server";

import { add_mini, get_mini } from '@/app/api/orm';

import { CrossyJSON } from "@/app/types/crossy";

export async function GET(request: NextRequest) {
    if (request.text == null) {
        return new NextResponse("Empty Body", {status: 400});
    }
    const hexID = await request.text();
    const result = await get_mini(hexID);
    return new NextResponse(JSON.stringify(result), {status: 200});

}
export async function POST(request: NextRequest) {
    if (request.json == null) {
        return new NextResponse("Empty Body", {status: 400});
    }
    const crossyJSON = await request.json() as CrossyJSON;
    const hexID = await add_mini(crossyJSON);
    return new NextResponse(hexID, {status: 201});
}

