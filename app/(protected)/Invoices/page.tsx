"use client";

import { useEffect, useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PlusCircle } from "lucide-react";
import { InvoiceItem } from "@prisma/client";
import { PDFDocument } from "pdf-lib";
import { rgb } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";

interface Invoice {
  id: string;
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
  note: string;
  total: number;
  status: string;
}
export default function InvoicesTable() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [invoice, setInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    async function fetchInvoices() {
      try {
        const response = await fetch("/api/invoice");
        if (!response.ok) {
          throw new Error("Failed to fetch invoices");
        }
        const data = await response.json();
        setInvoices(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchInvoices();
  }, []);

  const handleMarkAsPaid = async (id: string) => {
    try {
      const response = await fetch(`/api/invoice/${id}`, {
        method: "PATCH",
      });
      if (!response.ok) {
        throw new Error("Failed to mark invoice as paid");
      }
      const updatedInvoice = await response.json();
      setInvoices((prevInvoices) =>
        prevInvoices.map((invoice) =>
          invoice.id === id ? { ...invoice, status: "PAID" } : invoice
        )
      );
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/invoice/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete invoice");
      }
      setInvoices((prevInvoices) =>
        prevInvoices.filter((invoice) => invoice.id !== id)
      );
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handlePrint = async (id: string) => {
    if (!id) return;
    fetch(`/api/invoice/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setInvoice(data);
      })
      .catch((error) => {
        console.error("Error fetching invoice:", error);
      });
      

      if (!invoice) return;
      
          const pdfDoc = await PDFDocument.create();
          pdfDoc.registerFontkit(fontkit);
      
          // Load fonts
          const timesRomanFont = await pdfDoc.embedFont("Times-Roman");
          const helveticaFont = await pdfDoc.embedFont("Helvetica");
          const helveticaBoldFont = await pdfDoc.embedFont("Helvetica-Bold");
      
          // Add a new page
          const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
      
          // Function to load image from public folder
          const response1 = await fetch("/Invoice-Header.png");
          const imageArrayBuffer1 = await response1.arrayBuffer();
          const headerImage = await pdfDoc.embedPng(imageArrayBuffer1);
      
          const response2 = await fetch("/Invoice-Logo.png");
          const imageArrayBuffer2 = await response2.arrayBuffer();
          const logoImage = await pdfDoc.embedPng(imageArrayBuffer2);
      
          const response3 = await fetch("/Invoice-Footer.png");
          const imageArrayBuffer3 = await response3.arrayBuffer();
          const footerImage = await pdfDoc.embedPng(imageArrayBuffer3);
      
          // Load images
          // Add header image (left-aligned with left side details)
          const headerDims = headerImage.scale(0.5);
          const labelx = 50;
          page.drawImage(headerImage, {
            x: labelx,
            y: page.getHeight() - headerDims.height - 20,
            width: headerDims.width,
            height: headerDims.height,
          });
      
          // Add logo (right-aligned)
          const logoDims = logoImage.scale(0.4);
          const logoX = page.getWidth() - logoDims.width - 20;
          const logoY = page.getHeight() - logoDims.height - 20;
          page.drawImage(logoImage, {
            x: logoX,
            y: logoY,
            width: logoDims.width,
            height: logoDims.height,
          });
      
          // Invoice title
          page.drawText("INVOICE", {
            x: labelx,
            y: page.getHeight() - headerDims.height - 60,
            size: 24,
            font: timesRomanFont,
            color: rgb(0, 0, 0),
          });
      
          // Invoice details
          const drawText = (
            text: string,
            x: number,
            y: number,
            size: number,
            font: any,
            color = rgb(0, 0, 0)
          ) => {
            page.drawText(text ?? "", { x, y, size, font, color });
          };
      
          const startY = page.getHeight() - headerDims.height - 100;
          const labelX = 50;
          const valueX = 120;
          const companyBlue = rgb(0, 0.2, 0.6);
      
          // Left side details with improved alignment
          drawText("Invoice #", labelX, startY, 10, helveticaBoldFont);
          drawText(":", valueX - 15, startY, 10, helveticaFont);
          drawText(
            invoice.invoiceNumber.toString(),
            valueX,
            startY,
            10,
            helveticaFont
          );
      
          drawText("Date", labelX, startY - 20, 10, helveticaBoldFont);
          drawText(":", valueX - 15, startY - 20, 10, helveticaFont);
          drawText(invoice.date.split("T")[0], valueX, startY - 20, 10, helveticaFont);
      
          drawText("Terms", labelX, startY - 40, 10, helveticaBoldFont);
          drawText(":", valueX - 15, startY - 40, 10, helveticaFont);
          drawText("Due on receipt", valueX, startY - 40, 10, helveticaFont);
      
          drawText("Due Date", labelX, startY - 60, 10, helveticaBoldFont);
          drawText(":", valueX - 15, startY - 60, 10, helveticaFont);
          drawText(
            invoice.dueDate.toString(),
            valueX,
            startY - 60,
            10,
            helveticaFont
          );
      
          drawText("PO #", labelX, startY - 80, 10, helveticaBoldFont);
          drawText(":", valueX - 15, startY - 80, 10, helveticaFont);
          drawText(
            invoice.invoiceNumber.toString(),
            valueX,
            startY - 80,
            10,
            helveticaFont
          );
      
          drawText("Status", labelX, startY - 100, 10, helveticaBoldFont);
          drawText(":", valueX - 15, startY - 100, 10, helveticaFont);
          drawText("Open", valueX, startY - 100, 10, helveticaFont);
      
          // Right side details
          const rightColumnX = 350;
      
          // From section
          drawText("From", rightColumnX, startY, 10, helveticaBoldFont);
          drawText(
            invoice.fromName,
            rightColumnX,
            startY - 20,
            10,
            helveticaBoldFont,
            companyBlue
          );
          drawText(invoice.fromEmail, rightColumnX, startY - 35, 10, helveticaFont);
          drawText(invoice.fromAddress, rightColumnX, startY - 50, 10, helveticaFont);
      
          // To section with increased spacing
          drawText("To", rightColumnX, startY - 80, 10, helveticaBoldFont);
          drawText(
            invoice.clientName,
            rightColumnX,
            startY - 100,
            10,
            helveticaBoldFont,
            companyBlue
          );
          drawText(
            invoice.clientEmail,
            rightColumnX,
            startY - 115,
            10,
            helveticaFont
          );
          drawText(
            invoice.clientAddress,
            rightColumnX,
            startY - 130,
            10,
            helveticaFont
          );
      
          // Table
          const tableStartY = startY - 180; // Increased margin top
          const lineHeight = 30;
          const tableWidth = logoX + logoDims.width - labelX; // Extend table to align with logo
          const columns = [
            labelX,
            labelX + 20,
            labelX + tableWidth * 0.4,
            labelX + tableWidth * 0.6,
            labelX + tableWidth * 0.8,
          ];
      
          // Function to draw horizontal line
          const drawHorizontalLine = (y: number) => {
            page.drawLine({
              start: { x: labelX, y },
              end: { x: labelX + tableWidth, y },
              color: rgb(0, 0, 0),
            });
          };
      
          // Table header (navy blue with white text)
          page.drawRectangle({
            x: labelX,
            y: tableStartY,
            width: tableWidth,
            height: lineHeight,
            color: rgb(0, 0.2, 0.6),
          });
      
          const headerTexts = ["#", "Description", "Quantity", "Unit Price", "Total"];
          headerTexts.forEach((text, index) => {
            const textWidth = helveticaBoldFont.widthOfTextAtSize(text, 10);
            let centerX: number;
            if (index === 0) {
              centerX = columns[index] + 10;
            } else if (index === headerTexts.length - 1) {
              centerX =
                columns[index] +
                (tableWidth - (columns[index] - labelX)) / 2 -
                textWidth / 2;
            } else {
              centerX =
                columns[index] +
                (columns[index + 1] - columns[index]) / 2 -
                textWidth / 2;
            }
            drawText(
              text,
              centerX,
              tableStartY + 10,
              10,
              helveticaBoldFont,
              rgb(1, 1, 1)
            );
          });
      
          // Table content
          let currentY = tableStartY - lineHeight;
      
          // Draw horizontal line after header
          drawHorizontalLine(tableStartY);
      
          // Draw vertical borders
          const tableEndY = currentY - lineHeight * invoice.invoiceItems.length;
          columns.forEach((x) => {
            page.drawLine({
              start: { x, y: tableStartY },
              end: { x, y: tableEndY },
              color: rgb(0, 0, 0),
            });
          });
      
          // Draw right border
          page.drawLine({
            start: { x: labelX + tableWidth, y: tableStartY },
            end: { x: labelX + tableWidth, y: tableEndY },
            color: rgb(0, 0, 0),
          });
      
          // Center-align text in table cells
          const drawCenteredText = (
            text: string,
            x: number,
            width: number,
            y: number,
            size: number,
            font: any
          ) => {
            const textWidth = font.widthOfTextAtSize(text, size);
            const centerX = Math.max(x, x + width / 2 - textWidth / 2);
            drawText(text, centerX, y, size, font);
          };
      
          // Draw items with padding
          invoice.invoiceItems.forEach((item, index) => {
            drawText(
              (index + 1).toString(),
              columns[0] + 8,
              currentY + 10,
              10,
              helveticaFont
            );
            drawText(
              item.description,
              columns[1] + 8,
              currentY + 10,
              10,
              helveticaFont
            );
            drawCenteredText(
              item.quantity.toString(),
              columns[2],
              columns[3] - columns[2],
              currentY + 10,
              10,
              helveticaFont
            );
            drawCenteredText(
              item.rate.toFixed(2),
              columns[3],
              columns[4] - columns[3],
              currentY + 10,
              10,
              helveticaFont
            );
            drawText(
              `${item.amount.toFixed(2)} ${invoice.currency}`,
              columns[4] + 8,
              currentY + 10,
              10,
              helveticaFont
            );
      
            currentY -= lineHeight;
            // Draw horizontal line after each row
            drawHorizontalLine(currentY + lineHeight);
          });
      
          // Total row with padding
          drawText("Total", columns[3] + 8, currentY + 10, 10, helveticaBoldFont);
          drawText(
            `${invoice.total.toFixed(2)} ${invoice.currency}`,
            columns[4] + 8,
            currentY + 10,
            10,
            helveticaBoldFont
          );
      
          // Bottom border of the table
          drawHorizontalLine(currentY);
      
          // Add margin after table
          currentY -= 40; // Reduced margin after table
      
          // Bank Details with improved spacing
          drawText("Bank Details:", labelX, currentY, 10, helveticaBoldFont);
          currentY -= 20;
          drawText("- Bank Name: ABCB", labelX, currentY, 10, helveticaFont);
          currentY -= 15;
          drawText(
            "- Account Holder Name: Suite Plus Information Technology",
            labelX,
            currentY,
            10,
            helveticaFont
          );
          currentY -= 15;
          drawText(
            "- Account Number: 1553847920001",
            labelX,
            currentY,
            10,
            helveticaFont
          );
          currentY -= 15;
          drawText(
            "- IBAN: AE650300011553847920001",
            labelX,
            currentY,
            10,
            helveticaFont
          );
          currentY -= 15;
          drawText("- Account Type: Current", labelX, currentY, 10, helveticaFont);
      
          // Add footer image
          const footerDims = footerImage.scale(0.5);
          page.drawImage(footerImage, {
            x: 0,
            y: 0,
            width: page.getWidth(),
            height: footerDims.height,
          });
      
          // Save the PDF
          const pdfBytes = await pdfDoc.save();
          const pdfBase64 = Buffer.from(pdfBytes).toString("base64");
      
          // Trigger the download
          const link = document.createElement("a");
          link.href = URL.createObjectURL(
            new Blob([pdfBytes], { type: "application/pdf" })
          );
          link.download = `Invoice-${invoice.invoiceNumber}.pdf`;
          link.click();
  };

  const handleView = async (id: string) => {
    window.location.href = `/Invoices/Invoice-View?id=${id}`;
  };

  const handleEdit = async (id: string) => {
    window.location.href = `/Invoices/Invoice-Edit?id=${id}`;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Card className="flex flex-col w-full h-full p-8 ">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Invoices</h1>
          <p className="text-sm text-muted-foreground">
            Manage your invoices right here
          </p>
        </div>
        <Button
          onClick={() => {
            window.location.href = "/Invoices/create";
          }}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Invoice
        </Button>
      </div>
      <div className="w-full rounded-md border h-96 overflow-y-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-white z-10">
            <TableRow>
              <TableHead>Invoice ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[70px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.invoiceNumber}>
                <TableCell className="font-medium">
                  #{invoice.invoiceNumber}
                </TableCell>
                <TableCell>{invoice.clientName}</TableCell>
                <TableCell>${invoice.total}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      invoice.status === "PAID" ? "secondary" : "default"
                    }
                    className="bg-black text-white"
                  >
                    {invoice.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(invoice.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleMarkAsPaid(invoice.id)}
                      >
                        Mark as paid
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleView(invoice.id)}>
                        View invoice
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(invoice.id)}>
                        Edit invoice
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handlePrint(invoice.id)}>
                        Print invoice
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => handleDelete(invoice.id)}
                      >
                        Delete invoice
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
