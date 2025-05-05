"use client";

import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpFormSchema } from "@/lib/formSchemas";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { register } from "@/lib/api/auth";

// assume your zod schema now includes:
// name, email, password, confirmPassword, jobTitle, department, role, bio, twoFactorEnabled
export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      jobTitle: "",
      department: "",
      role: "User",
      bio: "",
      twoFactorEnabled: false,
      verified: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof signUpFormSchema>) => {
    const valuesfixed = {
      ...values,
      bio: values.bio ?? "",
    };

    setLoading(true);

    const res = await register(valuesfixed);
    console.log(res);

    if (!res.ok) {
      form.setError("confirmPassword", {
        type: "manual",
        message: res.message || "Something went wrong",
      });
    } else {
      router.push("/login");
      setLoading(false);
    }

    setLoading(false);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="bg-white dark:bg-slate-900">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome to Pulse</CardTitle>
          <CardDescription>Create your brand new account</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password / Confirm */}
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Job Title */}
              <FormField
                control={form.control}
                name="jobTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Lead Developer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Department */}
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <FormControl>
                      <Input placeholder="Engineering" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Role */}
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="h-9 w-full rounded-md border px-3 text-sm shadow-sm focus:ring-1"
                      >
                        {["User", "Manager"].map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Bio */}
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <textarea
                        {...field}
                        className="w-full rounded-md border px-3 py-2 text-sm shadow-sm focus:ring-1"
                        rows={4}
                        placeholder="Tell us a bit about yourself"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Two-Factor */}
              <FormField
                control={form.control}
                name="twoFactorEnabled"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <FormLabel className="m-0">
                      Enable Two-Factor Auth
                    </FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Submit */}
              <Button
                type="submit"
                className={cn(
                  "w-full transition-all",
                  loading && "animate-pulse opacity-70 cursor-not-allowed"
                )}
                disabled={loading}
              >
                {loading ? "Creating…" : "Sign Up"}
              </Button>

              <p className="text-center text-sm">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Sign in
                </a>
              </p>
            </form>
          </Form>
        </CardContent>
      </Card>

      <p className="text-center text-xs text-muted-foreground">
        By signing up, you agree to our{" "}
        <a className="underline" href="/terms">
          Terms of Service
        </a>{" "}
        and{" "}
        <a className="underline" href="/privacy">
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
}
