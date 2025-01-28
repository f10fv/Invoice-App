import jsPDF from "jspdf";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const domain = process.env.NEXT_PUBLIC_APP_URL;
export const sendTwoFactorTokenEmail = async (
    email: string, 
    token: string
) => {
    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "2FA Code",
        html: `<p>Your two factor Code: ${token}</p>`
    })
}

export const sendPasswordResetEmail = async (
    email: string, 
    token: string
) => {
    const resetLink = `${domain}/auth/new-password?token=${token}`
    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Reset your password",
        html: `<p>Click <a href="${resetLink}">here</a> to reset your password</p>`
    })
}

export const sendVerificationEmail = async (
    email: string, 
    token: string
) => {
    const confirmLink = `https://invoice-app-001-g33p.vercel.app/auth/new-verification?token=${token}`
    await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Verify your email",
        html: `<p>Click <a href="${confirmLink}">here</a> to verify your email</p>`
    })
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
    invoiceItemDescription : string;
    invoiceItemQuantity : number;
    invoiceItemRate : number;
    note: string;
    total: number;
  }
  
  interface InvoiceItem {
    description: string;
    quantity: number;
    rate: number;
    amount: number;
  }
  
  export const sendInvoiceEmail = async (
    email: string,
    clientName: string,
    clientAddress: string,
    fromName: string,
    fromAddress: string,
    fromEmail: string,
    invoiceName: string,
    note: string,
    currency: string,
    invoiceNumber: string,
    dueDate: string,
    invoiceDate: string,
    invoiceItems: InvoiceItem[],
    totalAmount: number,
  ) => {
    try {
      console.log("Preparing to send invoice to:", email);
      console.log("invoiceItems data!:", invoiceItems);
      if (typeof invoiceItems === "string") {
        try {
          invoiceItems = JSON.parse(invoiceItems); 
        } catch (parseError) {
          console.error("Invalid invoiceItems JSON string:", invoiceItems);
          throw new TypeError("invoiceItems must be a valid JSON array or an array.");
        }
      }
  
      if (!Array.isArray(invoiceItems)) {
        console.error("Expected invoiceItems to be an array but got:", typeof invoiceItems);
        throw new TypeError("invoiceItems must be an array.");
      }
  
      const doc = new jsPDF();
  
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.text(invoiceName, 10, 20);
  
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.text("From:", 10, 30);
      doc.text(fromName, 10, 35);
      doc.text(fromEmail, 10, 40);
      doc.text(fromAddress, 10, 45);
  
      doc.text(`Invoice Number: #${invoiceNumber}`, 140, 30, { align: "right" });
      doc.text(`Invoice Date: ${invoiceDate}`, 140, 35, { align: "right" });
      doc.text(`Due Date: ${dueDate}`, 140, 40, { align: "right" });
  
      doc.text("Bill To:", 10, 60);
      doc.text(clientName, 10, 65);
      doc.text(email, 10, 70);
      doc.text(clientAddress, 10, 75);
  
      doc.setFont("helvetica", "bold");
      doc.text("Description", 10, 90);
      doc.text("Quantity", 100, 90, { align: "right" });
      doc.text("Rate", 130, 90, { align: "right" });
      doc.text("Amount", 160, 90, { align: "right" });
      doc.line(10, 92, 200, 92);
  
      let yPosition = 100;
      let totalCalculated = 0;
  
      invoiceItems.forEach((item: InvoiceItem) => {
        doc.setFont("helvetica", "normal");
        doc.text(item.description, 10, yPosition);
        doc.text(item.quantity.toString(), 100, yPosition, { align: "right" });
        doc.text(`${currency} ${item.rate}`, 130, yPosition, { align: "right" });
        doc.text(`${currency} ${item.amount}`, 160, yPosition, { align: "right" });
        yPosition += 10;
  
        totalCalculated += item.amount;
      });
  
      doc.setFont("helvetica", "bold");
      doc.text("Total Amount:", 130, yPosition, { align: "right" });
      doc.text(`${currency} ${totalCalculated.toFixed(2)}`, 160, yPosition, { align: "right" });
  
      yPosition += 10;
      doc.setFont("helvetica", "normal");
      doc.text("Note:", 10, yPosition);
      doc.text(note, 10, yPosition + 5);
  
      const pdfBuffer = doc.output("arraybuffer");
      const pdfBase64 = Buffer.from(pdfBuffer).toString("base64");
  
      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: `Invoice #${invoiceNumber}`,
        html: `
          <p>Dear ${clientName},</p>
          <p>Please find attached your invoice:</p>
          <ul>
            <li><strong>Invoice Number:</strong> ${invoiceNumber}</li>
            <li><strong>Due Date:</strong> ${dueDate}</li>
            <li><strong>Total Amount:</strong> ${currency} ${totalAmount.toFixed(2)}</li>
          </ul>
          <p>Thank you for your business!</p>
        `,
        attachments: [
          {
            filename: `Invoice-${invoiceNumber}.pdf`,
            content: pdfBase64,
            content_type: "application/pdf",
          },
        ],
      });
  
      console.log(`Invoice email sent to ${email} successfully.`);
    } catch (error) {
      console.error("Error sending invoice email:", error);
      throw new Error("Failed to send invoice email.");
    }
  };
  