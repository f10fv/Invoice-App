import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
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


export async function GET(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    try {
      const invoice = await db.invoice.findUnique({
        where: { id: id as string },
        include: {
          invoiceItems: true,
        },
      });
      console.log("This the invoice" ,invoice);
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
    invoiceName: string;
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
  }
  export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    const invoice: Invoice = await req.json();
    console.log("Invoice data:", invoice);
  
    const parseInvoiceNumber = isNaN(parseInt(invoice.invoiceNumber))
      ? null
      : parseInt(invoice.invoiceNumber);
    const parseDueDate = isNaN(parseInt(invoice.dueDate))
      ? null
      : parseInt(invoice.dueDate);
  
    try {
      const updatedInvoice = await db.invoice.update({
        where: { id },
        data: {
          invoiceName: invoice.invoiceName,
          invoiceNumber: invoice.invoiceNumber,        
          currency: invoice.currency,
          fromName: invoice.fromName,
          fromEmail: invoice.fromEmail,
          fromAddress: invoice.fromAddress,
          clientName: invoice.clientName,
          clientEmail: invoice.clientEmail,
          clientAddress: invoice.clientAddress,
          date: new Date(invoice.date),
          dueDate: parseDueDate ?? 0,
          note: invoice.note,
          total: invoice.total,
          status: "PENDING",
          invoiceItems: {
            updateMany: invoice.invoiceItems.map((item, index) => ({
              where: { id: item.id },
              data: {
                description: item.description,
                quantity: item.quantity,
                rate: item.rate,
                amount: item.amount,
              },
            })),
          },
        },
      });
  
      return NextResponse.json(updatedInvoice, { status: 200 });
    } catch (error) {
      console.error('Error updating invoice:', error);
      return NextResponse.json({ message: 'Failed to update invoice' }, { status: 500 });
    }
  }
  