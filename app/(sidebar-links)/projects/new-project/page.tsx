"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CalendarIcon, PlusIcon, XIcon } from "lucide-react";
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
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

interface ProjectFormData {
  title: string;
  description: string;
  dueDate: string;
  priority: string;
  status: string;
  team: string[];
}

export default function NewProject() {
  const router = useRouter();
  const [formData, setFormData] = useState<ProjectFormData>({
    title: "",
    description: "",
    dueDate: "",
    priority: "",
    status: "planning",
    team: [],
  });
  const [teamMember, setTeamMember] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [date, setDate] = useState<Date | undefined>(undefined);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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

  const handleDateChange = (selectedDate: Date | undefined) => {
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    if (!formData.title.trim()) {
      setError("Project title is required");
      setIsSubmitting(false);
      return;
    }

    try {
      // Replace with your actual API endpoint
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to create project");
      }

      const data = await response.json();
      router.push(`/projects/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-medium text-slate-900">
          Create New Project
        </h1>
        <Button
          variant="ghost"
          onClick={() => router.push("/projects")}
        >
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle>Project Details</CardTitle>
            <CardDescription>
              Fill in the information below to create a new project.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-1.5">
              <Label htmlFor="title">Project Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter project title"
                className="w-full"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the project goals and details"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <Label htmlFor="dueDate">Due Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      type="button"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? (
                        format(date, "PPP")
                      ) : (
                        <span className="text-slate-500">Select a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={handleDateChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="priority">Priority</Label>
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
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="status">Status</Label>
              <Select
                onValueChange={(value) => handleSelectChange("status", value)}
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

            <div className="space-y-3">
              <Label>Team Members</Label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={teamMember}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setTeamMember(e.target.value)
                  }
                  placeholder="Enter email address"
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={handleAddTeamMember}
                  variant="secondary"
                  size="icon"
                >
                  <PlusIcon className="h-4 w-4" />
                </Button>
              </div>

              {formData.team.length > 0 && (
                <div className="mt-2 space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {formData.team.map((member, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="pl-3 pr-2 py-1.5 flex items-center gap-1"
                      >
                        {member}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-5 w-5 p-0 rounded-full hover:bg-slate-200"
                          onClick={() => handleRemoveTeamMember(index)}
                        >
                          <XIcon className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>

          <Separator />

          <CardFooter className="flex justify-end space-x-2 pt-6">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Project"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
