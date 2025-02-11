"use client";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface ProjectData {
    id: string;
    projectName: string;
    projectNumber: number;
    customerName: string;
    description: string;
    startDate: string;
    endDate: string;
    status: string;
}
export default function ProjectViewPage() {
    const id = useSearchParams().get("id");
    const [project, setProject] = useState<ProjectData | null>(null);
    const [loading, setLoading] = useState(true);

     useEffect(() => {
        if (!id) return;
    
        setLoading(true);
        fetch(`/api/project/${id}`)
          .then((response) => response.json())
          .then((data) => {
            setProject(data);
            setLoading(false);
          })
          .catch((error) => {
            console.error("Error fetching project:", error);
            setLoading(false);
          });
      }, [id]);
    
      if (loading) return <div>Loading...</div>;
      if (!project) return <div>No project found</div>;

      return (
        <div className="w-full h-full mx-auto py-8">
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
            <div className="space-y-1">
              <CardTitle className="text-2xl">Project #{project.projectNumber}</CardTitle>
              <p className="text-sm text-muted-foreground">View project details and status</p>
            </div>
            <Badge className={`rounded-full text-white capitalize px-4 py-1 text-sm`}>{project.status}</Badge>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-5">Project Details :</h3>
                  <div className="space-y-2">
                  <div className="grid grid-cols-5">
                      <span className="text-sm text-muted-foreground">Project Number:</span>
                      <span>{project.projectNumber}</span>
                    </div>
                    <div className="grid grid-cols-5">
                      <span className="text-sm text-muted-foreground">Project Name:</span>
                      <span>{project.projectName}</span>
                    </div>
                  </div>
                </div>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-5">Customer Information :</h3>
                  <div className="space-y-2">
                    <div className="grid grid-cols-5">
                      <span className="text-sm text-muted-foreground">Customer Name:</span>
                      <span>{project.customerName}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-5">Timeline :</h3>
                  <div className="space-y-2">
                    <div className="grid grid-cols-5">
                      <span className="text-sm text-muted-foreground">Start Date:</span>
                      <span>{project.startDate.split("T")[0]}</span>
                    </div>
                    <div className="grid grid-cols-5">
                      <span className="text-sm text-muted-foreground">End Date:</span>
                      <span>{project.endDate.split("T")[0]}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground">{project.description}</p>
            </div>
          </CardContent>
        </Card>
        </div>
      )
}