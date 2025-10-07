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
  projectId: string;
}

// export async function POST(request: Request) {
//   try {
//     const invoice: Invoice = await request.json();
//     const action = await request.json();
//     console.log("Invoice data:", invoice);

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

//     const lastInvoice = await db.invoice.findFirst({
//       orderBy: { invoiceNumber: "desc" },
//     });

//     const lastNumber = lastInvoice
//     ? parseInt(`${lastInvoice.invoiceNumber}`.split("-")[1])
//     : 0;
//     const newInvoiceNumber = `INV-${String(lastNumber + 1).padStart(3, "0")}`;

//     const newInvoice = await db.invoice.create({
//       data: {
//         invoiceNumber: newInvoiceNumber,
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
//             quantity: Number(item.quantity),
//             rate: Number(item.rate),
//             amount: Number(item.amount),
//           })),
//         },
//         customer: { connect: { id: customerId } },
//         project: { connect: { id: invoice.projectId } },
//       } as any,
//     });
    

//     await sendInvoiceEmail(
//       invoice.clientEmail,
//       invoice.clientName,
//       invoice.clientAddress,
//       invoice.fromName,
//       invoice.fromAddress,
//       invoice.fromEmail,
//       invoice.currency,
//       newInvoiceNumber,
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
    const rawBody = await request.text()
    console.log("Raw request body:", rawBody)
    let data
    try {
      data = JSON.parse(rawBody)
    } catch (parseError) {
      console.error("Error parsing JSON:", parseError)
      return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 })
    }

    const { invoice, action } = data

    if (!invoice) {
      return NextResponse.json({ error: "Invoice data is missing" }, { status: 400 })
    }
    console.log("Invoice data:", invoice)

    const requiredFields = ["dueDate", "clientEmail", "clientName", "clientAddress", "projectId"]
    for (const field of requiredFields) {
      if (!(field in invoice)) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    const parseDueDate = isNaN(Number.parseInt(invoice.dueDate)) ? null : Number.parseInt(invoice.dueDate)

    console.log("Invoice items:", invoice.invoiceItems)

    const client = await db.customers.findFirst({
      where: { customerEmail: invoice.clientEmail },
      select: { id: true },
    })
  

    const lastInvoice = await db.invoice.findFirst({
      orderBy: { invoiceNumber: "desc" },
    })

    const lastNumber = lastInvoice ? Number.parseInt(`${lastInvoice.invoiceNumber}`.split("-")[1]) : 0
    const newInvoiceNumber = `INV-${String(lastNumber + 1).padStart(3, "0")}`
    const [day, month, year] = invoice.date.split("/");

    const newInvoice = await db.invoice.create({
      data: {
        invoiceNumber: newInvoiceNumber,
        currency: invoice.currency,
        fromName: invoice.fromName,
        fromEmail: invoice.fromEmail,
        fromAddress: invoice.fromAddress,
        clientName: invoice.clientName,
        clientEmail: invoice.clientEmail,
        clientAddress: invoice.clientAddress,
        date: new Date(`${year}-${month}-${day}`),
        dueDate: parseDueDate ?? 0,
        note: invoice.note,
        total: invoice.total,
        status: "PENDING",
        invoiceItems: {
          create: invoice.invoiceItems.map(
            (item: { description: string; quantity: number; rate: number; amount: number }) => ({
              description: item.description,
              quantity: Number(item.quantity),
              rate: Number(item.rate),
              amount: Number(item.amount),
            }),
          ),
        },
        customer: { connect: { id: client?.id } },
        project: { connect: { id: invoice.projectId } },
      } as any,
    })

    if (action === "send") {
      await sendInvoiceEmail(
        invoice.clientEmail,
        invoice.clientName,
        invoice.clientAddress,
        invoice.fromName,
        invoice.fromAddress,
        invoice.fromEmail,
        invoice.currency,
        newInvoiceNumber,
        invoice.dueDate,
        new Date(invoice.date).toLocaleDateString(),
        invoice.invoiceItems,
        invoice.total,
      )
    }

    return NextResponse.json(
      {
        message: action === "save" ? "Invoice saved successfully" : "Invoice created and sent successfully",
        data: newInvoice,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating invoice:", error)
    return NextResponse.json({ error: "Failed to create invoice" }, { status: 500 })
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