import { db } from "@/lib/db"
import { NextResponse } from "next/server"
import { PrismaClient } from '@prisma/client';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")

  if (!query) {
    return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
  }

  try {
    const invoices = await db.invoice.findMany({
      where: {
        OR: [
          { invoiceName: { contains: query, mode: "insensitive" } },
          { clientName: { contains: query, mode: "insensitive" } },
        ],
      },
      take: 5,
    })

    const projects = await db.projects.findMany({
      where: {
        OR: [
          { projectName: { contains: query, mode: "insensitive" } },
          { customerName: { contains: query, mode: "insensitive" } },
        ],
      },
      take: 5,
    })

    const customers = await db.customers.findMany({
      where: {
        OR: [
          { customerEmail: { contains: query, mode: "insensitive" } },
          { customerName: { contains: query, mode: "insensitive" } },
        ],
      },
      take: 5,
    })

    return NextResponse.json({ invoices, projects, customers })
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json({ error: "An error occurred while searching" }, { status: 500 })
  }
}

