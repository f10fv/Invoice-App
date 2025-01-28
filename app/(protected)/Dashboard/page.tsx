import { DollarSign, Users, FileCheck, AlertCircle } from 'lucide-react'
import { StatCard } from "@/components/stat-card"
import { InvoicesChart } from "@/components/invoices-chart"
import { RecentInvoices } from "@/components/recent-invoices"
import { getDashboardStats, getPaidInvoicesTimeline, getRecentInvoices } from "@/lib/dashboard"
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export default async function DashboardPage() {
  const [stats, timeline, recentInvoices] = await Promise.all([
    getDashboardStats(),
    getPaidInvoicesTimeline(),
    getRecentInvoices(),
  ])

  return (
    <div className="h-full flex-1 space-y-4 p-8 pt-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
          description="Based on total volume"
        />
        <StatCard
          title="Total Invoices Issued"
          value={`+${stats.totalInvoices}`}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
          description="Total Invoices Issued!"
        />
        <StatCard
          title="Paid Invoices"
          value={`+${stats.paidInvoices}`}
          icon={<FileCheck className="h-4 w-4 text-muted-foreground" />}
          description="Total Invoices which have been paid!"
        />
        <StatCard
          title="Pending Invoices"
          value={`+${stats.pendingInvoices}`}
          icon={<AlertCircle className="h-4 w-4 text-muted-foreground" />}
          description="Invoices which are currently pending!"
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Paid Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <InvoicesChart data={timeline} />
          </CardContent>
        </Card>
        <div className="col-span-3">
          <RecentInvoices invoices={recentInvoices} />
        </div>
      </div>
    </div>
  )
}

