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
  
      const lastCustomer = await db.customers.findFirst({
        orderBy: { customerNumber: "desc" },
        select: { customerNumber: true },
      });
  
      let newCustomerNumber = 1;
      if (lastCustomer?.customerNumber) {
        const lastIdNumber = parseInt(lastCustomer.customerNumber.split("-")[1]);
        newCustomerNumber = lastIdNumber + 1;
      }
  
      const generatedCustomerNumber = `CUS-${String(newCustomerNumber).padStart(3, "0")}`;
  
      const newCustomer = await db.customers.create({
        data: {
          customerName: customer.customerName,
          customerEmail: customer.customerEmail,
          customerAddress: customer.customerAddress,
          customerNumber: generatedCustomerNumber, 
        },
      });
  
      return NextResponse.json(newCustomer, { status: 200 });
    } catch (error) {
      console.error("Error creating customer:", error);
      return NextResponse.json({ message: "Failed to create customer" }, { status: 500 });
    }
  }