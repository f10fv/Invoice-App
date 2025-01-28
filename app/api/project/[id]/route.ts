import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT (req: Request, { params }: { params: { id: string } }) {
    const { id } = params;
      try {
        const updatedProject = await db.projects.update({
          where: { id: id as string },
          data: {
            status: "Completed",
          },
        });
        return NextResponse.json(updatedProject, { status: 200 });
    } catch (error) {
        console.error('Error updating Project:', error);
        return NextResponse.json({ message: 'Failed to update Project' }, { status: 500 });
      }
  }

  export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    try {
      const deleteProject = await db.projects.delete({
        where: { id: id as string },
      });
      return NextResponse.json(deleteProject, { status: 200 });
    } catch (error) {
      console.error('Error deleting Project:', error);
      return NextResponse.json({ message: 'Failed to delete Project' }, { status: 500 });
    }
  }