// "use client";

// import { useEffect, useRef, useState } from "react";
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
// import { useSearchParams } from "next/navigation";

// interface InvoiceItem {
//   id: number;
//   description: string;
//   quantity: number;
//   rate: number;
//   amount: number;
// }
// interface InvoiceData {
//     id: string;
//     total: number;
//     status: "PAID" | "PENDING";
//     date: string;
//     dueDate: number;
//     fromName: string;
//     fromEmail: string;
//     fromAddress: string;
//     clientName: string;
//     clientEmail: string;
//     clientAddress: string;
//     currency: string;
//     invoiceNumber: number;
//     note?: string;
//     createdAt: string;
//     updatedAt: string;
//     invoiceItems: {
//       id: number;
//       description: string;
//       quantity: number;
//       rate: number;
//       amount: number;
//       invoiceId: string;
//     }[];
//   }
// export default function EditInvoice() {
//   const id = useSearchParams().get("id")
//   const [loading, setLoading] = useState(true)
//   const invoiceRef = useRef<InvoiceData | null>(null)

//   const [selectedDate, setSelectedDate] = useState(new Date())
//   const [invoice, setInvoice] = useState<InvoiceData>({
//     id: "",
//     invoiceNumber: 0,
//     currency: "USD",
//     fromName: "",
//     fromEmail: "",
//     fromAddress: "",
//     clientName: "",
//     clientEmail: "",
//     clientAddress: "",
//     date: selectedDate.toISOString(),
//     dueDate: 0,
//     invoiceItems: [{ id: 0, description: "", quantity: 0, rate: 0, amount: 0, invoiceId: "" }],
//     note: "",
//     total: 0,
//     status: "PENDING",
//     createdAt: "",
//     updatedAt: "",
//   })

//   useEffect(() => {
//     if (!id) return

//     setLoading(true)
//     fetch(`/api/invoice/${id}`)
//       .then((response) => response.json())
//       .then((data) => {
//         setInvoice(data)
//         invoiceRef.current = data
//         setLoading(false)
//         console.log("This is the setInvoiceBeforeEdit ", data)
//       })
//       .catch((error) => {
//         console.error("Error fetching invoice:", error)
//         setLoading(false)
//       })
//   }, [id])
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
//       const response = await fetch(`/api/invoice/${id}`, {
//         method: "PUT",
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
//                   readOnly
//                   onChange={handleFormChange}
//                   className="bg-gray-100 cursor-not-allowed"
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
//                   readOnly
//                   className="bg-gray-100 cursor-not-allowed"
//                 />
//                 <Input
//                   name="fromEmail"
//                   value={invoice.fromEmail}
//                   onChange={handleFormChange}
//                   placeholder="Your Email"
//                   readOnly
//                   className="bg-gray-100 cursor-not-allowed"
//                 />
//                 <Input
//                   name="fromAddress"
//                   value={invoice.fromAddress}
//                   onChange={handleFormChange}
//                   placeholder="Your Address"
//                   readOnly
//                   className="bg-gray-100 cursor-not-allowed"
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
//                         date: (date || new Date()).toLocaleDateString("en-US", {
//                           year: "numeric",
//                           month: "long",
//                           day: "numeric",
//                         }),
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
//                 value={invoice.dueDate.toString()}
//                 onValueChange={(value) =>
//                   setInvoice((prev) => ({ ...prev, dueDate: parseInt(value) }))
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

import type React from "react";

import { useEffect, useState } from "react";
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
import { z } from "zod";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Trash2 } from "lucide-react";
import { useSearchParams } from "next/navigation";

