import { sendInvoiceEmail } from "@/lib/mail"
import { NextResponse } from "next/server"

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

    const invoice = data

    if (
      !invoice.clientEmail ||
      !invoice.clientName ||
      !invoice.fromName ||
      !invoice.invoiceNumber ||
      !invoice.date ||
      !invoice.invoiceItems?.length
    ) {
      return NextResponse.json({ error: "Missing required invoice fields" }, { status: 400 })
    }

    try {
      await sendInvoiceEmail(
        invoice.clientEmail,
        invoice.clientName,
        invoice.clientAddress || "",
        invoice.fromName,
        invoice.fromAddress || "",
        invoice.fromEmail,
        invoice.currency || "USD",
        invoice.invoiceNumber,
        invoice.dueDate || null,
        invoice.date,
        invoice.invoiceItems,
        invoice.total || 0
      )

      return NextResponse.json({ message: "Invoice email sent successfully" }, { status: 200 })
    } catch (emailError) {
      console.error("Error sending invoice email:", emailError)
      return NextResponse.json({ error: "Failed to send invoice email" }, { status: 500 })
    }
  } catch (error) {
    console.error("Unexpected error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
