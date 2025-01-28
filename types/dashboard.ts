import { ReactNode } from "react"

export type InvoiceStatus = 'PAID' | 'PENDING'

export interface Customer {
  id: string
  name: string
  email: string
}

export interface Invoice {
  clientEmail: ReactNode
  clientName: any
  id: string
  createdAt: Date
  total: number
  status: InvoiceStatus
}

export interface DashboardStats {
  totalRevenue: number
  totalInvoices: number
  paidInvoices: number
  pendingInvoices: number
}

