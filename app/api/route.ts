import { NextRequest, NextResponse } from "next/server";

import { add_mini, get_mini } from '@/app/api/orm';

export async function POST(request: NextRequest) {
    if (request.body == null) {
        return new NextResponse("Empty Body", {status: 400});
    }
    const data = await request.text();
    const result = await add_mini(data);
    return new NextResponse(result, {status: 303});
}
