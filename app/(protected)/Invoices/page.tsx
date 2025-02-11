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
import fontkit from "@pdf-lib/fontkit";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


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
      
      const doc = new jsPDF("p", "pt", "a4"); // Portrait, Points, A4

      // Load Images
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
    
      // Add header image (left-aligned)
      doc.addImage(headerImg, "PNG", 50, 20, 200, 50);
    
      // Add logo (right-aligned)
      doc.addImage(logoImg, "PNG", 400, 20, 100, 50);
    
      // Invoice title
      doc.setFont("times", "bold");
      doc.setFontSize(24);
      doc.text("INVOICE", 50, 100);
    
      // Invoice details
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
    
      const details = [
        ["Invoice #", invoice.invoiceNumber.toString()],
        ["Date", invoice.date],
        ["Terms", "Due on receipt"],
        ["Due Date", invoice.dueDate.toString()],
        ["PO #", invoice.invoiceNumber.toString()],
        ["Status", "Open"],
      ];
    
      details.forEach(([label, value], i) => {
        if (!value) value = "N/A"; // Prevents undefined issues
        const y = 120 + i * 20;
        doc.text(label, 50, y);
        doc.setFont("helvetica", "normal");
        doc.text(String(value), 130, y);  // Ensuring value is a string
        doc.setFont("helvetica", "bold");
    });
    
      // Right-side details
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
    
      // Table
      let tableY = 280; // starting Y position of the table
      const tableResult = autoTable(doc, {
      startY: tableY,
      head: [["#", "Description", "Quantity", "Unit Price", "Total"]],
      headStyles: { fillColor: [0, 51, 153], textColor: [255, 255, 255] },
      body: invoice.invoiceItems.map((item, index) => {
        tableY += 20; // add 20 to the Y position for each row
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
    
    // Total row
    const finalY = tableY + 10;
    doc.setFont("helvetica", "bold");
    doc.text("Total", 400, finalY);
    doc.text(`${invoice.total.toFixed(2)} ${invoice.currency}`, 480, finalY);
    
      // Bank details
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
    
      // Add footer image
      doc.addImage(footerImg, "PNG", 0, 750, 595, 50);
    
      // Save & Download PDF
      doc.save(`Invoice-${invoice.invoiceNumber}.pdf`);
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
