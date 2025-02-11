// "use client";

// import { useState } from "react";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Calendar } from "@/components/ui/calendar";
// import { Card, CardContent } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Textarea } from "@/components/ui/textarea";
// import { CalendarIcon } from "lucide-react";
// import { formatCurrency } from "@/lib/formatCurrency";
// import { SubmitButton } from "@/app/(protected)/_components/submitButton";

// interface InvoiceItem {
//   id: number;
//   description: string;
//   quantity: number;
//   rate: number;
//   amount: number;
// }
// export default function CreateInvoice() {
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [invoice, setInvoice] = useState({
//     invoiceName: "",
//     invoiceNumber: "",
//     currency: "USD",
//     fromName: "",
//     fromEmail: "",
//     fromAddress: "",
//     clientName: "",
//     clientEmail: "",
//     clientAddress: "",
//     date: selectedDate,
//     dueDate: "",
//     invoiceItems: [{ description: "", quantity: 0, rate: 0, amount: 0 }],
//     note: "",
//     total: 0,
//   });
//   const handleFormChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
//     >
//   ) => {
//     const { name, value } = e.target;
//     setInvoice((prevInvoice) => ({
//       ...prevInvoice,
//       [name]: value,
//     }));
//   };

//   const handleItemChange = (
//     index: number,
//     field: keyof Omit<InvoiceItem, 'id'>,
//     value: string | number
//   ) => {
//     const updatedItems = [...invoice.invoiceItems];
//     const item = updatedItems[index];

//     if (field === 'description') {
//       item[field] = value as string;
//     } else if (field === 'quantity' || field === 'rate') {
//       item[field] = Number(value) || 0;
//     }

//     const quantity = Number(item.quantity) || 0;
//     const rate = Number(item.rate) || 0;
//     item.amount = quantity * rate;

//     const updatedTotal = updatedItems.reduce(
//       (total, item) => total + (item.amount || 0),
//       0
//     );

//     setInvoice((prevInvoice) => ({
//       ...prevInvoice,
//       invoiceItems: updatedItems,
//       total: updatedTotal,
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       const response = await fetch("/api/invoice", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(invoice),
//       });

//       if (response.ok) {
//         alert("Invoice submitted successfully!");
//       }
//     } catch (error) {
//       console.error("Error submitting invoice:", error);
//     }
//   };
//   return (
//     <Card className="w-full max-w-6xl mx-auto bg-white">
//       <CardContent className="p-6">
//         <div className="flex gap-2 mb-6">
//           <Badge variant="secondary" className="text-sm px-3 py-1">
//             Draft
//           </Badge>
//           <Input
//             className="max-w-1xl"
//             name="invoiceName"
//             value={invoice.invoiceName}
//             onChange={handleFormChange}
//             placeholder="Invoice Name"
//           />
//         </div>
//         <form onSubmit={handleSubmit} noValidate>
//           <div className="grid md:grid-cols-2 gap-6 mb-6">
//             <div>
//               <Label htmlFor="invoiceNumber">Invoice No.</Label>
//               <div className="flex">
//                 <span className="px-3 border border-r-0 rounded-l-md bg-muted flex items-center">
//                   #
//                 </span>
//                 <Input
//                   id="invoiceNumber"
//                   name="invoiceNumber"
//                   value={invoice.invoiceNumber}
//                   onChange={handleFormChange}
//                   className="rounded-l-none"
//                 />
//               </div>
//             </div>

//             <div>
//               <Label htmlFor="currency">Currency</Label>
//               <Select
//                 value={invoice.currency}
//                 name="currency"
//                 onValueChange={(value) =>
//                   setInvoice((prev) => ({ ...prev, currency: value }))
//                 }
//               >
//                 <SelectTrigger id="currency">
//                   <SelectValue placeholder="Select Currency" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="USD">
//                     United States Dollar -- USD
//                   </SelectItem>
//                   <SelectItem value="EUR">Euro -- EUR</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           <div className="grid md:grid-cols-2 gap-6 mb-6">
//             <div>
//               <Label>From</Label>
//               <div className="space-y-2">
//                 <Input
//                   name="fromName"
//                   value={invoice.fromName}
//                   onChange={handleFormChange}
//                   placeholder="Your Name"
//                 />
//                 <Input
//                   name="fromEmail"
//                   value={invoice.fromEmail}
//                   onChange={handleFormChange}
//                   placeholder="Your Email"
//                 />
//                 <Input
//                   name="fromAddress"
//                   value={invoice.fromAddress}
//                   onChange={handleFormChange}
//                   placeholder="Your Address"
//                 />
//               </div>
//             </div>

//             <div>
//               <Label>To</Label>
//               <div className="space-y-2">
//                 <Input
//                   name="clientName"
//                   value={invoice.clientName}
//                   onChange={handleFormChange}
//                   placeholder="Client Name"
//                 />
//                 <Input
//                   name="clientEmail"
//                   value={invoice.clientEmail}
//                   onChange={handleFormChange}
//                   placeholder="Client Email"
//                 />
//                 <Input
//                   name="clientAddress"
//                   value={invoice.clientAddress}
//                   onChange={handleFormChange}
//                   placeholder="Client Address"
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="grid md:grid-cols-2 gap-6 mb-6">
//             <div>
//               <Label>Date</Label>
//               <Popover>
//                 <PopoverTrigger asChild>
//                   <Button
//                     variant="outline"
//                     className="w-full justify-start text-left font-normal"
//                   >
//                     <CalendarIcon className="mr-2 h-4 w-4" />
//                     {selectedDate ? (
//                       selectedDate.toLocaleDateString("en-US", {
//                         year: "numeric",
//                         month: "long",
//                         day: "numeric",
//                       })
//                     ) : (
//                       <span>Pick a date</span>
//                     )}
//                   </Button>
//                 </PopoverTrigger>
//                 <PopoverContent className="w-auto p-0">
//                   <Calendar
//                     mode="single"
//                     selected={selectedDate}
//                     onSelect={(date) => {
//                       setSelectedDate(date || new Date());
//                       setInvoice((prev) => ({
//                         ...prev,
//                         date: date || new Date(),
//                       }));
//                     }}
//                   />
//                 </PopoverContent>
//               </Popover>
//             </div>

//             <div>
//               <Label htmlFor="dueDate">Invoice Due</Label>
//               <Select
//                 name="dueDate"
//                 value={invoice.dueDate}
//                 onValueChange={(value) =>
//                   setInvoice((prev) => ({ ...prev, dueDate: value }))
//                 }
//               >
//                 <SelectTrigger id="dueDate">
//                   <SelectValue placeholder="Select due date" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="0">Due on Receipt</SelectItem>
//                   <SelectItem value="15">Net 15</SelectItem>
//                   <SelectItem value="30">Net 30</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           <div className="mb-6">
//             <div className="grid grid-cols-12 gap-4 mb-2 font-medium">
//               <div className="col-span-6">Description</div>
//               <div className="col-span-2">Quantity</div>
//               <div className="col-span-2">Rate</div>
//               <div className="col-span-2">Amount</div>
//             </div>
//             <div className="grid grid-cols-12 gap-4 items-start">
//               <div className="col-span-6">
//                 <Textarea
//                   name="description"
//                   value={invoice.invoiceItems[0]?.description}
//                   onChange={(e) =>
//                     handleItemChange(0, "description", e.target.value)
//                   }
//                   placeholder="Item description"
//                 />
//               </div>
//               <div className="col-span-2">
//                 <Input
//                   type="number"
//                   name="quantity"
//                   value={invoice.invoiceItems[0]?.quantity}
//                   onChange={(e) =>
//                     handleItemChange(0, "quantity", e.target.value)
//                   }
//                 />
//               </div>
//               <div className="col-span-2">
//                 <Input
//                   type="number"
//                   name="rate"
//                   value={invoice.invoiceItems[0]?.rate}
//                   onChange={(e) => handleItemChange(0, "rate", e.target.value)}
//                 />
//               </div>
//               <div className="col-span-2">
//                 <Input
//                   value={formatCurrency({
//                     amount: invoice.invoiceItems[0]?.amount || 0,
//                     currency: invoice.currency as any,
//                   })}
//                   disabled
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="flex justify-end mb-6">
//             <div className="w-1/3">
//               <div className="flex justify-between py-2">
//                 <span>Subtotal</span>
//                 <span>
//                   {formatCurrency({
//                     amount: invoice.total,
//                     currency: invoice.currency as any,
//                   })}
//                 </span>
//               </div>
//               <div className="flex justify-between py-2 border-t">
//                 <span>Total ({invoice.currency})</span>
//                 <span className="font-medium">
//                   {formatCurrency({
//                     amount: invoice.total,
//                     currency: invoice.currency as any,
//                   })}
//                 </span>
//               </div>
//             </div>
//           </div>

//           <div className="mb-6">
//             <Label htmlFor="note">Note</Label>
//             <Textarea
//               id="note"
//               name="note"
//               value={invoice.note}
//               onChange={handleFormChange}
//               placeholder="Add your notes here..."
//             />
//           </div>

//           <div className="flex justify-end">
//             <SubmitButton text="Send Invoice" />
//           </div>
//         </form>
//       </CardContent>
//     </Card>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon } from "lucide-react";
import { formatCurrency } from "@/lib/formatCurrency";
import { SubmitButton } from "@/app/(protected)/_components/submitButton";

interface InvoiceItem {
  id: number;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}
export default function CreateInvoice() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [invoice, setInvoice] = useState({
    invoiceName: "",
    invoiceNumber: "",
    currency: "USD",
    fromName: "",
    fromEmail: "",
    fromAddress: "",
    clientName: "",
    clientEmail: "",
    clientAddress: "",
    date: selectedDate,
    dueDate: "",
    invoiceItems: [{ description: "", quantity: 0, rate: 0, amount: 0 }],
    note: "",
    total: 0,
  });

  useEffect(() => {
    const fetchInvoiceNumber = async () => {
      try {
        const response = await fetch("/api/invoice-number");
        const data = await response.json();
        if (data.invoiceNumber) {
          setInvoice((prev) => ({
            ...prev,
            invoiceNumber: data.invoiceNumber,
          }));
        }

        console.log("Invoice number:", data.invoiceNumber);
      } catch (error) {
        console.error("Error fetching invoice number:", error);
      }
    };

    fetchInvoiceNumber();
  }, []);

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setInvoice((prevInvoice) => ({
      ...prevInvoice,
      [name]: value,
    }));
  };

  const handleItemChange = (
    index: number,
    field: keyof Omit<InvoiceItem, "id">,
    value: string | number
  ) => {
    const updatedItems = [...invoice.invoiceItems];
    const item = updatedItems[index];

    if (field === "description") {
      item[field] = value as string;
    } else if (field === "quantity" || field === "rate") {
      item[field] = Number(value) || 0;
    }

    const quantity = Number(item.quantity) || 0;
    const rate = Number(item.rate) || 0;
    item.amount = quantity * rate;

    const updatedTotal = updatedItems.reduce(
      (total, item) => total + (item.amount || 0),
      0
    );

    setInvoice((prevInvoice) => ({
      ...prevInvoice,
      invoiceItems: updatedItems,
      total: updatedTotal,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/invoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(invoice),
      });

      if (response.ok) {
        alert("Invoice submitted successfully!");
      }
    } catch (error) {
      console.error("Error submitting invoice:", error);
    }
  };

  return (
    <Card className="w-full max-w-6xl mx-auto bg-white">
      <CardContent className="p-6">
        <div className="flex gap-2 mb-6">
          <Badge variant="secondary" className="text-sm px-3 py-1">
            Draft
          </Badge>
          <Input
            className="max-w-1xl"
            name="invoiceName"
            value={invoice.invoiceName}
            onChange={handleFormChange}
            placeholder="Invoice Name"
          />
        </div>
        <form onSubmit={handleSubmit} noValidate>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <Label htmlFor="invoiceNumber">Invoice No.</Label>
              <div className="flex">
                <span className="px-3 border border-r-0 rounded-l-md bg-muted flex items-center">
                  #
                </span>
                <Input
                  id="invoiceNumber"
                  name="invoiceNumber"
                  value={invoice.invoiceNumber}
                  readOnly
                  className="bg-gray-100 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={invoice.currency}
                name="currency"
                onValueChange={(value) =>
                  setInvoice((prev) => ({ ...prev, currency: value }))
                }
              >
                <SelectTrigger id="currency">
                  <SelectValue placeholder="Select Currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">
                    United States Dollar -- USD
                  </SelectItem>
                  <SelectItem value="EUR">Euro -- EUR</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <Label>From</Label>
              <div className="space-y-2">
                <Input
                  name="fromName"
                  value={invoice.fromName}
                  onChange={handleFormChange}
                  placeholder="Your Name"
                />
                <Input
                  name="fromEmail"
                  value={invoice.fromEmail}
                  onChange={handleFormChange}
                  placeholder="Your Email"
                />
                <Input
                  name="fromAddress"
                  value={invoice.fromAddress}
                  onChange={handleFormChange}
                  placeholder="Your Address"
                />
              </div>
            </div>

            <div>
              <Label>To</Label>
              <div className="space-y-2">
                <Input
                  name="clientName"
                  value={invoice.clientName}
                  onChange={handleFormChange}
                  placeholder="Client Name"
                />
                <Input
                  name="clientEmail"
                  value={invoice.clientEmail}
                  onChange={handleFormChange}
                  placeholder="Client Email"
                />
                <Input
                  name="clientAddress"
                  value={invoice.clientAddress}
                  onChange={handleFormChange}
                  placeholder="Client Address"
                />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? (
                      selectedDate.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      setSelectedDate(date || new Date());
                      setInvoice((prev) => ({
                        ...prev,
                        date: date || new Date(),
                      }));
                    }}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label htmlFor="dueDate">Invoice Due</Label>
              <Select
                name="dueDate"
                value={invoice.dueDate}
                onValueChange={(value) =>
                  setInvoice((prev) => ({ ...prev, dueDate: value }))
                }
              >
                <SelectTrigger id="dueDate">
                  <SelectValue placeholder="Select due date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Due on Receipt</SelectItem>
                  <SelectItem value="15">Net 15</SelectItem>
                  <SelectItem value="30">Net 30</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mb-6">
            <div className="grid grid-cols-12 gap-4 mb-2 font-medium">
              <div className="col-span-6">Description</div>
              <div className="col-span-2">Quantity</div>
              <div className="col-span-2">Rate</div>
              <div className="col-span-2">Amount</div>
            </div>
            <div className="grid grid-cols-12 gap-4 items-start">
              <div className="col-span-6">
                <Textarea
                  name="description"
                  value={invoice.invoiceItems[0]?.description}
                  onChange={(e) =>
                    handleItemChange(0, "description", e.target.value)
                  }
                  placeholder="Item description"
                />
              </div>
              <div className="col-span-2">
                <Input
                  type="number"
                  name="quantity"
                  value={invoice.invoiceItems[0]?.quantity}
                  onChange={(e) =>
                    handleItemChange(0, "quantity", e.target.value)
                  }
                />
              </div>
              <div className="col-span-2">
                <Input
                  type="number"
                  name="rate"
                  value={invoice.invoiceItems[0]?.rate}
                  onChange={(e) => handleItemChange(0, "rate", e.target.value)}
                />
              </div>
              <div className="col-span-2">
                <Input
                  value={formatCurrency({
                    amount: invoice.invoiceItems[0]?.amount || 0,
                    currency: invoice.currency as any,
                  })}
                  disabled
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end mb-6">
            <div className="w-1/3">
              <div className="flex justify-between py-2">
                <span>Subtotal</span>
                <span>
                  {formatCurrency({
                    amount: invoice.total,
                    currency: invoice.currency as any,
                  })}
                </span>
              </div>
              <div className="flex justify-between py-2 border-t">
                <span>Total ({invoice.currency})</span>
                <span className="font-medium">
                  {formatCurrency({
                    amount: invoice.total,
                    currency: invoice.currency as any,
                  })}
                </span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <Label htmlFor="note">Note</Label>
            <Textarea
              id="note"
              name="note"
              value={invoice.note}
              onChange={handleFormChange}
              placeholder="Add your notes here..."
            />
          </div>

          <div className="flex justify-end">
            <SubmitButton text="Send Invoice" />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
