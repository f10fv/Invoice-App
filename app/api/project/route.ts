import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const project = await request.json();
        console.log("Project data:", project);

        const parseProjectNumber = parseInt(project.projectNumber);
        console.log("Parsed project number:", parseProjectNumber);

        const newProject = await db.projects.create({
            data: {
                projectName: project.projectName,
                projectNumber: project.projectNumber,
                customerName: project.customerName,
                description: project.description,
                startDate: new Date(project.startDate),
                endDate: new Date(project.endDate),
                status: "Not Started",
            },
        });

        return NextResponse.json(newProject, { status: 200 });
    } catch (error) {
        console.error("Error creating project:", error);
        return NextResponse.json({ message: "Failed to create project" }, { status: 500 });
    }
}

export async function GET() {
    try {
        const projects = await db.projects.findMany();
        return NextResponse.json(projects, { status: 200 });
    } catch (error) {
        console.error("Error fetching projects:", error);
        return NextResponse.json({ message: "Failed to fetch projects" }, { status: 500 });
    }
}