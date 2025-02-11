import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    if (!id) {
      return NextResponse.json({ message: "Customer ID is required" }, { status: 400 });
    }

    const customer = await db.customers.findUnique({
      where: { id },
      include: {
        invoices: true,
      },
    });

    if (!customer) {
      return NextResponse.json({ message: "Customer not found" }, { status: 404 });
    }

    console.log("Customer Data:", customer);
    return NextResponse.json(customer, { status: 200 });

  } catch (error: any) {
    console.error("Error fetching customer:", error);
    return NextResponse.json({ message: "Failed to fetch customer", error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  try {
    if (!id) {
      return NextResponse.json({ message: "Customer ID is required" }, { status: 400 });
    }

    const deletedCustomer = await db.customers.delete({
      where: { id },
    });

    if (!deletedCustomer) {
      return NextResponse.json({ message: "Customer not found" }, { status: 404 });
    }

    return NextResponse.json(deletedCustomer, { status: 200 });

  } catch (error: any) {
    console.error("Error deleting customer:", error);
    return NextResponse.json({ message: "Failed to delete customer", error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    const { customerName, customerEmail, customerAddress } = await request.json();

    const updatedCustomer = await db.customers.update({
      where: { id },
      data: {
        customerName,
        customerEmail,
        customerAddress,
      },
    });

    await db.invoice.updateMany({
      where: { customerId: id },
      data: {
        clientName: customerName,
        clientEmail: customerEmail,
        clientAddress: customerAddress,
      },
    });

    return NextResponse.json(
      { message: "Customer and invoices updated successfully", data: updatedCustomer },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating customer and invoices:", error);
    return NextResponse.json(
      { error: "Failed to update customer and invoices" },
      { status: 500 }
    );
  }
}
