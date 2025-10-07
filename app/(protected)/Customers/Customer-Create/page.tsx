"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation"

const formSchema = z.object({
  customerName: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  customerEmail: z.string().email({
    message: "Please enter a valid email address.",
  }),
  customerAddress: z.string().min(5, {
    message: "Address must be at least 5 characters.",
  }),
})

interface CustomerData {
    id: string;
    customerName: string;
    customerEmail: string;
    customerAddress: string;
  }
export default function CustomerCreate() {
    const [customer, setCustomer] = useState<CustomerData | null>(null);
    const id = useSearchParams().get("id");
    const [loading, setLoading] = useState(true);
    const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: customer?.customerName,
      customerEmail: customer?.customerAddress,
      customerAddress: customer?.customerAddress,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await fetch(`/api/customers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });
      form.reset();
      alert("Customer created successfully!");
      window.location.href = "/Customers";
    } catch (error) {
      console.error("Error creating customer:", error);
    }
  }

  return (
    <div className="w-full h-full max-w-6xl mx-auto bg-white">
      <Card className="w-full h-full">
        <CardHeader>
          <CardTitle className="text-xl">Create Customer</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <Form  {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="customerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input className="w-[100%]" placeholder="Enter customer name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="customerEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input className="w-[100%]" placeholder="Enter customer email" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="customerAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input className="w-[100%]" placeholder="Enter customer address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Creating..." : "Create Customer"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  )
}

