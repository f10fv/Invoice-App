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
        method: "PUT",
      });
      if (!response.ok) {
        throw new Error("Failed to mark invoice as paid");
      }
      const updatedInvoice = await response.json();
      setInvoices((prevInvoices) =>
        prevInvoices.map((invoice) =>
          invoice.id === id
            ? { ...invoice, status: "PAID" }
            : invoice
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
        <Button onClick={() => {window.location.href = "/Invoices/create"}}>
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
                    <DropdownMenuItem onClick={() => handleMarkAsPaid(invoice.id)}>Mark as paid</DropdownMenuItem>
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
