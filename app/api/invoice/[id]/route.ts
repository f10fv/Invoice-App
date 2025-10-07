import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    const status = await req.json();
    console.log("this the status", status)
      try {
        const updatedInvoice = await db.invoice.update({
          where: { id: id as string },
          data: {
            status: status.status,
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


export async function GET(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    try {
      const invoice = await db.invoice.findUnique({
        where: { id: id as string },
        include: {
          invoiceItems: true,
          customer: true,
          project: true,
        },
      });
      return NextResponse.json(invoice, { status: 200 });
    } catch (error) {
      console.error('Error fetching invoice:', error);
      return NextResponse.json({ message: 'Failed to fetch invoice' }, { status: 500 });
    }
  }

  interface InvoiceItem {
    id: number;
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }
  
  interface Invoice {
    invoiceNumber: string;
    currency: string;
    fromName: string;
    fromEmail: string;
    fromAddress: string;
    clientName: string;
    clientEmail: string;
    clientAddress: string;
    date: string;
    dueDate: string;
    invoiceItems: InvoiceItem[];
    invoiceItemDescription: string;
    invoiceItemQuantity: number;
    invoiceItemRate: number;
    note: string;
    total: number;
    projectId: string
    customerId: string
  }  
  export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const { id } = params
    const { invoice, action } = await req.json()
    console.log("Edit Invoice data:", { invoice, action })
  
    const parseInvoiceNumber = isNaN(Number.parseInt(invoice.invoiceNumber))
      ? null
      : Number.parseInt(invoice.invoiceNumber)
    const parseDueDate = isNaN(Number.parseInt(invoice.dueDate)) ? null : Number.parseInt(invoice.dueDate)
    const client = await db.customers.findFirst({
      where: { customerEmail: invoice.clientEmail },
      select: { id: true },
    })
    const formattedDate = new Date(invoice.date).toISOString();

    try {
      const updatedInvoice = await db.invoice.update({
        where: { id },
        data: {
          invoiceNumber: invoice.invoiceNumber,
          currency: invoice.currency,
          fromName: invoice.fromName,
          fromEmail: invoice.fromEmail,
          fromAddress: invoice.fromAddress,
          clientName: invoice.clientName,
          clientEmail: invoice.clientEmail,
          clientAddress: invoice.clientAddress,
          customerId: client?.id,
          projectId: invoice.projectId,
          date: formattedDate,
          dueDate: parseDueDate ?? 0,
          note: invoice.note,
          total: invoice.total,
          status: "PENDING",
          invoiceItems: {
            deleteMany: {},
            create: invoice.invoiceItems.map((item: any) => ({
              description: item.description,
              quantity: Number(item.quantity),
              rate: Number(item.rate),
              amount: Number(item.amount),
            })),
          },
        },
        include: {
          customer: true,
          project: true,
          invoiceItems: true,
        },
      })
  
      return NextResponse.json(updatedInvoice, { status: 200 })
    } catch (error) {
      console.error("Error updating invoice:", error)
      return NextResponse.json({ message: "Failed to update invoice" }, { status: 500 })
    }
  }
  
  