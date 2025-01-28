import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;
      try {
        const updatedInvoice = await db.invoice.update({
          where: { id: id as string },
          data: {
            status: "PAID",
          },
        });
        return NextResponse.json(updatedInvoice, { status: 200 });
    } catch (error) {
        console.error('Error updating invoice:', error);
        return NextResponse.json({ message: 'Failed to update invoice' }, { status: 500 });
      }
  }

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    try {
      const deletedInvoice = await db.invoice.delete({
        where: { id: id as string },
      });
      return NextResponse.json(deletedInvoice, { status: 200 });
    } catch (error) {
      console.error('Error deleting invoice:', error);
      return NextResponse.json({ message: 'Failed to delete invoice' }, { status: 500 });
    }
  }