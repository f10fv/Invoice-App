import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Invoice } from "@/types/dashboard"

interface RecentInvoicesProps {
  invoices: Invoice[]
}

export function RecentInvoices({ invoices }: RecentInvoicesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Invoices</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {invoices.map((invoice) => (
            <div key={invoice.id} className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarFallback>
                  {invoice.clientName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none text-black">
                  {invoice.clientName}
                </p>
                <p className="text-sm text-muted-foreground">
                  {invoice.clientEmail}
                </p>
              </div>
              <div className="ml-auto font-medium">
                +${invoice.total.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

