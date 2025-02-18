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
import { Textarea } from "@/components/ui/textarea";
import { CalendarIcon } from "lucide-react";
import { z } from "zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const projectSchema = z.object({
  projectName: z.string().min(3, "Project name must be at least 3 characters"),
  projectNumber: z.string(),
  // customerName: z.string().min(1, "Customer name is required"),
  description: z.string().optional(),
  startDate: z.date(),
  endDate: z.date().refine((date) => date >= new Date(), "End date must be after start date")
}).superRefine((data, ctx) => {
  if (data.endDate < data.startDate) {
    ctx.addIssue({
      path: ['endDate'],
      message: 'End date must be after start date',
      code: z.ZodIssueCode.custom
    });
  }
});


interface Client {
  id: string
  customerName: string
}

export default function CreateProject() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [project, setProject] = useState({
    projectName: "",
    projectNumber: "",
    customerName: "",
    description: "",
    startDate: startDate,
    endDate: endDate,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({} as Record<string, string>);
  const [clients, setClients] = useState<Client[]>([])
  useEffect(() => {
      const fetchProjectNumber = async () => {
        try {
          const response = await fetch("/api/project-number");
          const data = await response.json();
          if (data.projectNumber) {
            setProject((prev) => ({
              ...prev,
              projectNumber: data.projectNumber,
            }));
          }
  
          console.log("project number:", data.projectNumber);
        } catch (error) {
          console.error("Error fetching project number:", error);
        }
      };

      const fetchClientData = async () => {
        try {
          const response = await fetch("/api/customers")
          const data = await response.json()
          setClients(data)
          console.log("Client data:", clients)
        } catch (error) {
          console.error("Error fetching client data:", error)
        }
      }
  
      fetchProjectNumber();
      fetchClientData();
    }, []);

    const handleClientChange = (clientId: string) => {
      const client = clients.find((c) => c.id === clientId)
      console.log("this the client", client)
      if (client) {
        setProject((prev) => ({
          ...prev,
          customerName: client.customerName,
        }))
      }
    }

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setProject((prevProject) => ({
      ...prevProject,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const validationResult = projectSchema.safeParse(project);
    if (!validationResult.success) {
      const newErrors: Record<string, string> = {};
      validationResult.error.errors.forEach((err) => {
        if (err.path.length > 0) {
          newErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(newErrors);
      return;
    }

    setErrors({});
    console.log("project data:", project);

    const finalProject = {
      ...project,
      startDate: project.startDate.toLocaleDateString('en-GB'),
      endDate: project.endDate.toLocaleDateString('en-GB')
    }
    console.log("finalProject data:", finalProject);
    try {
      const response = await fetch("/api/project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalProject),
      });

      if (response.ok) {
        alert("project submitted successfully!");
      }
    } catch (error) {
      console.error("Error submitting project:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-6xl mx-auto bg-white">
      <CardContent className="p-6">
        <div className="flex gap-2 mb-6">
          <Badge variant="secondary" className="text-sm px-3 py-1">
            Draft
          </Badge>
          <div className="flex flex-col gap-2 w-full">
          <Input
            className="max-w-1xl"
            name="projectName"
            value={project.projectName}
            onChange={handleFormChange}
            placeholder="Project Name"
          />
          {errors.projectName && <p className="text-xs text-red-500">{errors.projectName}</p>}
          </div>
        </div>
        <form noValidate>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <Label htmlFor="invoiceNumber">Project No.</Label>
              <div className="flex">
                <span className="px-3 border border-r-0 rounded-l-md bg-muted flex items-center">
                  #
                </span>
                <Input
                  id="projectNumber"
                  name="projectNumber"
                  value={project.projectNumber}
                  onChange={handleFormChange}
                  readOnly
                  className="bg-gray-100 cursor-not-allowed ml-1 rounded-l-none"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="currency">Customer Name</Label>
              <Select onValueChange={handleClientChange}>
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
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <Label>Start Date:</Label>
              <div className="space-y-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {startDate ? (
                        startDate.toLocaleDateString("en-US", {
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
                      selected={startDate}
                      onSelect={(date) => {
                        setStartDate(date || new Date());
                        setProject((prev) => ({
                          ...prev,
                          startDate: date || new Date(),
                        }));
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div>
              <Label>End Date:</Label>
              <div className="space-y-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {endDate ? (
                        endDate.toLocaleDateString("en-US", {
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
                      selected={endDate}
                      onSelect={(date) => {
                        setEndDate(date || new Date());
                        setProject((prev) => ({
                          ...prev,
                          endDate: date || new Date(),
                        }));
                      }}
                    />
                    
                  </PopoverContent>
                </Popover>
                {errors.endDate && (
                  <p className="text-xs text-red-500">{errors.endDate}</p>
                )}
              </div>
            </div>
          </div>
          <div className="mb-6">
            <div className="grid grid-cols-12 gap-4 mb-2 font-medium">
              <div>Description</div>
            </div>
            <div className="flex justify-between items-start">
              <div className="flex-1 mr-4">
                <Textarea
                  name="description"
                  value={project.description}
                  onChange={handleFormChange}
                  //   onChange={(e) =>
                  //     handleItemChange(0, "description", e.target.value)
                  //   }
                  placeholder="Project description"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Button onClick={handleSubmit} type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
