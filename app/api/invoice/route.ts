import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendInvoiceEmail } from "@/lib/mail";

interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface Customers {
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  invoices: Invoice[];
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
  customers: Customers[];
  invoiceItemDescription: string;
  invoiceItemQuantity: number;
  invoiceItemRate: number;
  note: string;
  total: number;
}

// export async function POST(request: Request) {
//   try {
//     const invoice: Invoice = await request.json();
//     console.log("Invoice data:", invoice);

//     const parseInvoiceNumber = isNaN(parseInt(invoice.invoiceNumber))
//       ? null
//       : parseInt(invoice.invoiceNumber);
//     const parseDueDate = isNaN(parseInt(invoice.dueDate))
//       ? null
//       : parseInt(invoice.dueDate);

//     console.log("Invoice items:", invoice.invoiceItems);

//     const existingCustomer = await db.customers.findUnique({
//       where: { customerEmail: invoice.clientEmail },
//     });

//     let customerId: string;

//     if (existingCustomer) {
//       customerId = existingCustomer.id;
//     } else {
//       const newCustomer = await db.customers.create({
//         data: {
//           customerName: invoice.clientName,
//           customerEmail: invoice.clientEmail,
//           customerAddress: invoice.clientAddress,
//           invoices: { create: [] },
//         },
//       });
//       customerId = newCustomer.id;
//     }

//     const newInvoice = await db.invoice.create({
//       data: {
//         invoiceName: invoice.invoiceName,
//         invoiceNumber: parseInvoiceNumber !== null ? parseInvoiceNumber : 0,
//         currency: invoice.currency,
//         fromName: invoice.fromName,
//         fromEmail: invoice.fromEmail,
//         fromAddress: invoice.fromAddress,
//         clientName: invoice.clientName,
//         clientEmail: invoice.clientEmail,
//         clientAddress: invoice.clientAddress,
//         date: new Date(invoice.date),
//         dueDate: parseDueDate ?? 0,
//         note: invoice.note,
//         total: invoice.total,
//         status: "PENDING",
//         invoiceItems: {
//           create: invoice.invoiceItems.map((item) => ({
//             description: item.description,
//             quantity: item.quantity,
//             rate: item.rate,
//             amount: item.amount,
//           })),
//         },
//         customer: { connect: { id: customerId } },
//       } as any
//     });
    

//     await sendInvoiceEmail(
//       invoice.clientEmail,
//       invoice.clientName,
//       invoice.clientAddress,
//       invoice.fromName,
//       invoice.fromAddress,
//       invoice.fromEmail,
//       invoice.invoiceName,
//       invoice.note,
//       invoice.currency,
//       invoice.invoiceNumber,
//       invoice.dueDate,
//       new Date(invoice.date).toLocaleDateString(),
//       invoice.invoiceItems,
//       invoice.total
//     );

//     return NextResponse.json(
//       { message: "Invoice created successfully", data: newInvoice },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Error creating invoice:", error);
//     return NextResponse.json(
//       { error: "Failed to create invoice" },
//       { status: 500 }
//     );
//   }
// }


export async function POST(request: Request) {
  try {
    const invoice: Invoice = await request.json();
    console.log("Invoice data:", invoice);

    const parseDueDate = isNaN(parseInt(invoice.dueDate))
      ? null
      : parseInt(invoice.dueDate);

    console.log("Invoice items:", invoice.invoiceItems);

    const existingCustomer = await db.customers.findUnique({
      where: { customerEmail: invoice.clientEmail },
    });

    let customerId: string;

    if (existingCustomer) {
      customerId = existingCustomer.id;
    } else {
      const newCustomer = await db.customers.create({
        data: {
          customerName: invoice.clientName,
          customerEmail: invoice.clientEmail,
          customerAddress: invoice.clientAddress,
          invoices: { create: [] },
        },
      });
      customerId = newCustomer.id;
    }

    const lastInvoice = await db.invoice.findFirst({
      orderBy: { invoiceNumber: "desc" },
    });

    const lastNumber = lastInvoice
    ? parseInt(`${lastInvoice.invoiceNumber}`.split("-")[1])
    : 0;
    const newInvoiceNumber = `INV-${String(lastNumber + 1).padStart(3, "0")}`;

    const newInvoice = await db.invoice.create({
      data: {
        invoiceName: invoice.invoiceName,
        invoiceNumber: newInvoiceNumber,
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
        customer: { connect: { id: customerId } },
      } as any,
    });

    await sendInvoiceEmail(
      invoice.clientEmail,
      invoice.clientName,
      invoice.clientAddress,
      invoice.fromName,
      invoice.fromAddress,
      invoice.fromEmail,
      invoice.invoiceName,
      invoice.note,
      invoice.currency,
      newInvoiceNumber,
      invoice.dueDate,
      new Date(invoice.date).toLocaleDateString(),
      invoice.invoiceItems,
      invoice.total
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