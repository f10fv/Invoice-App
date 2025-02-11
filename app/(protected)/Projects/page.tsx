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
interface Project {
  id: string;
  projectName: string;
  projectNumber: number;
  customerName: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: string;
}
export default function InvoicesTable() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch("/api/project");
        if (!response.ok) {
          throw new Error("Failed to fetch projects");
        }
        const data = await response.json();
        setProjects(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  const handleMarkAsCompleted = async (id: string) => {
    try {
      const response = await fetch(`/api/project/${id}`, {
        method: "PATCH",
      });
      if (!response.ok) {
        throw new Error("Failed to mark invoice as paid");
      }
      const updateProject = await response.json();
      setProjects((prevProject) =>
        prevProject.map((project) =>
          project.id === id
            ? { ...project, status: "Completed" }
            : project
        )
      );
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/project/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete project");
      }
      setProjects((prevProjects) =>
        prevProjects.filter((project) => project.id !== id)
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
          <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
          <p className="text-sm text-muted-foreground">
            Manage your projects right here
          </p>
        </div>
        <Button onClick={() => {window.location.href = "/Projects/create"}}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Project
        </Button>
      </div>
      <div className="w-full rounded-md border h-96 overflow-y-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-white z-10">
            <TableRow>
              <TableHead>Project ID</TableHead>
              <TableHead>Project Name</TableHead>
              <TableHead>Customer Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead className="w-[70px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.projectNumber}>
                <TableCell className="font-medium">
                  #{project.projectNumber}
                </TableCell>
                <TableCell>{project.projectName}</TableCell>
                <TableCell>{project.customerName}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      project.status === "Completed" ? "secondary" : "default"
                    }
                    className="bg-black text-white"
                  >
                    {project.status}
                  </Badge>
                </TableCell>
                <TableCell>{project.description}</TableCell>
                <TableCell>
                  {new Date(project.startDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell>
                  {new Date(project.endDate).toLocaleDateString("en-US", {
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
                    <DropdownMenuItem onClick={() => handleMarkAsCompleted(project.id)}>Mark as completed</DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => {window.location.href = `/Projects/Project-View?id=${project.id}`}}
                      >
                        View project
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                      onClick={() => {window.location.href = `/Projects/Project-Edit?id=${project.id}`}}
                      >
                        Edit project
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                      className="text-red-600"
                      onClick={() => handleDelete(project.id)}
                      >
                        Delete project
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
