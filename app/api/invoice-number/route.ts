import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    console.log("Fetching invoice number");

    const lastInvoice = await db.invoice.findFirst({
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        invoiceNumber: true,
      },
    });

    console.log("Last invoice:", lastInvoice);

    const nextInvoiceNumber = lastInvoice
      ? parseInt((lastInvoice.invoiceNumber as unknown as string).replace('INV-', '')) + 1
      : 1;

    const formattedInvoiceNumber = `INV-${nextInvoiceNumber.toString().padStart(3, "0")}`;

    return NextResponse.json({
      invoiceNumber: formattedInvoiceNumber,
    });
  } catch (error) {
    console.error("Error fetching invoice number:", error);
    return NextResponse.json({ error: "Failed to fetch invoice number" }, { status: 500 });
  }
}