interface InvoiceItem {
  id: number;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface Client {
  id: string;
  customerName: string;
  customerEmail: string;
  customerAddress: string;
}

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface Project {
  id: string;
  projectName: string;
  projectNumber: string;
  customerName: string;
}

// const invoiceSchema = z.object({
//   invoiceNumber: z.string().min(1, "Invoice number is required"),
//   currency: z.enum(["USD", "EUR"]),
//   date: z.date(),
//   dueDate: z.string().min(1, "Due date is required"),
//   note: z.string().optional(),
//   total: z.number().min(0, "Total must be a positive value"),
// });

export default function EditInvoice() {
  const id = useSearchParams().get("id");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [invoice, setInvoice] = useState({
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
    invoiceItems: [],
    note: "",
    total: 0,
    projectId: "",
    clientId: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [lineItems, setLineItems] = useState<LineItem[]>([]);

  useEffect(() => {
    const fetchInvoiceData = async () => {
      try {
        const response = await fetch(`/api/invoice/${id}`);
        const data = await response.json();

        setInvoice(data);
        setSelectedDate(new Date(data.date));
        setLineItems(
          data.invoiceItems.map((item: any, index: number) => ({
            id: index.toString(),
            ...item,
          }))
        );
        setSelectedClient(data.customer);
        setSelectedProject(data.project);

        console.log("Fetched invoice:", data);
      } catch (error) {
        console.error("Error fetching invoice:", error);
      }
    };

    const fetchClientData = async () => {
      try {
        const response = await fetch("/api/customers");
        const data = await response.json();
        setClients(data);
        console.log("Client data:", data);
      } catch (error) {
        console.error("Error fetching client data:", error);
      }
    };

    const fetchProjectData = async () => {
      try {
        const response = await fetch("/api/project");
        const data = await response.json();
        setProjects(data);
        console.log("Project data:", data);
      } catch (error) {
        console.error("Error fetching project data:", error);
      }
    };

    if (id) {
      fetchInvoiceData();
    }
    fetchClientData();
    fetchProjectData();
  }, [id]);

  const handleClientChange = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId);
    setSelectedClient(client || null);
    if (client) {
      setInvoice((prev) => ({
        ...prev,
        clientId: client.id,
        clientName: client.customerName,
        clientEmail: client.customerEmail,
        clientAddress: client.customerAddress,
      }));
    }
  };

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

  // const handleItemChange = (index: number, field: keyof Omit<InvoiceItem, "id">, value: string | number) => {
  //   const updatedItems = [...invoice.invoiceItems]
  //   const item = updatedItems[index]

  //   if (field === "description") {
  //     item[field] = value as string
  //   } else if (field === "quantity" || field === "rate") {
  //     item[field] = Number(value) || 0
  //   }

  //   const quantity = Number(item.quantity) || 0
  //   const rate = Number(item.rate) || 0
  //   item.amount = quantity * rate

  //   const updatedTotal = updatedItems.reduce((total, item) => total + (item.amount || 0), 0)

  //   setInvoice((prevInvoice) => ({
  //     ...prevInvoice,
  //     invoiceItems: updatedItems,
  //     total: updatedTotal,
  //   }))
  // }

  // const validateInvoice = () => {
  //   const result = invoiceSchema.safeParse(invoice);
  //   if (!result.success) {
  //     const formattedErrors: Record<string, string> = {};
  //     result.error.issues.forEach((issue) => {
  //       formattedErrors[issue.path.join(".")] = issue.message;
  //     });
  //     setErrors(formattedErrors);
  //     return false;
  //   }
  //   setErrors({});
  //   return true;
  // };

  const handleSubmit = async (e: React.FormEvent, action: "save" | "send") => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log(selectedClient)
    const currentTotal = lineItems.reduce((sum, item) => sum + item.amount, 0);
    const finalInvoice = {
      ...invoice,
      invoiceItems: lineItems
        .filter(
          (item) =>
            item.description.trim() !== "" ||
            item.quantity !== 0 ||
            item.rate !== 0
        )
        .map(({ id, ...rest }) => rest),
      total: currentTotal,
    };

    console.log("Final invoice data:", finalInvoice);
    try {
      const response = await fetch(`/api/invoice/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ invoice: finalInvoice, action }),
      });

      if (response.ok) {
        alert("Invoice submitted successfully!");
      }
    } catch (error) {
      console.error("Error submitting invoice:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      {
        id: Math.random().toString(36).substr(2, 9),
        description: "",
        quantity: 0,
        rate: 0,
        amount: 0,
      },
    ]);
  };

  const removeLineItem = (id: string) => {
    setLineItems(lineItems.filter((item) => item.id !== id));

    setTimeout(() => {
      const newTotal = lineItems
        .filter((item) => item.id !== id)
        .reduce((sum, item) => sum + item.amount, 0);
      setInvoice((prev) => ({
        ...prev,
        total: newTotal,
      }));
    }, 0);
  };

  const updateLineItem = (
    id: string,
    field: keyof LineItem,
    value: string | number
  ) => {
    setLineItems(
      lineItems.map((item) => {
        if (item.id === id) {
          const updates = { [field]: value };
          if (field === "quantity" || field === "rate") {
            const quantity =
              field === "quantity" ? Number(value) : item.quantity;
            const rate = field === "rate" ? Number(value) : item.rate;
            updates.amount = quantity * rate;
          }
          return { ...item, ...updates };
        }
        return item;
      })
    );

    setTimeout(() => {
      const newTotal = lineItems.reduce((sum, item) => sum + item.amount, 0);
      setInvoice((prev) => ({
        ...prev,
        total: newTotal,
      }));
    }, 0);
  };

  const calculateTotal = () => {
    const total = lineItems.reduce((sum, item) => sum + item.amount, 0);
    return total;
  };

  const handleProjectChange = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId);
    setSelectedProject(project || null);
    if (project) {
      setInvoice((prev) => ({
        ...prev,
        projectId: project.id,
      }));
    }
  };

  return (
    <Card className="w-full max-w-6xl mx-auto bg-white">
      <CardContent className="p-6">
        <form noValidate>
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
                  onChange={handleFormChange}
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
                  readOnly
                  className="bg-gray-100 cursor-not-allowed"
                />
                <Input
                  name="fromEmail"
                  value={invoice.fromEmail}
                  onChange={handleFormChange}
                  placeholder="Your Email"
                  readOnly
                  className="bg-gray-100 cursor-not-allowed"
                />
                <Input
                  name="fromAddress"
                  value={invoice.fromAddress}
                  onChange={handleFormChange}
                  placeholder="Your Address"
                  readOnly
                  className="bg-gray-100 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <Label>To</Label>
              <div className="space-y-2">
                <Select
                  value={invoice.clientId}
                  onValueChange={handleClientChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.customerName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Client Email"
                  value={invoice.clientEmail}
                  readOnly
                />
                <Input
                  placeholder="Client Address"
                  value={invoice.clientAddress}
                  readOnly
                />
              </div>
            </div>
          </div>

          <Label>Project</Label>
          <div className="space-y-4 mb-6">
            <Select
              value={invoice.projectId}
              onValueChange={handleProjectChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.projectName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                        date: date || new Date()
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

          <div className="mb-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">Description</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lineItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Input
                        value={item.description}
                        onChange={(e) =>
                          updateLineItem(item.id, "description", e.target.value)
                        }
                        placeholder="Item description"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          updateLineItem(item.id, "quantity", e.target.value)
                        }
                        className="w-24"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={item.rate}
                        onChange={(e) =>
                          updateLineItem(item.id, "rate", e.target.value)
                        }
                        className="w-24"
                      />
                    </TableCell>
                    <TableCell>${item.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeLineItem(item.id)}
                        disabled={lineItems.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button
              type="button"
              variant="outline"
              onClick={addLineItem}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" /> Add Item
            </Button>
          </div>

          <div className="flex justify-end mb-2">
            <div className="w-1/3">
              <div className="flex justify-between py-2">
                <span>Subtotal</span>
                <span>
                  {formatCurrency({
                    amount: Number(calculateTotal().toFixed(2)),
                    currency: invoice.currency as any,
                  })}
                </span>
              </div>
              <div className="flex justify-between py-2 border-t">
                <span>Total ({invoice.currency})</span>
                <span className="font-medium">
                  {formatCurrency({
                    amount: Number(calculateTotal().toFixed(2)),
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

          <div className="flex justify-end space-x-4">
            <Button type="button" onClick={(e) => handleSubmit(e, "save")} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
