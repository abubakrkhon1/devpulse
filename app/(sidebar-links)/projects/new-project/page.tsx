"use client";
import { useState } from "react";
import {
  ArrowLeft,
  Calendar,
  UserPlus,
  X,
  Clock,
  Users,
  Briefcase,
  ChevronRight,
  Flag,
  CirclePlus,
  FolderPlus,
} from "lucide-react";
import { format } from "date-fns";

// Import shadcn/ui components
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
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";

export default function ProjectCreationPage() {
  const [teamMember, setTeamMember] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const router = useRouter();

  interface FormData {
    title: string;
    description: string;
    dueDate: string;
    priority: string;
    status: string;
    team: string[];
    category: string;
    budget: string;
  }

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    dueDate: "",
    priority: "",
    status: "planning",
    team: [],
    category: "",
    budget: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (selectedDate?: Date) => {
    setDate(selectedDate);
    setFormData((prev) => ({
      ...prev,
      dueDate: selectedDate ? format(selectedDate, "yyyy-MM-dd") : "",
    }));
  };

  const handleAddTeamMember = () => {
    if (
      teamMember.trim() !== "" &&
      !formData.team.includes(teamMember.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        team: [...prev.team, teamMember.trim()],
      }));
      setTeamMember("");
    }
  };

  const handleRemoveTeamMember = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      team: prev.team.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    setError("");

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);

      // Show success message
      setFormData({
        title: "",
        description: "",
        dueDate: "",
        priority: "",
        status: "planning",
        team: [],
        category: "",
        budget: "",
      });
      setDate(undefined);
    }, 1500);
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
                className="h-8 px-2"
                onClick={() => router.push("/projects")}
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Projects
              </Button>
              <ChevronRight className="h-4 w-4 text-slate-400" />
              <span className="text-slate-600 text-sm">New Project</span>
            </div>
            <div className="flex items-center">
              <FolderPlus className="text-primary mr-2"/>
              <h1 className="text-2xl font-semibold tracking-tight">
                Create Project
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button size="sm" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="mr-2">Creating...</span>
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </>
              ) : (
                "Create Project"
              )}
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">Project Information</CardTitle>
                <CardDescription>
                  Enter the basic details about your new project.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="title">Project Name</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter a descriptive name"
                    className="w-full"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="What are the goals and scope of this project?"
                    rows={4}
                    className="resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      onValueChange={(value) =>
                        handleSelectChange("category", value)
                      }
                      value={formData.category}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="development">Development</SelectItem>
                        <SelectItem value="design">Design</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="research">Research</SelectItem>
                        <SelectItem value="operations">Operations</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-sm">Status</Label>
                    <Select
                      onValueChange={(value) =>
                        handleSelectChange("status", value)
                      }
                      defaultValue="planning"
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="planning">Planning</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="review">Under Review</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="budget">Budget</Label>
                    <Input
                      id="budget"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      placeholder="$0.00"
                      type="text"
                    />
                  </div>
                </div>
              </CardContent>
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

            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl">Team Members</CardTitle>
                <CardDescription>
                  Add team members who will be working on this project.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    type="email"
                    value={teamMember}
                    onChange={(e) => setTeamMember(e.target.value)}
                    placeholder="Add by email address"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    onClick={handleAddTeamMember}
                    size="icon"
                    variant="outline"
                  >
                    <UserPlus className="h-4 w-4" />
                  </Button>
                </div>

                {formData.team.length > 0 ? (
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {formData.team.map((member, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="pl-2 pr-1 py-1 flex items-center gap-1 bg-slate-100 hover:bg-slate-200 transition-colors"
                        >
                          <Avatar className="h-5 w-5 mr-1">
                            <AvatarFallback className="text-xs">
                              {member.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          {member}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-5 w-5 p-0 rounded-full hover:bg-slate-300"
                            onClick={() => handleRemoveTeamMember(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 text-slate-500 bg-slate-50 rounded-md border border-dashed border-slate-200">
                    <Users className="h-8 w-8 mx-auto mb-2 text-slate-400" />
                    <p className="text-sm">No team members added yet</p>
                    <p className="text-xs text-slate-400">
                      Add team members by email
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-base">Project Schedule</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <Label className="text-sm">Due Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        type="button"
                        className="w-full justify-start text-left font-normal"
                      >
                        <Calendar className="mr-2 h-4 w-4 text-slate-500" />
                        {date ? (
                          format(date, "MMM d, yyyy")
                        ) : (
                          <span className="text-slate-500">Select a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={date}
                        onSelect={handleDateChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-1">
                  <Label className="text-sm">Priority</Label>
                  <Select
                    onValueChange={(value) =>
                      handleSelectChange("priority", value)
                    }
                    value={formData.priority}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">
                        <div className="flex items-center">
                          <div className="h-2 w-2 rounded-full bg-blue-500 mr-2"></div>
                          Low
                        </div>
                      </SelectItem>
                      <SelectItem value="medium">
                        <div className="flex items-center">
                          <div className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></div>
                          Medium
                        </div>
                      </SelectItem>
                      <SelectItem value="high">
                        <div className="flex items-center">
                          <div className="h-2 w-2 rounded-full bg-orange-500 mr-2"></div>
                          High
                        </div>
                      </SelectItem>
                      <SelectItem value="urgent">
                        <div className="flex items-center">
                          <div className="h-2 w-2 rounded-full bg-red-500 mr-2"></div>
                          Urgent
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
        </div>
      </div>
    </div>
  );
}
