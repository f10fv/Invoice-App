import { NextResponse } from "next/server";
import { db } from "@/lib/db";
export async function GET() {
  try {
    console.log("Fetching project number");

    const lastProject = await db.projects.findFirst({
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        projectNumber: true,
      },
    });

    console.log("Last project:", lastProject);

    const nextProjectNumber = lastProject
      ? parseInt((lastProject.projectNumber as unknown as string).replace('PRO-', '')) + 1
      : 1;

    const formattedProjectNumber = `PRO-${nextProjectNumber.toString().padStart(3, "0")}`;

    return NextResponse.json({
    projectNumber: formattedProjectNumber,
    });
  } catch (error) {
    console.error("Error fetching project number:", error);
    return NextResponse.json({ error: "Failed to fetch project number" }, { status: 500 });
  }
}
