"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  BarChart3,
  Layers,
  Lightbulb,
  Clock,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProjectAppLanding() {
  const router = useRouter();
  const { user, loading, error } = useUser();
  const heroBtnClick = () => {
    if (user) router.push("/dashboard");
    else router.push("/sign-up");
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 shadow-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6 ">
          <div className="flex items-center gap-2">
            <Layers className="h-6 w-6 text-indigo-500" />
            <span className="font-bold text-xl">Pulse</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            {["Features", "Solutions", "Pricing", "Testimonials"].map((s) => (
              <a
                key={s}
                href={`#${s.toLowerCase()}`}
                className="text-sm font-medium hover:text-indigo-500 transition-colors"
              >
                {s}
              </a>
            ))}
          </nav>
          {user ? (
            <div className="flex items-center gap-4">
              <Button
                onClick={() => router.push("/login")}
                variant="ghost"
                className="hidden md:flex dark:hover:bg-primary/20"
              >
                Logout
              </Button>
              <Avatar className="cursor-pointer hover:scale-105 transition">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>P</AvatarFallback>
              </Avatar>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-4">
                <Button
                  onClick={() => router.push("/login")}
                  variant="ghost"
                  className="hidden md:flex"
                >
                  Log in
                </Button>
                <Button
                  onClick={() => router.push("/sign-up")}
                  className="bg-indigo-600 hover:bg-indigo-700 dark:text-white"
                >
                  Start Free Trial
                </Button>
              </div>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="mx-auto flex max-w-7xl flex-col items-center px-4 py-20 md:py-24 text-center">
        <Badge className="mb-4 bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300">
          New Features Available
        </Badge>
        <h1 className="mb-6 bg-clip-text text-5xl font-bold text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
          Transform Ideas into Strategic Projects
        </h1>
        <p className="mb-8 max-w-3xl text-xl text-slate-600 dark:text-slate-400">
          The complete enterprise platform for project analysis, planning, and
          idea generation. Drive innovation and execution with AI-powered
          insights.
        </p>
        <div className="mb-10 flex gap-4 flex-col sm:flex-row">
          <Button
            size="lg"
            className="bg-indigo-600 hover:bg-indigo-700 px-8 dark:text-white"
            onClick={heroBtnClick}
          >
            {user ? "Dashboard" : "Request Demo"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="hover:bg-indigo-50 dark:hover:bg-indigo-950"
          >
            View Documentation
          </Button>
        </div>
        <div className="w-full h-[400px] overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl">
          <img
            src="hero.png"
            alt=" Dashboard"
            className="w-full h-full"
          />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-white dark:bg-slate-900 py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="mb-4 text-3xl font-bold">
              Everything You Need to Excel
            </h2>
            <p className="mx-auto max-w-2xl text-slate-600 dark:text-slate-400">
              Our comprehensive suite of tools empowers your team to analyze
              data, plan projects, and generate innovative ideas—all in one
              place.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: (
                  <BarChart3 className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                ),
                title: "Advanced Analytics",
                desc: "Gain actionable insights from your project data with our powerful analytics engine.",
                items: [
                  "Real-time performance metrics",
                  "Predictive analysis",
                  "Custom dashboards",
                ],
              },
              {
                icon: (
                  <Clock className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                ),
                title: "Strategic Planning",
                desc: "Plan and execute projects with precision using our comprehensive planning tools.",
                items: [
                  "Resource allocation",
                  "Timeline visualization",
                  "Risk assessment",
                ],
              },
              {
                icon: (
                  <Lightbulb className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                ),
                title: "AI Idea Generation",
                desc: "Spark innovation with our AI-powered idea generation and project suggestion tools.",
                items: [
                  "AI-driven suggestions",
                  "Market trend analysis",
                  "Opportunity identification",
                ],
              },
            ].map(({ icon, title, desc, items }) => (
              <Card
                key={title}
                className="border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900">
                    {icon}
                  </div>
                  <CardTitle>{title}</CardTitle>
                  <CardDescription>{desc}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {items.map((item) => (
                      <li key={item} className="flex items-center">
                        <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                        <span className="text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full justify-between">
                    Learn more <ChevronRight className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions" className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="mb-4 text-3xl font-bold">
              Tailored Solutions for Every Team
            </h2>
            <p className="mx-auto max-w-2xl text-slate-600 dark:text-slate-400">
              Whether you're a startup or an enterprise, Pulse scales to meet
              your specific project management needs.
            </p>
          </div>

          <Tabs defaultValue="enterprise" className="mx-auto max-w-4xl">
            <TabsList className="grid grid-cols-3 gap-4 mb-12">
              <TabsTrigger value="enterprise">Enterprise</TabsTrigger>
              <TabsTrigger value="teams">Teams</TabsTrigger>
              <TabsTrigger value="startups">Startups</TabsTrigger>
            </TabsList>

            {[
              {
                key: "enterprise",
                title: "Enterprise‑Grade Power",
                desc: "Scale your project management across departments with robust analytics, governance, and security features.",
                items: [
                  "Advanced permissions and roles",
                  "SSO & compliance",
                  "Cross-department analytics",
                ],
                cta: "Book Enterprise Demo",
                img: "/api/placeholder/600/400",
              },
              {
                key: "teams",
                title: "Team Collaboration",
                desc: "Empower your teams with collaborative tools that enhance communication and streamline workflows.",
                items: [
                  "Real-time collaboration",
                  "Task delegation & tracking",
                  "Team performance metrics",
                ],
                cta: "Start Team Trial",
                img: "/api/placeholder/600/400",
              },
              {
                key: "startups",
                title: "Startup Accelerator",
                desc: "Fast-track your growth with tools designed to help startups innovate quickly and scale strategically.",
                items: [
                  "Agile project templates",
                  "Growth metrics & KPIs",
                  "Investor-ready reporting",
                ],
                cta: "Start Startup Plan",
                img: "/api/placeholder/600/400",
              },
            ].map(({ key, title, desc, items, cta, img }) => (
              <TabsContent key={key} value={key} className="space-y-8">
                <div className="grid gap-8 md:grid-cols-2 items-center">
                  <div>
                    <h3 className="mb-4 text-2xl font-bold">{title}</h3>
                    <p className="mb-6 text-slate-600 dark:text-slate-400">
                      {desc}
                    </p>
                    <ul className="space-y-3 mb-6">
                      {items.map((item) => (
                        <li key={item} className="flex items-center">
                          <CheckCircle className="mr-3 h-5 w-5 text-green-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <Button className="bg-indigo-600 hover:bg-indigo-700 dark:text-white">
                      {cta}
                    </Button>
                  </div>
                  <div className="overflow-hidden h-[250px] rounded-lg border border-slate-200 dark:border-slate-800 shadow-lg">
                    <img src={img} alt={title} className="w-full h-auto" />
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="mb-4 text-3xl font-bold">
              Transparent Pricing for Every Scale
            </h2>
            <p className="mx-auto max-w-2xl text-slate-600 dark:text-slate-400">
              Choose the plan that works best for your business, with no hidden
              fees and flexible options.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            {[
              {
                plan: "Starter",
                price: "$29",
                features: [
                  "Up to 5 team members",
                  "Basic analytics",
                  "10 projects",
                  "Email support",
                ],
                popular: false,
                cta: "Get Started",
                variant: "default",
              },
              {
                plan: "Professional",
                price: "$79",
                features: [
                  "Up to 20 team members",
                  "Advanced analytics",
                  "Unlimited projects",
                  "Priority support",
                  "AI project suggestions",
                ],
                popular: true,
                cta: "Get Started",
                variant: "primary",
              },
              {
                plan: "Enterprise",
                price: "Custom",
                features: [
                  "Unlimited team members",
                  "Custom analytics",
                  "Dedicated account manager",
                  "24/7 premium support",
                  "Advanced security",
                  "Custom integrations",
                ],
                popular: false,
                cta: "Contact Sales",
                variant: "primary",
              },
            ].map(({ plan, price, features, popular, cta, variant }) => (
              <Card
                key={plan}
                className={`relative border-slate-200 dark:border-slate-800 shadow-md ${
                  popular ? "shadow-xl" : ""
                }`}
              >
                {popular && (
                  <Badge className="absolute top-4 right-4 bg-indigo-600 text-white">
                    Popular
                  </Badge>
                )}
                <CardHeader>
                  <CardTitle>{plan}</CardTitle>
                  <div className="mt-4">
                    <span className="text-3xl font-bold">{price}</span>
                    <span className="text-slate-600 dark:text-slate-400">
                      /month
                    </span>
                  </div>
                  <CardDescription className="mt-2">
                    Perfect for {plan.toLowerCase()} tiers.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {features.map((f) => (
                      <li key={f} className="flex items-center">
                        <CheckCircle className="mr-3 h-5 w-5 text-green-500" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className={`w-full ${
                      variant === "primary"
                        ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                        : variant === "outline"
                        ? "border border-indigo-600 text-indigo-600 hover:bg-indigo-700 hover:text-white"
                        : ""
                    }`}
                  >
                    {cta}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section
        id="testimonials"
        className="py-20 bg-slate-50 dark:bg-slate-950"
      >
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="mb-4 text-3xl font-bold">
              Trusted by Industry Leaders
            </h2>
            <p className="mx-auto max-w-2xl text-slate-600 dark:text-slate-400">
              See how Pulse has transformed project management for teams
              across various industries.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Sarah Johnson",
                role: "CTO, TechNova",
                quote:
                  "Pulse revolutionized how we manage projects across our engineering teams. The AI-powered insights have helped us identify bottlenecks before they become problems.",
              },
              {
                name: "Mark Thompson",
                role: "Project Director, GlobalBuild",
                quote:
                  "The strategic planning tools in Pulse have allowed us to reduce project completion time by 30% while improving quality. It's become essential to our operations.",
              },
              {
                name: "Elena Rodriguez",
                role: "Founder, LaunchPad Startups",
                quote:
                  "As a startup accelerator, we recommend Pulse to all our portfolio companies. Its idea generation features have sparked countless innovations.",
              },
            ].map(({ name, role, quote }) => (
              <Card
                key={name}
                className="border-slate-200 dark:border-slate-800 shadow-sm"
              >
                <CardHeader>
                  <div className="mb-4 flex items-center gap-4">
                    <img
                      src="https://github.com/shadcn.png"
                      alt="Profile Pic"
                      className="h-12 w-12 rounded-full bg-slate-200 dark:bg-slate-700"
                    />
                    <div>
                      <h4 className="font-semibold">{name}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {role}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="italic text-slate-600 dark:text-slate-400">
                    {quote}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-indigo-600 dark:bg-indigo-900">
        <div className="mx-auto max-w-7xl px-4 md:px-6 text-center">
          <h2 className="mb-6 text-3xl font-bold text-white">
            Ready to Transform Your Project Management?
          </h2>
          <p className="mb-8 mx-auto max-w-2xl text-indigo-100">
            Join thousands of leading organizations that use Pulse to
            analyze, plan, and innovate. Try it free for 14 days.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-indigo-600 hover:bg-indigo-50"
            >
              Start Free Trial
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white hover:bg-indigo-700"
            >
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
