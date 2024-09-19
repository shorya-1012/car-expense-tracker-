import { db } from "@/lib/db";
import { addExpenseValidator } from "@/lib/validators";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: Request) {
    const { userId } = auth();
    if (!userId) {
        return NextResponse.json({ error: "Unautorized" }, { status: 404 });
    }
    const body = await req.json();

    try {
        const { type, spending, date } = addExpenseValidator.parse(body);

        const _ = await db.expense.create({
            data: {
                type: type,
                spending: spending,
                date: date,
                userId: userId
            }
        })

        return NextResponse.json({ ok: true }, { status: 200 });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error }, { status: 422 })
        }
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
