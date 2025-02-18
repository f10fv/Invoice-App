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

export async function POST(request: Request) {
    try {
     const customer = await request.json();
     const newCustomer = await db.customers.create({
        data: {
            customerName: customer.customerName,
            customerEmail: customer.customerEmail,
            customerAddress: customer.customerAddress
        }
     })
     return NextResponse.json(newCustomer, { status: 200 });
    } catch (error) {
        console.error("Error creating customer:", error);
        return NextResponse.json({ message: "Failed to create customer" }, { status: 500 });
    }
}