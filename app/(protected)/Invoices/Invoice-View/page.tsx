"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import fontkit from "@pdf-lib/fontkit";
import path from "path";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { sendInvoiceEmail } from "@/lib/mail";
interface InvoiceData {
  invoiceDate: any;
  id: string;
  invoiceName: string;
  total: number;
  status: "PAID" | "PENDING";
  date: string;
  dueDate: number;
  fromName: string;
  fromEmail: string;
  fromAddress: string;
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  currency: string;
  invoiceNumber: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
  invoiceItems: {
    id: number;
    description: string;
    quantity: number;
    rate: number;
    amount: number;
    invoiceId: string;
  }[];
}

export default function InvoicePage() {
  const id = useSearchParams().get("id");
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    fetch(`/api/invoice/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setInvoice(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching invoice:", error);
        setLoading(false);
      });
  }, [id]);



const saveInvoicePdf = async () => {
  if (!invoice) return;

  const doc = new jsPDF("p", "pt", "a4");

  const loadImage = async (src: string | URL | Request) => {
    const response = await fetch(src);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  };

  const headerImg = await loadImage("/Invoice-Header.png") as string;
  const logoImg = await loadImage("/Invoice-Logo.png") as string;
  const footerImg = await loadImage("/Invoice-Footer.png") as string;

  doc.addImage(headerImg, "PNG", 50, 20, 200, 50);

  doc.addImage(logoImg, "PNG", 400, 20, 100, 50);

  doc.setFont("times", "bold");
  doc.setFontSize(24);
  doc.text("INVOICE", 50, 100);

  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);

  const details = [
    ["Invoice #", invoice.invoiceNumber.toString()],
    ["Date", invoice.invoiceDate],
    ["Terms", "Due on receipt"],
    ["Due Date", invoice.dueDate.toString()],
    ["PO #", invoice.invoiceNumber.toString()],
    ["Status", "Open"],
  ];

  details.forEach(([label, value], i) => {
    if (!value) value = "N/A"; 
    const y = 120 + i * 20;
    doc.text(label, 50, y);
    doc.setFont("helvetica", "normal");
    doc.text(String(value), 130, y);  
    doc.setFont("helvetica", "bold");
});

  const rightX = 350;
  doc.text("From", rightX, 120);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 51, 153);
  doc.text(invoice.fromName, rightX, 140);
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");
  doc.text(invoice.fromEmail, rightX, 155);
  doc.text(invoice.fromAddress, rightX, 170);

  doc.setFont("helvetica", "bold");
  doc.text("To", rightX, 200);
  doc.setTextColor(0, 51, 153);
  doc.text(invoice.clientName, rightX, 220);
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "normal");
  doc.text(invoice.clientEmail, rightX, 235);
  doc.text(invoice.clientAddress, rightX, 250);

  
  let tableY = 280; 
const tableResult = autoTable(doc, {
  startY: tableY,
  head: [["#", "Description", "Quantity", "Unit Price", "Total"]],
  headStyles: { fillColor: [0, 51, 153], textColor: [255, 255, 255] },
  body: invoice.invoiceItems.map((item, index) => {
    tableY += 20;
    return [
      index + 1,
      item.description,
      item.quantity,
      item.rate.toFixed(2),
      `${item.amount.toFixed(2)} ${invoice.currency}`,
    ];
  }),
  theme: "grid",
  styles: { fontSize: 10 },
});

const finalY = tableY + 10;
doc.setFont("helvetica", "bold");
doc.text("Total", 400, finalY);
doc.text(`${invoice.total.toFixed(2)} ${invoice.currency}`, 480, finalY);

  doc.text("Bank Details:", 50, finalY + 40);
  doc.setFont("helvetica", "normal");
  const bankDetails = [
    "Bank Name: ABCB",
    "Account Holder Name: Suite Plus Information Technology",
    "Account Number: 1553847920001",
    "IBAN: AE650300011553847920001",
    "Account Type: Current",
  ];

  bankDetails.forEach((text, i) => doc.text(`- ${text}`, 50, finalY + 60 + i * 15));

  doc.addImage(footerImg, "PNG", 0, 750, 595, 50);

  doc.save(`Invoice-${invoice.invoiceNumber}.pdf`);
};

  const formatDate = (date: string | number) => {
    const parsedDate = new Date(date);
    return format(parsedDate, "dd/MM/yyyy");
  };

  const handelSendEmail = async () => {
    try {
      const response = await fetch(`/api/Email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(invoice),
      });
    } catch (error) {
      
    }
  }


  if (loading) return <div>Loading...</div>;
  if (!invoice) return <div>No invoice found</div>;

  return (
    <div className="w-full h-full max-w-6xl mx-auto bg-white space-y-4">
      <Card className="w-full h-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
          <div className="space-y-1.5">
            <CardTitle className="text-2xl">
              Invoice #{invoice.invoiceNumber}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              View invoice details and status!
            </p>
          </div>
          <Badge
            variant={invoice.status === "PAID" ? "default" : "secondary"}
            className="px-4 py-1"
          >
            {invoice.status}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="font-semibold">From</h3>
              <div className="text-sm">
                <p>{invoice.fromName}</p>
                <p>{invoice.fromEmail}</p>
                <p className="whitespace-pre-line">{invoice.fromAddress}</p>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">To</h3>
              <div className="text-sm">
                <p>{invoice.clientName}</p>
                <p>{invoice.clientEmail}</p>
                <p className="whitespace-pre-line">{invoice.clientAddress}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="font-semibold">Date</h3>
              <p className="text-sm">{formatDate(invoice.date)}</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Due Date</h3>
              <p className="text-sm">{invoice.dueDate}</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="font-semibold">Items</h3>
            <div className="rounded-lg border">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-3 text-left text-sm">Description</th>
                    <th className="p-3 text-right text-sm">Quantity</th>
                    <th className="p-3 text-right text-sm">Rate</th>
                    <th className="p-3 text-right text-sm">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.invoiceItems.map((item, index) => (
                    <tr key={index} className="border-b last:border-0">
                      <td className="p-3 text-sm">{item.description}</td>
                      <td className="p-3 text-right text-sm">
                        {item.quantity}
                      </td>
                      <td className="p-3 text-right text-sm">
                        ${item.rate.toLocaleString("en-US")}
                      </td>
                      <td className="p-3 text-right text-sm">
                        ${item.amount.toLocaleString("en-US")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between font-semibold">
                  <span>Total ({invoice.currency})</span>
                  <span>${invoice.total.toLocaleString("en-US")}</span>
                </div>
              </div>
            </div>
          </div>

          {invoice.note && (
            <div className="space-y-2">
              <h3 className="font-semibold">Notes</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-line">
                {invoice.note}
              </p>
            </div>
          )}
          <div className="space-x-2">
            <Button onClick={saveInvoicePdf}>Download Invoice</Button>
            <Button variant={"secondary"} onClick={() => window.location.replace(`/Invoices/Invoice-Edit?id=${invoice.id}`)}>Edit Invoice</Button>
            <Button variant={"secondary"} onClick={handelSendEmail}>Send Email</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
