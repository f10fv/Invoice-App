"use client"

import { CardWrapper } from "./card-wrapper"
import type { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { loginSchema } from "@/schemas";
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { FormError } from "@/components/form-error"
import { FormSuccess } from "@/components/form-success"
import { login } from "@/actions/login"
import { useState, useTransition } from "react"
import { useSearchParams } from "next/navigation"

export const LoginForm = () => {
  const searchParams = useSearchParams()
  const urlError =
    searchParams.get("error") === "OAuthAccountNotLinked" ? "Email already in use with different provider!" : ""
  const [showTwoFactor, setShowTwoFactor] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState<string | undefined>("")
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    setError("")
    setSuccess("")

    startTransition(() => {
      console.log("values", values)
      login(values)
        .then((data) => {
          if (data?.error) {
            form.reset()
            setError(data.error)
          }
          if (data?.success) {
            form.reset()
            setSuccess(data.success)
          }
          if (data?.twoFactor) {
            setShowTwoFactor(true)
          }
        })
        .catch(() => {
          setError("Something went wrong")
        })
    })
  }

  return (
    <CardWrapper
      headerLabel="Welcome back"
      backButtonLabel="Don't have an account?"
      backButtonHref="/auth/register"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-4">
            {showTwoFactor && (
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">Two Factor Code</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="123456"
                        className="h-12 rounded-lg border-2 focus:border-[var(--invoice-primary)] transition-all font-mono text-base"
                        style={{
                          backgroundColor: "var(--invoice-input)",
                          borderColor: "var(--invoice-border)",
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
            )}
            {!showTwoFactor && (
              <>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold">Email Address</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          type="email"
                          placeholder="you@company.com"
                          className="h-12 rounded-lg border-2 focus:border-[var(--invoice-primary)] transition-all text-base"
                          style={{
                            backgroundColor: "var(--invoice-input)",
                            borderColor: "var(--invoice-border)",
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                ></FormField>
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-sm font-semibold">Password</FormLabel>
                        <Button size="sm" variant="link" asChild className="px-0 font-medium h-auto">
                          <Link href={"/forgot-password"} style={{ color: "var(--invoice-primary)" }}>
                            Forgot password?
                          </Link>
                        </Button>
                      </div>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          type="password"
                          placeholder="Enter your password"
                          className="h-12 rounded-lg border-2 focus:border-[var(--invoice-primary)] transition-all text-base"
                          style={{
                            backgroundColor: "var(--invoice-input)",
                            borderColor: "var(--invoice-border)",
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                ></FormField>
              </>
            )}
          </div>
          <FormError message={error || urlError} />
          <FormSuccess message={success} />
          <Button
            disabled={isPending}
            type="submit"
            className="w-full h-12 rounded-lg font-semibold text-base transition-all hover:opacity-90"
          >
            {showTwoFactor ? "Verify Code" : "Sign In"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}
