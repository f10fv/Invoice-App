"use client"

import { CardWrapper } from "./card-wrapper"
import type { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { RegisterSchema } from "@/schemas"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { FormError } from "@/components/form-error"
import { FormSuccess } from "@/components/form-success"
import { register } from "@/actions/register"
import { useState, useTransition } from "react"

export const RegisterForm = () => {
  const [error, setError] = useState("")
  const [success, setSuccess] = useState<string | undefined>("")
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof RegisterSchema>) => {
    setError("")
    setSuccess("")

    startTransition(() => {
      register(values)
        .then((data) => {
          if (data?.error) {
            setError(data.error)
          }
          if (data?.success) {
            setSuccess(data.success)
          }
        })
        .catch(() => {
          setError("Something went wrong")
        })
    })
  }

  return (
    <CardWrapper
      headerLabel="Create an account!"
      backButtonLabel="Already have an account?"
      backButtonHref="/auth/login"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">Full Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      placeholder="John Doe"
                      className="h-12 rounded-lg border-2 focus:border-[var(--invoice-primary)] transition-all text-base"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-semibold">Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={isPending}
                      type="password"
                      placeholder="Create a strong password"
                      className="h-12 rounded-lg border-2 focus:border-[var(--invoice-primary)] transition-all text-base"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button
            disabled={isPending}
            type="submit"
            className="w-full h-12 rounded-lg font-semibold text-base transition-all hover:opacity-90"
          >
            Create Account
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}
