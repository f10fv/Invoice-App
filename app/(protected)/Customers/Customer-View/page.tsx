"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

interface CustomerData {
  id: string;
  customerName: string;
  customerEmail: string;
  customerAddress: string;
}

export default function CustomerView() {
  const id = useSearchParams().get("id");
  const [customer, setCustomer] = useState<CustomerData | null>(null);
  const [invoices, setInvoices] = useState<
    Array<{
      id: string;
      invoiceNumber: string;
      invoiceDate: string;
      totalAmount: number;
      status: string;
    }>
  >([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    fetch(`/api/customers/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setCustomer(data);
        setInvoices(data.invoices);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching customer:", error);
        setLoading(false);
      });
  }, [id]);

  return (
    <div className="w-full h-full max-w-6xl mx-auto bg-white space-y-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Customer Details</CardTitle>
          <CardDescription>
            View customer information and related invoices
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-2">
            <div className="text-sm font-medium">Customer Name</div>
            <div>{customer?.customerName}</div>
          </div>
          <div className="grid gap-2">
            <div className="text-sm font-medium">Email</div>
            <div>{customer?.customerEmail}</div>
          </div>
          <div className="grid gap-2">
            <div className="text-sm font-medium">Address</div>
            <div>{customer?.customerAddress}</div>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full h-[50vh]">
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
          <CardDescription>
            View all invoices associated with this customer
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice: any) => (
                <TableRow key={invoice.id}>
                  <TableCell>{invoice.invoiceNumber}</TableCell>{" "}
                  <TableCell>
                    {new Date(invoice.date).toLocaleDateString()}
                  </TableCell>{" "}
                  <TableCell>${invoice.total.toLocaleString("en-US")}</TableCell>{" "}
                  <TableCell>
                    <Badge className="bg-primary">{invoice.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <a
                      href={`/Invoices/Invoice-View?id=${invoice.id}`}
                      className="text-sm text-primary hover:underline"
                    >
                      View
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
