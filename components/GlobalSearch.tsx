"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, FileText, Briefcase, User } from "lucide-react"
import debounce from "lodash/debounce"

type SearchResult = {
  invoices: Array<{ id: string; invoiceNumber: string; clientName: string }>
  projects: Array<{ id: string; projectName: string; projectNumber: string }>
  customers: Array<{ id: string; customerName: string; customerEmail: string }>
}

export default function GlobalSearch() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery) {
      setResults(null)
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
      if (!response.ok) throw new Error("Search failed")
      const data: SearchResult = await response.json()
      setResults(data)
      setIsOpen(true)
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const debouncedSearch = useCallback(
    debounce((value: string) => handleSearch(value), 300),
    [handleSearch],
  )

  useEffect(() => {
    debouncedSearch(query)
  }, [query, debouncedSearch])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleSelect = (type: "invoice" | "project" | "customer", id: string) => {
    if (type === "invoice") {
      router.push(`/Invoices/Invoice-View?id=${id}`)
    } else if (type === "project") {
      router.push(`/Projects/Project-View?id=${id}`)
    } else if (type === "customer") {
      router.push(`/Customers/Customer-View?id=${id}`)
    }
    setIsOpen(false)
    setQuery("")
  }


  return (
    <div className="relative w-full max-w-sm" ref={dropdownRef}>
      <div className="flex items-center space-x-2">
        <Input
          type="text"
          placeholder="Search invoices, projects, or customers..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full"
        />
        <Button onClick={() => handleSearch(query)} disabled={isLoading}>
          {isLoading ? "Searching..." : <Search className="h-4 w-4" />}
        </Button>
      </div>
      {isOpen && results && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg"
        style={{
          zIndex: 9999,
          backgroundColor: 'white',
          border: '1px solid #e5e7eb',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }}
        >
          {results.invoices && results.invoices.length > 0 && (
            <div>
              <h3 className="px-4 py-2 text-sm font-semibold text-gray-500">Invoices</h3>
              {results.invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSelect("invoice", invoice.id)}
                >
                  <FileText className="inline-block mr-2 h-4 w-4" />
                  <span>
                    {invoice.invoiceNumber} - {invoice.clientName}
                  </span>
                </div>
              ))}
            </div>
          )}
          {results.projects && results.projects.length > 0 && (
            <div>
              <h3 className="px-4 py-2 text-sm font-semibold text-gray-500">Projects</h3>
              {results.projects.map((project) => (
                <div
                  key={project.id}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSelect("project", project.id)}
                >
                  <Briefcase className="inline-block mr-2 h-4 w-4" />
                  <span>
                    {project.projectName} - {project.projectNumber}
                  </span>
                </div>
              ))}
            </div>
          )}
          {results.customers && results.customers.length > 0 && (
            <div>
              <h3 className="px-4 py-2 text-sm font-semibold text-gray-500">Customers</h3>
              {results.customers.map((customer) => (
                <div
                  key={customer.id}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSelect("customer", customer.id)}
                >
                  <User className="inline-block mr-2 h-4 w-4" />
                  <span>{customer.customerName} - {customer.customerEmail}</span>
                </div>
              ))}
            </div>
          )}
          {(!results.invoices || results.invoices.length === 0) &&
            (!results.projects || results.projects.length === 0) &&
            (!results.customers || results.customers.length === 0) && (
              <div className="px-4 py-2 text-sm text-gray-500">No results found.</div>
            )}
        </div>
      )}
    </div>
  )
}
