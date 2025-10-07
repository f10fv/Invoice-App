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
import { useCurrentUser } from "@/hooks/use-current-user";
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
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

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

const invoiceSchema = z.object({
  invoiceNumber: z.string().min(1, "Invoice number is required"),
  currency: z.enum(["USD", "EUR"]),
  date: z.date(),
  dueDate: z.string().min(1, "Due date is required"),
  note: z.string().optional(),
  total: z.number().min(0, "Total must be a positive value"),
});

export default function CreateInvoice() {
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
    invoiceItems: [{ description: "", quantity: 0, rate: 0, amount: 0 }],
    note: "",
    total: 0,
    projectId: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<
    (typeof clients)[0] | null
  >(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: "1", description: "", quantity: 0, rate: 0, amount: 0 },
  ]);
  const [open, setOpen] = useState(false);
  const [openProject, setOpenProject] = useState(false);
  const currentUser = useCurrentUser();

  useEffect(() => {
    if (!currentUser) return;
    setInvoice((prev) => ({
      ...prev,
      fromName: currentUser.name || "",
      fromEmail: currentUser.email || "",
    }));
  }, [currentUser?.name, currentUser?.email]);
  console.log(lineItems);
  const handleClientChange = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId);
    setSelectedClient(client || null);
    if (client) {
      setInvoice((prev) => ({
        ...prev,
        clientName: client.customerName,
        clientEmail: client.customerEmail,
        clientAddress: client.customerAddress,
        projectId: "",
      }));
    }
  };
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

    const fetchClientData = async () => {
      try {
        const response = await fetch("/api/customers");
        const data = await response.json();
        setClients(data);
        console.log("Client data:", clients);
      } catch (error) {
        console.error("Error fetching client data:", error);
      }
    };

    const fetchProjectData = async () => {
      try {
        const response = await fetch("/api/project");
        const data = await response.json();
        const filteredProjects = selectedClient
          ? data.filter(
              (project: Project) =>
                project.customerName === selectedClient.customerName
            )
          : [];
        setProjects(filteredProjects);
        console.log("Project data:", filteredProjects);
      } catch (error) {
        console.error("Error fetching project data:", error);
      }
    };

    fetchInvoiceNumber();
    fetchClientData();

    if (selectedClient) {
      fetchProjectData();
    } else {
      setProjects([]);
    }
  }, [selectedClient]);
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

  const validateInvoice = () => {
    const result = invoiceSchema.safeParse(invoice);
    if (!result.success) {
      const formattedErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        formattedErrors[issue.path.join(".")] = issue.message;
      });
      setErrors(formattedErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent, action: "save" | "send") => {
    e.preventDefault();
    if (!validateInvoice()) return;
    setIsSubmitting(true);
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
      date: invoice.date.toLocaleDateString("en-GB"),
    };

    console.log("Final invoice data:", finalInvoice);
    try {
      const response = await fetch("/api/invoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ invoice: finalInvoice, action }),
      });

      if (response.ok) {
        alert("Invoice submitted successfully!");
      }
      window.location.href = "/Invoices";
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

  const project = invoice;

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
                  readOnly
                  className="bg-gray-100 cursor-not-allowed"
                  placeholder="Your Name"
                />
                {errors.fromName && (
                  <p className="text-red-500 text-xs">{errors.fromName}</p>
                )}
                <Input
                  name="fromEmail"
                  value={invoice.fromEmail}
                  onChange={handleFormChange}
                  readOnly
                  className="bg-gray-100 cursor-not-allowed"
                  placeholder="Your Email"
                />
                {errors.fromEmail && (
                  <p className="text-red-500 text-xs">{errors.fromEmail}</p>
                )}
                <Input
                  name="fromAddress"
                  value={invoice.fromAddress}
                  onChange={handleFormChange}
                  placeholder="Your Address"
                />
                {errors.fromAddress && (
                  <p className="text-red-500 text-xs">{errors.fromAddress}</p>
                )}
              </div>
            </div>

            <div>
              <Label>To</Label>
              <div className="space-y-2">
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-full justify-between"
                    >
                      {selectedClient
                        ? selectedClient.customerName
                        : "Select client..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-[--radix-popover-trigger-width] p-0"
                    align="start"
                    sideOffset={0}
                  >
                    <Command>
                      <CommandInput placeholder="Search clients..." />
                      <CommandList>
                        <CommandEmpty>No client found.</CommandEmpty>
                        <CommandGroup>
                          {clients.map((client) => (
                            <CommandItem
                              key={client.id}
                              value={client.customerName}
                              onSelect={() => {
                                handleClientChange(client.id);
                                setOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedClient?.id === client.id
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {client.customerName}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <Input
                  placeholder="Client Email"
                  value={selectedClient?.customerEmail || ""}
                  readOnly
                />
                <Input
                  placeholder="Client Address"
                  value={selectedClient?.customerAddress || ""}
                  readOnly
                />
              </div>
            </div>
          </div>
          <Label>Project</Label>
          <div className="space-y-4">
            <Popover open={openProject} onOpenChange={setOpenProject}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openProject}
                  className="w-full justify-between"
                >
                  {projects.find((p) => p.id === project.projectId)
                    ?.projectName || "Select project..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-[--radix-popover-trigger-width] p-0"
                align="start"
                sideOffset={0}
              >
                <Command>
                  <CommandInput placeholder="Search projects..." />
                  <CommandList>
                    <CommandEmpty>
                      {!selectedClient
                        ? "Please select a client first"
                        : "No projects found for this client"}
                    </CommandEmpty>
                    <CommandGroup>
                      {projects.map((p) => (
                        <CommandItem
                          key={p.id}
                          value={p.projectName}
                          onSelect={() => {
                            handleProjectChange(p.id);
                            setOpenProject(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              project.projectId === p.id
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {p.projectName}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6 mt-5">
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
                  {errors.date && (
                    <p className="text-red-500 text-xs">{errors.date}</p>
                  )}
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
              {errors.dueDate && (
                <p className="text-red-500 text-xs">{errors.dueDate}</p>
              )}
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
                    <TableCell>${item.amount.toLocaleString("en-US")}</TableCell>
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
            {errors.note && <p className="text-red-500">{errors.note}</p>}
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={(e) => handleSubmit(e, "save")}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
            <Button
              type="button"
              onClick={(e) => handleSubmit(e, "send")}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Loading..." : "Save & Send"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
