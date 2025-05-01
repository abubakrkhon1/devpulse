"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/data-table";
import data from "./data.json";
import {
  Activity,
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  DollarSign,
  Download,
  LineChart,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Star,
  Users,
  XCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Project, ProjectIdea } from "@/types/types";
import { formatDate } from "@/lib/utils";

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("active");
  const [progressValues, setProgressValues] = useState({
    alpha: 0,
    beta: 0,
    gamma: 0,
  });
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [ideas, setIdeas] = useState<ProjectIdea[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    setMounted(true);
    // Animate progress bars
    const timer = setTimeout(() => {
      setProgressValues({ alpha: 75, beta: 45, gamma: 90 });
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const projects = await fetch("/api/projects/fetchProjects");
        if (!projects.ok) throw new Error("Failed to load projects");

        const ideas = await fetch("/api/ideas/fetchIdeas");
        if (!ideas.ok) throw new Error("Failed to load ideas");

        const projectsData = await projects.json();
        const ideasData = await ideas.json();

        setIdeas(ideasData.ideas);
        setProjects(projectsData.projects);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const fadeIn = mounted
    ? "opacity-100 translate-y-0"
    : "opacity-0 translate-y-4";

  return (
    <div className="w-full p-6 md:p-8 space-y-8 bg-gradient-to-b from-background to-background/80">
      {/* Dashboard Header with Greeting */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
        <div className={`transition-all duration-500 ease-in-out ${fadeIn}`}>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's your project overview for April 28, 2025
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="gap-2">
            <Search className="h-4 w-4" />
            <span className="hidden md:inline">Search</span>
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            <span>New Project</span>
          </Button>
        </div>
      </div>

      {/* Overview Cards with Animation */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "Total Projects",
            value: projects.length,
            change: "+2 from last month",
            icon: <LineChart className="h-5 w-5 text-primary" />,
            bgColor:
              "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20",
            delay: "100ms",
          },
          {
            title: "Tasks Completed",
            value: "#",
            change: "83% completion rate",
            icon: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
            bgColor:
              "bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/20 dark:to-emerald-900/20",
            delay: "200ms",
          },
          {
            title: "Team Members",
            value: "#",
            change: "2 active now",
            icon: <Users className="h-5 w-5 text-violet-500" />,
            bgColor:
              "bg-gradient-to-br from-violet-50 to-violet-100 dark:from-violet-950/20 dark:to-violet-900/20",
            delay: "300ms",
          },
          {
            title: "Brainstormed Ideas",
            value: ideas.length,
            change: "1 in review",
            icon: <Star className="h-5 w-5 text-amber-500" />,
            bgColor:
              "bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/20 dark:to-amber-900/20",
            delay: "400ms",
          },
        ].map((card, index) => (
          <Card
            key={index}
            className={`overflow-hidden transition-all duration-500 ease-in-out ${fadeIn}`}
            style={{ transitionDelay: card.delay }}
          >
            <CardHeader
              className={`flex flex-row items-center justify-between space-y-0 pb-2 py-3 ${card.bgColor}`}
            >
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              {card.icon}
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-3xl font-bold">{card.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {card.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          {
            label: "New Project",
            icon: <Plus className="mr-2 h-4 w-4" />,
            variant: "default",
            url: "/projects/new-project",
          },
          {
            label: "View Tasks",
            icon: <Clock className="mr-2 h-4 w-4" />,
            variant: "outline",
            url: "#",
          },
          {
            label: "Team",
            icon: <Users className="mr-2 h-4 w-4" />,
            variant: "outline",
            url: "/teams",
          },
          {
            label: "Settings",
            icon: <Settings className="mr-2 h-4 w-4" />,
            variant: "outline",
            url: "/settings",
          },
        ].map((action, index) => (
          <Button
            key={index}
            variant={
              action.variant as
                | "default"
                | "outline"
                | "destructive"
                | "secondary"
            }
            className={`w-full justify-start hover:shadow-md transition-all duration-300 ${fadeIn}`}
            onClick={() => router.push(action.url)}
          >
            {action.icon}
            {action.label}
          </Button>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-7">
        {/* Project Overview - Wider Column */}
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as any)}
          className={`md:col-span-4 transition-all duration-500 ease-in-out ${fadeIn}`}
          style={{ transitionDelay: "800ms" }}
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>
          <TabsContent value="active" className="space-y-5 pt-5">
            {projects.map((project, index) => (
              <Card
                key={index}
                className="overflow-hidden group hover:shadow-md transition-all duration-300"
                onClick={() => router.push(`/projects/${project._id}`)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle>{project.title}</CardTitle>
                    <Badge className="p-2">
                      {project.status[0].toUpperCase() +
                        project.status.slice(1)}
                    </Badge>
                  </div>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{project.progress}%</span>
                  </div>
                  <Progress
                    value={project.progress}
                    className="h-2 transition-all duration-1000 ease-in-out"
                  />
                  <div className="grid grid-cols-3 gap-4 pt-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">Due Date</span>
                      <span className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                        <Calendar className="h-3 w-3" />{" "}
                        {formatDate(new Date(project.dueDate))}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">Priority</span>
                      <span className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                        <AlertCircle className="h-3 w-3" /> High
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">Team</span>
                      <div className="flex -space-x-2 mt-1">
                        {project.team.map((member, i) => (
                          <Avatar
                            key={i}
                            className={`h-6 w-6 border-2 border-background ${project.teamColors[i]}`}
                          >
                            <AvatarFallback className="text-xs text-white">
                              {member}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-auto gap-1 group-hover:bg-primary group-hover:text-white transition-all duration-300"
                  >
                    View Details{" "}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </TabsContent>
          <TabsContent value="completed" className="pt-5">
            <div className="flex h-[350px] items-center justify-center rounded-md border border-dashed">
              <div className="text-center space-y-3">
                <div className="bg-green-100 dark:bg-green-900/20 h-16 w-16 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-8 w-8 text-green-500" />
                </div>
                <div className="text-xl font-medium">All done!</div>
                <div className="text-sm text-muted-foreground max-w-xs">
                  You've completed all your projects. Time to celebrate or start
                  something new!
                </div>
                <Button
                  variant="outline"
                  className="mt-2"
                  onClick={() => router.push("/projects/new-project")}
                >
                  Create New Project
                </Button>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="archived" className="pt-5">
            <div className="flex h-[350px] items-center justify-center rounded-md border border-dashed">
              <div className="text-center space-y-3">
                <div className="bg-slate-100 dark:bg-slate-900/20 h-16 w-16 rounded-full flex items-center justify-center mx-auto">
                  <XCircle className="h-8 w-8 text-slate-500" />
                </div>
                <div className="text-xl font-medium">No archived projects</div>
                <div className="text-sm text-muted-foreground max-w-xs">
                  Projects you archive will appear here for future reference.
                </div>
                <Button
                  variant="outline"
                  className="mt-2"
                  onClick={() => setActiveTab("active")}
                >
                  View Active Projects
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Side Content - Narrower Column */}
        <div
          className={`md:col-span-3 space-y-6 transition-all duration-500 ease-in-out ${fadeIn}`}
          style={{ transitionDelay: "900ms" }}
        >
          {/* At Risk Section */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-red-50 to-amber-50 dark:from-red-950/20 dark:to-amber-950/20 py-2">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-white dark:bg-gray-950 rounded-full shadow-sm">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                </div>
                <div>
                  <CardTitle>At Risk Items</CardTitle>
                  <CardDescription>
                    Projects requiring immediate attention
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  project: "Project Epsilon",
                  status: "No Updates",
                  color: "bg-amber-500",
                  days: 3,
                },
                {
                  project: "Project Zeta",
                  status: "Missing Deadline",
                  color: "bg-destructive",
                  days: 1,
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-accent transition-colors duration-200"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-2 h-full min-h-10 ${item.color} rounded-full`}
                    ></div>
                    <div>
                      <p className="text-sm font-medium">{item.project}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.status}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Badge variant="outline" className="mr-2">
                      {item.days}d
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Assign Team</DropdownMenuItem>
                        <DropdownMenuItem>Mark Resolved</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                size="sm"
                className="w-full gap-1 hover:bg-accent transition-colors duration-200"
              >
                View All <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          {/* Upcoming Deadlines */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 py-2">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-white dark:bg-gray-950 rounded-full shadow-sm">
                  <Calendar className="h-4 w-4 text-blue-500" />
                </div>
                <div>
                  <CardTitle>Upcoming Deadlines</CardTitle>
                  <CardDescription>
                    Tasks due in the next 7 days
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  task: "Finalize UI",
                  date: "Apr 29",
                  days: 1,
                  color: "bg-destructive",
                },
                {
                  task: "DB Migration",
                  date: "May 2",
                  days: 4,
                  color: "bg-amber-500",
                },
                {
                  task: "Launch Campaign",
                  date: "May 5",
                  days: 7,
                  color: "bg-emerald-500",
                },
              ].map((deadline, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg hover:bg-accent transition-colors duration-200"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-2 h-full min-h-10 ${deadline.color} rounded-full`}
                    ></div>
                    <div>
                      <p className="text-sm font-medium">{deadline.task}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" /> Due {deadline.date}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={deadline.days <= 2 ? "destructive" : "outline"}
                    className={deadline.days <= 2 ? "animate-pulse" : ""}
                  >
                    {deadline.days}d
                  </Badge>
                </div>
              ))}
            </CardContent>
            <Separator />
            <CardFooter className="pt-4 pb-4">
              <Button
                variant="outline"
                size="sm"
                className="w-full gap-1 hover:bg-accent transition-colors duration-200"
              >
                View Calendar <ArrowRight className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>

          {/* Activity Summary */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <div className="p-2 bg-violet-50 dark:bg-violet-950/20 rounded-full">
                  <Activity className="h-4 w-4 text-violet-500" />
                </div>
                <div>
                  <CardTitle>Team Activity</CardTitle>
                  <CardDescription>Recent team member updates</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  user: "Alex",
                  action: "commented on",
                  target: "Project Alpha",
                  time: "2h ago",
                  avatar: "A",
                  color: "bg-blue-500",
                },
                {
                  user: "Taylor",
                  action: "completed",
                  target: "Database setup",
                  time: "5h ago",
                  avatar: "T",
                  color: "bg-green-500",
                },
                {
                  user: "Jamie",
                  action: "uploaded",
                  target: "new documents",
                  time: "Yesterday",
                  avatar: "J",
                  color: "bg-amber-500",
                },
              ].map((activity, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <Avatar className={`h-8 w-8 ${activity.color}`}>
                    <AvatarFallback className="text-xs text-white">
                      {activity.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-0.5">
                    <p className="text-sm">
                      <span className="font-medium">{activity.user}</span>{" "}
                      {activity.action}{" "}
                      <span className="font-medium">{activity.target}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Activity Table */}
      <Card
        className={`transition-all duration-500 ease-in-out ${fadeIn}`}
        style={{ transitionDelay: "1000ms" }}
      >
        <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 py-2 dark:from-slate-950/50 dark:to-slate-900/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-white dark:bg-gray-950 rounded-full shadow-sm">
                <LineChart className="h-4 w-4 text-slate-500" />
              </div>
              <div>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Updates across all your projects
                </CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-1 hidden md:flex"
              >
                <Search className="h-4 w-4" /> Filter
              </Button>
              <Button variant="outline" size="sm" className="gap-1">
                <Download className="h-4 w-4" /> Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable data={data} />
        </CardContent>
      </Card>
    </div>
  );
}
