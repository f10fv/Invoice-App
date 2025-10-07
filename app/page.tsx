import Link from "next/link"
import { Button } from "@/components/ui/button"
export default function HomePage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{ backgroundColor: "var(--invoice-background)" }}
    >

      <div className="text-center space-y-8 max-w-md">
        <div
          className="mx-auto w-24 h-24 rounded-2xl flex items-center justify-center mb-8 border-2"
          style={{
            backgroundColor: "var(--invoice-primary)",
            borderColor: "var(--invoice-border)",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-12 h-12"
            style={{ color: "var(--invoice-primary-foreground)" }}
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
        </div>

        <div className="space-y-3">
          <h1 className="text-5xl font-bold tracking-tight" style={{ color: "var(--invoice-primary)" }}>
            InvoiceApp
          </h1>
          <p className="text-lg leading-relaxed" style={{ color: "var(--invoice-muted)" }}>
            Professional invoicing and billing management system
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button
            asChild
            size="lg"
            className="h-12 px-8 rounded-lg font-semibold text-base transition-all hover:opacity-90"
          >
            <Link href="/auth/login">Sign In</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="h-12 px-8 rounded-lg font-semibold text-base transition-all hover:opacity-90 border-2 bg-transparent"
            style={{
              backgroundColor: "var(--invoice-input)",
              borderColor: "var(--invoice-border)",
              color: "var(--invoice-primary)",
            }}
          >
            <Link href="/auth/register">Create Account</Link>
          </Button>
        </div>

        <div className="pt-8 border-t" style={{ borderColor: "var(--invoice-border)" }}>
          <p className="text-sm" style={{ color: "var(--invoice-muted)" }}>
            Streamline your business with automated invoicing
          </p>
        </div>
      </div>
    </div>
  )
}
