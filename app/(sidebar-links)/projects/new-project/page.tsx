"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ChevronRight,
  CirclePlus,
  Users,
  Calendar as CalendarIcon,
  Briefcase,
  Clock,
  Flag,
  UserPlus,
  X,
  FolderPlus,
} from "lucide-react";
import { format } from "date-fns";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectFormSchema } from "@/lib/formSchemas";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Infer form values from Zod schema
type ProjectFormValues = z.infer<typeof projectFormSchema>;

export default function ProjectCreationPage() {
  const router = useRouter();
  const [teamMember, setTeamMember] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: "",
      description: "",
      dueDate: new Date(),
      category: "",
      status: "planning",
      priority: "",
      team: [],
      budget: 0,
    },
  });

  const team = form.watch("team");

  const onSubmit = async (values: ProjectFormValues) => {
    setIsSubmitting(true);
    setError("");
    console.log("clicked");
    try {
      const res = await fetch("/api/projects/createProject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Failed to create project");
      await res.json();
      router.push("/projects");
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/projects")}
              >
                <ArrowLeft className="h-4 w-4 mr-1" /> Projects
              </Button>
              <ChevronRight className="h-4 w-4 text-slate-400" />
              <span className="text-slate-600 text-sm">New Project</span>
            </div>
          </div>
          <Button
            onClick={() => form.handleSubmit(onSubmit)()}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Project"}
          </Button>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit,(errors) => console.log("validation failed:", errors))}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Main Form Fields */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Project Information</CardTitle>
                  <CardDescription>
                    Enter the basic details about your new project.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Name</FormLabel>
                        <FormControl>
                          <Input
                            id="title"
                            placeholder="Enter a descriptive name"
                            className="w-full"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            id="description"
                            placeholder="What are the goals and scope of this project?"
                            rows={4}
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <FormControl>
                            <Select {...field} onValueChange={field.onChange}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="development">
                                  Development
                                </SelectItem>
                                <SelectItem value="design">Design</SelectItem>
                                <SelectItem value="marketing">
                                  Marketing
                                </SelectItem>
                                <SelectItem value="research">
                                  Research
                                </SelectItem>
                                <SelectItem value="operations">
                                  Operations
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <FormControl>
                            <Select {...field} onValueChange={field.onChange}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="planning">
                                  Planning
                                </SelectItem>
                                <SelectItem value="in-progress">
                                  In Progress
                                </SelectItem>
                                <SelectItem value="review">
                                  Under Review
                                </SelectItem>
                                <SelectItem value="completed">
                                  Completed
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="budget"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Budget</FormLabel>
                          <FormControl>
                            <Input
                              id="budget"
                              type="string"
                              placeholder="Enter your budget"
                              className="w-full"
                              value={field.value ?? ""}
                              onChange={(e) => {
                                const val = e.target.value;
                                // empty → undefined, else convert to Number
                                field.onChange(
                                  val === "" ? undefined : Number(val)
                                );
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
                <CardFooter />
              </Card>

              <Card className="shadow-sm bg-slate-50">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-indigo-100 p-2 rounded-full">
                      <CirclePlus className="h-4 w-4 text-indigo-600" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium">Pro Tip</h4>
                      <p className="text-xs text-slate-500">
                        Setting clear deadlines and priorities helps keep your
                        project on track and team aligned.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Team Members Form Field */}
              <Card>
                <CardHeader>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>
                    Add team members who will be working on this project.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      type="email"
                      placeholder="Add email"
                      value={teamMember}
                      onChange={(e) => setTeamMember(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => {
                        if (teamMember && !team.includes(teamMember)) {
                          form.setValue("team", [...team, teamMember]);
                          setTeamMember("");
                        }
                      }}
                    >
                      <UserPlus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {team.length > 0 ? (
                      team.map((member, idx) => (
                        <Badge key={idx} className="flex items-center gap-1">
                          <Avatar className="h-5 w-5">
                            <AvatarFallback>{member.charAt(0)}</AvatarFallback>
                          </Avatar>
                          {member}
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-5 w-5 p-0"
                            onClick={() => {
                              form.setValue(
                                "team",
                                team.filter((_, i) => i !== idx)
                              );
                            }}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))
                    ) : (
                      <div className="w-full text-center py-6 text-slate-500 bg-slate-50 rounded-md border border-dashed border-slate-200">
                        <Users className="h-8 w-8 mx-auto mb-2 text-slate-400" />
                        <p className="text-sm">No team members added yet</p>
                        <p className="text-xs text-slate-400">
                          Add team members by email
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar Fields */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Schedule</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Due Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full text-left"
                            >
                              <CalendarIcon className="mr-2" />
                              {field.value
                                ? format(field.value, "MMM d, yyyy")
                                : "Select date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="p-0">
                            <CalendarComponent
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority</FormLabel>
                        <FormControl>
                          <Select {...field} onValueChange={field.onChange}>
                            <SelectTrigger>
                              <SelectValue placeholder="Priority" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="urgent">Urgent</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              <Card className="shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-base">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          className="w-full justify-start"
                          variant="outline"
                          size="sm"
                        >
                          <Briefcase className="mr-2 h-4 w-4" />
                          <span>Set up workspace</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Configure your project workspace</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          className="w-full justify-start"
                          variant="outline"
                          size="sm"
                        >
                          <Clock className="mr-2 h-4 w-4" />
                          <span>Set milestones</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Add project milestones</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          className="w-full justify-start"
                          variant="outline"
                          size="sm"
                        >
                          <Flag className="mr-2 h-4 w-4" />
                          <span>Create first task</span>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Add the first task to your project</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </CardContent>
              </Card>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
