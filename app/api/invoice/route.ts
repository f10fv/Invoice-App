import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendInvoiceEmail } from "@/lib/mail";
import jsPDF from "jspdf";

interface InvoiceItem {
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

export async function POST(request: Request) {
  try {
    const invoice: Invoice = await request.json();
    console.log("Invoice data:", invoice);

    const parseInvoiceNumber = isNaN(parseInt(invoice.invoiceNumber))
      ? null
      : parseInt(invoice.invoiceNumber);
    const parseDueDate = isNaN(parseInt(invoice.dueDate))
      ? null
      : parseInt(invoice.dueDate);

    console.log("Invoice items:", invoice.invoiceItems);

    const newInvoice = await db.invoice.create({
      data: {
        invoiceName: invoice.invoiceName,
        invoiceNumber: parseInvoiceNumber !== null ? parseInvoiceNumber : 0,        
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
          create: invoice.invoiceItems.map((item) => ({
            description: item.description,
            quantity: item.quantity,
            rate: item.rate,
            amount: item.amount,
          })),
        },
      },
    });

    const invoiceNumberString = JSON.stringify(parseInvoiceNumber);
    const invoiceTotalString = JSON.stringify(invoice.total);
    const invoiceCurrencyNumber = invoice.currency; 

    const parsedDate = new Date(invoice.date);
    const parsedDueDate = new Date(invoice.dueDate);

    if (isNaN(parsedDate.getTime()) || isNaN(parsedDueDate.getTime())) {
      console.error("Invalid date format:", invoice.date, invoice.dueDate);
    }

    await sendInvoiceEmail(
      invoice.clientEmail, // email
      invoice.clientName, // clientName
      invoice.clientAddress, // clientAddress
      invoice.fromName, // fromName
      invoice.fromAddress, // fromAddress
      invoice.fromEmail, // fromEmail
      invoice.invoiceName, // invoiceName
      invoice.note, // note
      invoice.currency, // currency
      invoice.invoiceNumber, // invoiceNumber
      invoice.dueDate, // dueDate
      new Date(invoice.date).toLocaleDateString(), // invoiceDate
      invoice.invoiceItems, // invoiceItems
      invoice.total // totalAmount
    );

    return NextResponse.json(
      { message: "Invoice created successfully", data: newInvoice },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating invoice:", error);
    return NextResponse.json(
      { error: "Failed to create invoice" },
      { status: 500 }
    );
  }
}


export async function GET() {
  try {
    const invoices = await db.invoice.findMany({
      include: {
        invoiceItems: true, 
      },
    });

    return NextResponse.json(invoices, { status: 200 });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 });
  }
}