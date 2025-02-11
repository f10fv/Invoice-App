// "use client";

// import { useEffect, useState } from "react";
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
// import { Textarea } from "@/components/ui/textarea";
// import { CalendarIcon } from "lucide-react";
// import { useSearchParams } from "next/navigation";

// export default function EditProjectPage() {
//   const id = useSearchParams().get("id");
//   const [startDate, setStartDate] = useState(new Date());
//   const [endDate, setEndDate] = useState(new Date());
//   const [loading, setLoading] = useState(true);
//   const [project, setProject] = useState({
//     projectName: "",
//     projectNumber: "",
//     customerName: "",
//     description: "",
//     startDate: startDate,
//     endDate: endDate,
//   });

//     useEffect(() => {
//       if (!id) return;
  
//       setLoading(true);
//       fetch(`/api/project/${id}`)
//         .then((response) => response.json())
//         .then((data) => {
//           setProject(data);
//           setLoading(false);
//           console.log("This the project ", project)
//         })
//         .catch((error) => {
//           console.error("Error fetching project:", error);
//           setLoading(false);
//         });
//     }, [id]);

//   const handleFormChange = (
//     e: React.ChangeEvent<
//       HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
//     >
//   ) => {
//     const { name, value } = e.target;
//     setProject((prevProject) => ({
//       ...prevProject,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     console.log("project data:", project);
//     try {
//       const response = await fetch(`/api/project/${id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(project),
//       });

//       if (response.ok) {
//         alert("project submitted successfully!");
//       }
//     } catch (error) {
//       console.error("Error submitting project:", error);
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
//             name="projectName"
//             value={project.projectName}
//             onChange={handleFormChange}
//             placeholder="Project Name"
//           />
//         </div>
//         <form noValidate>
//           <div className="grid md:grid-cols-2 gap-6 mb-6">
//             <div>
//               <Label htmlFor="invoiceNumber">Project No.</Label>
//               <div className="flex">
//                 <span className="px-3 border border-r-0 rounded-l-md bg-muted flex items-center">
//                   #
//                 </span>
//                 <Input
//                   id="projectNumber"
//                   name="projectNumber"
//                   value={project.projectNumber}
//                   onChange={handleFormChange}
//                   className="rounded-l-none"
//                 />
//               </div>
//             </div>

//             <div>
//               <Label htmlFor="currency">Customer Name</Label>
//               <Input
//                 name="customerName"
//                 value={project.customerName}
//                 onChange={handleFormChange}
//                 placeholder="Enter the customer name"
//               />
//             </div>
//           </div>

//           <div className="grid md:grid-cols-2 gap-6 mb-6">
//             <div>
//               <Label>Start Date:</Label>
//               <div className="space-y-2">
//                 <Popover>
//                   <PopoverTrigger asChild>
//                     <Button
//                       variant="outline"
//                       className="w-full justify-start text-left font-normal"
//                     >
//                       <CalendarIcon className="mr-2 h-4 w-4" />
//                       {startDate ? (
//                         startDate.toLocaleDateString("en-US", {
//                           year: "numeric",
//                           month: "long",
//                           day: "numeric",
//                         })
//                       ) : (
//                         <span>Pick a date</span>
//                       )}
//                     </Button>
//                   </PopoverTrigger>
//                   <PopoverContent className="w-auto p-0">
//                     <Calendar
//                       mode="single"
//                       selected={startDate}
//                       onSelect={(date) => {
//                         setStartDate(date || new Date());
//                         setProject((prev) => ({
//                           ...prev,
//                           startDate: date || new Date(),
//                         }));
//                       }}
//                     />
//                   </PopoverContent>
//                 </Popover>
//               </div>
//             </div>

//             <div>
//               <Label>End Date:</Label>
//               <div className="space-y-2">
//                 <Popover>
//                   <PopoverTrigger asChild>
//                     <Button
//                       variant="outline"
//                       className="w-full justify-start text-left font-normal"
//                     >
//                       <CalendarIcon className="mr-2 h-4 w-4" />
//                       {endDate ? (
//                         endDate.toLocaleDateString("en-US", {
//                           year: "numeric",
//                           month: "long",
//                           day: "numeric",
//                         })
//                       ) : (
//                         <span>Pick a date</span>
//                       )}
//                     </Button>
//                   </PopoverTrigger>
//                   <PopoverContent className="w-auto p-0">
//                     <Calendar
//                       mode="single"
//                       selected={endDate}
//                       onSelect={(date) => {
//                         setEndDate(date || new Date());
//                         setProject((prev) => ({
//                           ...prev,
//                           endDate: date || new Date(),
//                         }));
//                       }}
//                     />
//                   </PopoverContent>
//                 </Popover>
//               </div>
//             </div>
//           </div>
//           <div className="mb-6">
//             <div className="grid grid-cols-12 gap-4 mb-2 font-medium">
//               <div>Description</div>
//             </div>
//             <div className="flex justify-between items-start">
//               <div className="flex-1 mr-4">
//                 <Textarea
//                   name="description"
//                   value={project.description}
//                   onChange={handleFormChange}
//                   //   onChange={(e) =>
//                   //     handleItemChange(0, "description", e.target.value)
//                   //   }
//                   placeholder="Project description"
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="flex justify-center">
//             <Button onClick={handleSubmit} type="submit" className="w-full">
//               Submit
//             </Button>
//           </div>
//         </form>
//       </CardContent>
//     </Card>
//   );
// }

"use client";

import { useEffect, useRef, useState } from "react";
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
import { useSearchParams } from "next/navigation";

export default function EditProjectPage() {
  const id = useSearchParams().get("id")
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const [loading, setLoading] = useState(true)
  const projectRef = useRef(null)

  const [project, setProject] = useState({
    projectName: "",
    projectNumber: "",
    customerName: "",
    description: "",
    startDate: startDate,
    endDate: endDate,
  })

  useEffect(() => {
    if (!id) return

    setLoading(true)
    fetch(`/api/project/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setProject(data)
        projectRef.current = data
        setLoading(false)
        console.log("This is the project ", data)
      })
      .catch((error) => {
        console.error("Error fetching project:", error)
        setLoading(false)
      })
  }, [id])

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
    console.log("project data:", project);
    try {
      const response = await fetch(`/api/project/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(project),
      });

      if (response.ok) {
        alert("project submitted successfully!");
      }
    } catch (error) {
      console.error("Error submitting project:", error);
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
            name="projectName"
            value={project.projectName}
            onChange={handleFormChange}
            placeholder="Project Name"
          />
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
                  className="rounded-l-none"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="currency">Customer Name</Label>
              <Input
                name="customerName"
                value={project.customerName}
                onChange={handleFormChange}
                placeholder="Enter the customer name"
              />
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
            <Button onClick={handleSubmit} type="submit" className="w-full">
              Submit
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
