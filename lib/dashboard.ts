import { db } from '@/lib/db'
import { DashboardStats, Invoice } from '../types/dashboard'

export async function getDashboardStats(): Promise<DashboardStats> {
  const [totalRevenue, invoices] = await Promise.all([
    db.invoice.aggregate({
      _sum: {
        total: true,
      },
    }),
    db.invoice.findMany({}),
  ])

  return {
    totalRevenue: totalRevenue._sum.total || 0,
    totalInvoices: invoices.length,
    paidInvoices: invoices.filter(i => i.status === 'PAID').length,
    pendingInvoices: invoices.filter(i => i.status === 'PENDING').length,
  }
}

export async function getRecentInvoices(): Promise<Invoice[]> {
  const invoices = await db.invoice.findMany({
    take: 6,
    orderBy: {
      createdAt: 'desc',
    },
  })

  return invoices.map(invoice => ({
    ...invoice,
    status: invoice.status as import('../types/dashboard').InvoiceStatus,
  }))
}

export async function getPaidInvoicesTimeline(): Promise<{ date: string; amount: number }[]> {
  const invoices = await db.invoice.findMany({
    where: {
      status: 'PAID',
    },
    orderBy: {
      createdAt: 'asc',
    },
  })

  return invoices.map(invoice => ({
    date: invoice.createdAt.toISOString().split('T')[0],
    amount: invoice.total,
  }))
}

