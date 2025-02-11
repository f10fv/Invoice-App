import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const customers = await db.customers.findMany();
        return NextResponse.json(customers, { status: 200 });
    } catch (error) {
        console.error("Error fetching customers:", error);
        return NextResponse.json({ message: "Failed to fetch customers" }, { status: 500 });
    }
}
