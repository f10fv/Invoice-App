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
import { Card } from "@/components/ui/card";

interface Customer {
    id: string; 
    customerNumber: string;
    customerName: string;
    customerEmail: string;
    customerAddress: string;
}

export default function CustomersTable() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
    useEffect(() => {
        async function fetchCustomers() {
          try {
            const response = await fetch("/api/customers");
            if (!response.ok) {
              throw new Error("Failed to fetch customers");
            }
            const data = await response.json();
            setCustomers(data);
          } catch (error: any) {
            setError(error.message);
          } finally {
            setLoading(false);
          }
        }
    
        fetchCustomers();
      }, []);

      const handleDelete = (id: string) => async () => {
        const deleteCustomer = async () => {
          const response = await fetch(`/api/customers/${id}`, {
            method: "DELETE",
          });
          if (!response.ok) {
            throw new Error("Failed to delete customer");
          }
        };
        try {
          await deleteCustomer();
          setCustomers(customers.filter((customer) => customer.id !== id));
        } catch (error: any) {
          setError(error.message);
        }
      };


    return (
        <Card className="flex flex-col w-full h-full p-8 ">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Customers</h1>
              <p className="text-sm text-muted-foreground">
                Manage your customers right here
              </p>
            </div>
          </div>
          <div className="w-full rounded-md border h-96 overflow-y-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-white z-10">
                <TableRow>
                  <TableHead>Customer Name</TableHead>
                  <TableHead>Customer Email</TableHead>
                  <TableHead>Customer Address</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell>{customer.customerName}</TableCell>
                    <TableCell>{customer.customerEmail}</TableCell>
                    <TableCell>{customer.customerAddress}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => window.location.href = `/Customers/Customer-View?id=${customer.id}`}>
                            View customer
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => window.location.href = `/Customers/Customer-Edit?id=${customer.id}`}>
                            Edit customer
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                          className="text-red-600"
                          onClick={handleDelete(customer.id)}
                          >
                            Delete customer
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