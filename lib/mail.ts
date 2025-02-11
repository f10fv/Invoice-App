import { Resend } from "resend";
import fs from "fs/promises"
import path from "path"
import fontkit from "@pdf-lib/fontkit"
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


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


  // export const sendInvoiceEmail = async (
  //   email: string,
  //   clientName: string,
  //   clientAddress: string,
  //   fromName: string,
  //   fromAddress: string,
  //   fromEmail: string,
  //   invoiceName: string,
  //   note: string,
  //   currency: string,
  //   invoiceNumber: string,
  //   dueDate: string,
  //   invoiceDate: string,
  //   invoiceItems: InvoiceItem[],
  //   totalAmount: number,
  // ) => {
  //   try {
  //     console.log("Preparing to send invoice to:", email);
  //     console.log("invoiceItems data!:", invoiceItems);
  //     if (typeof invoiceItems === "string") {
  //       try {
  //         invoiceItems = JSON.parse(invoiceItems); 
  //       } catch (parseError) {
  //         console.error("Invalid invoiceItems JSON string:", invoiceItems);
  //         throw new TypeError("invoiceItems must be a valid JSON array or an array.");
  //       }
  //     }
  
  //     if (!Array.isArray(invoiceItems)) {
  //       console.error("Expected invoiceItems to be an array but got:", typeof invoiceItems);
  //       throw new TypeError("invoiceItems must be an array.");
  //     }
  
  //     const doc = new jsPDF();
  
  //     doc.setFont("helvetica", "bold");
  //     doc.setFontSize(20);
  //     doc.text(invoiceName, 10, 20);
  
  //     doc.setFontSize(10);
  //     doc.setFont("helvetica", "normal");
  //     doc.text("From:", 10, 30);
  //     doc.text(fromName, 10, 35);
  //     doc.text(fromEmail, 10, 40);
  //     doc.text(fromAddress, 10, 45);
  
  //     doc.text(`Invoice Number: #${invoiceNumber}`, 140, 30, { align: "right" });
  //     doc.text(`Invoice Date: ${invoiceDate}`, 140, 35, { align: "right" });
  //     doc.text(`Due Date: ${dueDate}`, 140, 40, { align: "right" });
  
  //     doc.text("Bill To:", 10, 60);
  //     doc.text(clientName, 10, 65);
  //     doc.text(email, 10, 70);
  //     doc.text(clientAddress, 10, 75);
  
  //     doc.setFont("helvetica", "bold");
  //     doc.text("Description", 10, 90);
  //     doc.text("Quantity", 100, 90, { align: "right" });
  //     doc.text("Rate", 130, 90, { align: "right" });
  //     doc.text("Amount", 160, 90, { align: "right" });
  //     doc.line(10, 92, 200, 92);
  
  //     let yPosition = 100;
  //     let totalCalculated = 0;
  
  //     invoiceItems.forEach((item: InvoiceItem) => {
  //       doc.setFont("helvetica", "normal");
  //       doc.text(item.description, 10, yPosition);
  //       doc.text(item.quantity.toString(), 100, yPosition, { align: "right" });
  //       doc.text(`${currency} ${item.rate}`, 130, yPosition, { align: "right" });
  //       doc.text(`${currency} ${item.amount}`, 160, yPosition, { align: "right" });
  //       yPosition += 10;
  
  //       totalCalculated += item.amount;
  //     });
  
  //     doc.setFont("helvetica", "bold");
  //     doc.text("Total Amount:", 130, yPosition, { align: "right" });
  //     doc.text(`${currency} ${totalCalculated.toFixed(2)}`, 160, yPosition, { align: "right" });
  
  //     yPosition += 10;
  //     doc.setFont("helvetica", "normal");
  //     doc.text("Note:", 10, yPosition);
  //     doc.text(note, 10, yPosition + 5);
  
  //     const pdfBuffer = doc.output("arraybuffer");
  //     const pdfBase64 = Buffer.from(pdfBuffer).toString("base64");
  
  //     await resend.emails.send({
  //       from: "onboarding@resend.dev",
  //       to: email,
  //       subject: `Invoice #${invoiceNumber}`,
  //       html: `
  //         <p>Dear ${clientName},</p>
  //         <p>Please find attached your invoice:</p>
  //         <ul>
  //           <li><strong>Invoice Number:</strong> ${invoiceNumber}</li>
  //           <li><strong>Due Date:</strong> ${dueDate}</li>
  //           <li><strong>Total Amount:</strong> ${currency} ${totalAmount.toFixed(2)}</li>
  //         </ul>
  //         <p>Thank you for your business!</p>
  //       `,
  //       attachments: [
  //         {
  //           filename: `Invoice-${invoiceNumber}.pdf`,
  //           content: pdfBase64,
  //           content_type: "application/pdf",
  //         },
  //       ],
  //     });
  
  //     console.log(`Invoice email sent to ${email} successfully.`);
  //   } catch (error) {
  //     console.error("Error sending invoice email:", error);
  //     throw new Error("Failed to send invoice email.");
  //   }
  // };
  
  // export const sendInvoiceEmail = async (
  //   email: string,
  //   clientName: string,
  //   clientAddress: string,
  //   fromName: string,
  //   fromAddress: string,
  //   fromEmail: string,
  //   invoiceName: string,
  //   note: string,
  //   currency: string,
  //   invoiceNumber: string,
  //   dueDate: string,
  //   invoiceDate: string,
  //   invoiceItems: InvoiceItem[],
  //   totalAmount: number,
  // ) => {
  //   try {
  //     console.log("Preparing to send invoice to:", email)
  
  //     if (typeof invoiceItems === "string") {
  //       try {
  //         invoiceItems = JSON.parse(invoiceItems)
  //       } catch (parseError) {
  //         console.error("Invalid invoiceItems JSON string:", invoiceItems)
  //         throw new TypeError("invoiceItems must be a valid JSON array or an array.")
  //       }
  //     }
  
  //     if (!Array.isArray(invoiceItems)) {
  //       console.error("Expected invoiceItems to be an array but got:", typeof invoiceItems)
  //       throw new TypeError("invoiceItems must be an array.")
  //     }
  
  //     // Create a new PDF document
  //     const pdfDoc = await PDFDocument.create()
  //     pdfDoc.registerFontkit(fontkit)
  
  //     // Load fonts
  //     const timesRomanFont = await pdfDoc.embedFont("Times-Roman")
  //     const helveticaFont = await pdfDoc.embedFont("Helvetica")
  //     const helveticaBoldFont = await pdfDoc.embedFont("Helvetica-Bold")
  
  //     // Add a new page
  //     const page = pdfDoc.addPage([595.28, 841.89]) // A4 size
  
  //     // Function to load image from public folder
  //     const loadImage = async (filename: string) => {
  //       const imagePath = path.join(process.cwd(), "public", filename)
  //       const imageBuffer = await fs.readFile(imagePath)
  //       const imageArrayBuffer = imageBuffer.buffer
  //       const uint8Array = new Uint8Array(imageArrayBuffer)
  //       return await pdfDoc.embedPng(uint8Array)
  //     }
  
  //     // Load images
  //     const headerImage = await loadImage("Invoice-Header.png")
  //     const logoImage = await loadImage("Invoice-Logo.png")
  //     const footerImage = await loadImage("Invoice-Footer.png")
  
  //     // Add header image (left-aligned with left side details)
  //     const headerDims = headerImage.scale(0.5)
  //     const labelx = 50
  //     page.drawImage(headerImage, {
  //       x: labelx,
  //       y: page.getHeight() - headerDims.height - 20,
  //       width: headerDims.width,
  //       height: headerDims.height,
  //     })
  
  //     // Add logo (right-aligned)
  //     const logoDims = logoImage.scale(0.4)
  //     const logoX = page.getWidth() - logoDims.width - 20
  //     const logoY = page.getHeight() - logoDims.height - 20
  //     page.drawImage(logoImage, {
  //       x: logoX,
  //       y: logoY,
  //       width: logoDims.width,
  //       height: logoDims.height,
  //     })
  
  //     // Invoice title
  //     page.drawText("INVOICE", {
  //       x: labelx,
  //       y: page.getHeight() - headerDims.height - 60,
  //       size: 24,
  //       font: timesRomanFont,
  //       color: rgb(0, 0, 0),
  //     })
  
  //     // Invoice details
  //     const drawText = (text: string, x: number, y: number, size: number, font: any, color = rgb(0, 0, 0)) => {
  //       page.drawText(text, { x, y, size, font, color })
  //     }
  
  //     const startY = page.getHeight() - headerDims.height - 100
  //     const labelX = 50
  //     const valueX = 120
  //     const companyBlue = rgb(0, 0.2, 0.6)
  
  //     // Left side details with improved alignment
  //     drawText("Invoice #", labelX, startY, 10, helveticaBoldFont)
  //     drawText(":", valueX - 15, startY, 10, helveticaFont)
  //     drawText(invoiceNumber, valueX, startY, 10, helveticaFont)
  
  //     drawText("Date", labelX, startY - 20, 10, helveticaBoldFont)
  //     drawText(":", valueX - 15, startY - 20, 10, helveticaFont)
  //     drawText(invoiceDate, valueX, startY - 20, 10, helveticaFont)
  
  //     drawText("Terms", labelX, startY - 40, 10, helveticaBoldFont)
  //     drawText(":", valueX - 15, startY - 40, 10, helveticaFont)
  //     drawText("Due on receipt", valueX, startY - 40, 10, helveticaFont)
  
  //     drawText("Due Date", labelX, startY - 60, 10, helveticaBoldFont)
  //     drawText(":", valueX - 15, startY - 60, 10, helveticaFont)
  //     drawText(dueDate, valueX, startY - 60, 10, helveticaFont)
  
  //     drawText("PO #", labelX, startY - 80, 10, helveticaBoldFont)
  //     drawText(":", valueX - 15, startY - 80, 10, helveticaFont)
  //     drawText(invoiceNumber, valueX, startY - 80, 10, helveticaFont)
  
  //     drawText("Status", labelX, startY - 100, 10, helveticaBoldFont)
  //     drawText(":", valueX - 15, startY - 100, 10, helveticaFont)
  //     drawText("Open", valueX, startY - 100, 10, helveticaFont)
  
  //     // Right side details
  //     const rightColumnX = 350
  
  //     // From section
  //     drawText("From", rightColumnX, startY, 10, helveticaBoldFont)
  //     drawText(fromName, rightColumnX, startY - 20, 10, helveticaBoldFont, companyBlue)
  //     drawText(fromEmail, rightColumnX, startY - 35, 10, helveticaFont)
  //     drawText(fromAddress, rightColumnX, startY - 50, 10, helveticaFont)
  
  //     // To section with increased spacing
  //     drawText("To", rightColumnX, startY - 80, 10, helveticaBoldFont)
  //     drawText(clientName, rightColumnX, startY - 100, 10, helveticaBoldFont, companyBlue)
  //     drawText(email, rightColumnX, startY - 115, 10, helveticaFont)
  //     drawText(clientAddress, rightColumnX, startY - 130, 10, helveticaFont)
  
  //     // Table
  //     const tableStartY = startY - 180 // Increased margin top
  //     const lineHeight = 30
  //     const tableWidth = logoX + logoDims.width - labelX // Extend table to align with logo
  //     const columns = [
  //       labelX,
  //       labelX + 20,
  //       labelX + tableWidth * 0.4,
  //       labelX + tableWidth * 0.6,
  //       labelX + tableWidth * 0.8,
  //     ]
  
  //     // Function to draw horizontal line
  //     const drawHorizontalLine = (y: number) => {
  //       page.drawLine({
  //         start: { x: labelX, y },
  //         end: { x: labelX + tableWidth, y },
  //         color: rgb(0, 0, 0),
  //       })
  //     }
  
  //     // Table header (navy blue with white text)
  //     page.drawRectangle({
  //       x: labelX,
  //       y: tableStartY,
  //       width: tableWidth,
  //       height: lineHeight,
  //       color: rgb(0, 0.2, 0.6),
  //     })
  
  //     const headerTexts = ["#", "Description", "Quantity", "Unit Price", "Total"]
  //     headerTexts.forEach((text, index) => {
  //       const textWidth = helveticaBoldFont.widthOfTextAtSize(text, 10)
  //       let centerX: number
  //       if (index === 0) {
  //         centerX = columns[index] + 10
  //       } else if (index === headerTexts.length - 1) {
  //         centerX = columns[index] + (tableWidth - (columns[index] - labelX)) / 2 - textWidth / 2
  //       } else {
  //         centerX = columns[index] + (columns[index + 1] - columns[index]) / 2 - textWidth / 2
  //       }
  //       drawText(text, centerX, tableStartY + 10, 10, helveticaBoldFont, rgb(1, 1, 1))
  //     })
  
  //     // Table content
  //     let currentY = tableStartY - lineHeight
  
  //     // Draw horizontal line after header
  //     drawHorizontalLine(tableStartY)
  
  //     // Draw vertical borders
  //     const tableEndY = currentY - lineHeight * invoiceItems.length
  //     columns.forEach((x) => {
  //       page.drawLine({
  //         start: { x, y: tableStartY },
  //         end: { x, y: tableEndY },
  //         color: rgb(0, 0, 0),
  //       })
  //     })
  
  //     // Draw right border
  //     page.drawLine({
  //       start: { x: labelX + tableWidth, y: tableStartY },
  //       end: { x: labelX + tableWidth, y: tableEndY },
  //       color: rgb(0, 0, 0),
  //     })
  
  //     // Center-align text in table cells
  //     const drawCenteredText = (text: string, x: number, width: number, y: number, size: number, font: any) => {
  //       const textWidth = font.widthOfTextAtSize(text, size)
  //       const centerX = Math.max(x, x + width / 2 - textWidth / 2)
  //       drawText(text, centerX, y, size, font)
  //     }
  
  //     // Draw items with padding
  //     invoiceItems.forEach((item, index) => {
  //       drawText((index + 1).toString(), columns[0] + 8, currentY + 10, 10, helveticaFont)
  //       drawText(item.description, columns[1] + 8, currentY + 10, 10, helveticaFont)
  //       drawCenteredText(item.quantity.toString(), columns[2], columns[3] - columns[2], currentY + 10, 10, helveticaFont)
  //       drawCenteredText(item.rate.toFixed(2), columns[3], columns[4] - columns[3], currentY + 10, 10, helveticaFont)
  //       drawText(`${item.amount.toFixed(2)} ${currency}`, columns[4] + 8, currentY + 10, 10, helveticaFont)
  
  //       currentY -= lineHeight
  //       // Draw horizontal line after each row
  //       drawHorizontalLine(currentY + lineHeight)
  //     })
  
  //     // Total row with padding
  //     drawText("Total", columns[3] + 8, currentY + 10, 10, helveticaBoldFont)
  //     drawText(`${totalAmount.toFixed(2)} ${currency}`, columns[4] + 8, currentY + 10, 10, helveticaBoldFont)
  
  //     // Bottom border of the table
  //     drawHorizontalLine(currentY)
  
  //     // Add margin after table
  //     currentY -= 40 // Reduced margin after table
  
  //     // Bank Details with improved spacing
  //     drawText("Bank Details:", labelX, currentY, 10, helveticaBoldFont)
  //     currentY -= 20
  //     drawText("- Bank Name: ABCB", labelX, currentY, 10, helveticaFont)
  //     currentY -= 15
  //     drawText("- Account Holder Name: Suite Plus Information Technology", labelX, currentY, 10, helveticaFont)
  //     currentY -= 15
  //     drawText("- Account Number: 1553847920001", labelX, currentY, 10, helveticaFont)
  //     currentY -= 15
  //     drawText("- IBAN: AE650300011553847920001", labelX, currentY, 10, helveticaFont)
  //     currentY -= 15
  //     drawText("- Account Type: Current", labelX, currentY, 10, helveticaFont)
  
  //     // Add footer image
  //     const footerDims = footerImage.scale(0.5)
  //     page.drawImage(footerImage, {
  //       x: 0,
  //       y: 0,
  //       width: page.getWidth(),
  //       height: footerDims.height,
  //     })
  
  //     // Save the PDF
  //     const pdfBytes = await pdfDoc.save()
  //     const pdfBase64 = Buffer.from(pdfBytes).toString("base64")
  
  //     await resend.emails.send({
  //       from: "onboarding@resend.dev",
  //       to: email,
  //       subject: `Invoice #${invoiceNumber}`,
  //       html: `
  //         <p>Dear ${clientName},</p>
  //         <p>Please find attached your invoice:</p>
  //         <ul>
  //           <li><strong>Invoice Number:</strong> ${invoiceNumber}</li>
  //           <li><strong>Due Date:</strong> ${dueDate}</li>
  //           <li><strong>Total Amount:</strong> ${currency} ${totalAmount.toFixed(2)}</li>
  //         </ul>
  //         <p>Thank you for your business!</p>
  //       `,
  //       attachments: [
  //         {
  //           filename: `Invoice-${invoiceNumber}.pdf`,
  //           content: pdfBase64,
  //           content_type: "application/pdf",
  //         },
  //       ],
  //     })
  
  //     console.log(`Invoice email sent to ${email} successfully.`)
  //   } catch (error: any) {
  //     console.error("Error in sendInvoiceEmail:", error)
  //     throw new Error(`Failed to send invoice email: ${error.message}`)
  //   }
  // }
  
  

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
    total: number,
  ) => {
    try {
      console.log("Preparing to send invoice to:", email);
  
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
  
      // Invoice title
      doc.setFontSize(22);
      doc.text("INVOICE", 20, 20);
  
      // Invoice details
      doc.setFontSize(10);
      doc.text(`Invoice #: ${invoiceNumber}`, 20, 30);
      doc.text(`Date: ${invoiceDate}`, 20, 40);
      doc.text(`Due Date: ${dueDate}`, 20, 50);
      
      // From details
      doc.text("From:", 140, 30);
      doc.text(fromName, 140, 40);
      doc.text(fromEmail, 140, 50);
      doc.text(fromAddress, 140, 60);
  
      // To details
      doc.text("To:", 140, 80);
      doc.text(clientName, 140, 90);
      doc.text(email, 140, 100);
      doc.text(clientAddress, 140, 110);
  
      // Table
      let tableY = 280; // starting Y position of the table
      const tableResult = autoTable(doc, {
        startY: tableY,
        head: [["#", "Description", "Quantity", "Unit Price", "Total"]],
        headStyles: { fillColor: [0, 51, 153], textColor: [255, 255, 255] },
        body: invoiceItems.map((item, index) => {
          tableY += 20; // add 20 to the Y position for each row
          return [
            index + 1,
            item.description,
            item.quantity,
            item.rate.toFixed(2),
            `${item.amount.toFixed(2)} ${currency}`,
          ];
        }),
        theme: "grid",
        styles: { fontSize: 10 },
      });
      
      // Total row
      const finalY = tableY + 10;
      doc.setFont("helvetica", "bold");
      doc.text("Total", 400, finalY);
      doc.text(`${total.toFixed(2)} ${currency}`, 480, finalY);
  
      // Convert PDF to base64
      const pdfBuffer = Buffer.from(doc.output("arraybuffer"));
      const pdfBase64 = pdfBuffer.toString('base64');
  
      // Send email with attachment
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
            <li><strong>Total Amount:</strong> ${currency} ${total.toFixed(2)}</li>
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
    } catch (error: any) {
      console.error("Error in sendInvoiceEmail:", error);
      throw new Error(`Failed to send invoice email: ${error.message}`);
    }
  };
  