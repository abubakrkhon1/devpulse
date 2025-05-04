"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  ChevronRight,
  Clock,
  CheckCircle,
  Circle,
  AlertCircle,
  X,
  Edit2,
  Trash2,
  Search,
  MoreVertical,
  Cog,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Project } from "@/types/types";
import { formatDate } from "@/lib/utils";

export default function ProjectsDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [selectedTab, setSelectedTab] = useState<
    "all" | "completed" | "in-progress" | "planning" | "at-risk"
  >("all");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const router = useRouter();

  // Fetch projects once
  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);

        const res = await fetch("/api/projects/fetchProjects");
        if (!res.ok) throw new Error("Failed to load projects");

        const data = await res.json();
        console.log(data);

        setProjects(data.projects);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  // Filtered list based on tab and search
  const filteredProjects = projects.filter((project) => {
    if (selectedTab !== "all" && project.status !== selectedTab) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      if (!project.title.toLowerCase().includes(term)) {
        return false;
      }
    }
    return true;
  });

  const deleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      const res = await fetch(`/api/projects/deleteProject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Delete failed");
      setProjects((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete project.");
    }
  };

  const getPriorityClass = (priority: Project["priority"]) => {
    switch (priority) {
      case "urgent":
        return "bg-red-200 text-red-900";
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-amber-100 text-amber-800";
      case "low":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: Project["status"]) => {
    switch (status) {
      case "planning":
        return <Cog className="w-4 h-4 text-gray-600" />;
      case "in-progress":
        return <Clock className="w-4 h-4 text-blue-600" />;
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "review":
        return <AlertCircle className="w-4 h-4 text-red-600" />;
    }
  };

  const getStatusClass = (status: Project["status"]) => {
    switch (status) {
      case "completed":
        return "text-green-600";
      case "in-progress":
        return "text-blue-600";
      case "planning":
        return "text-gray-600";
      case "review":
        return "text-red-600";
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600 mt-2">
            Manage and track all your projects in one place
          </p>
        </header>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <div className="flex space-x-4">
              {["all", "in-progress", "planning", "completed", "review"].map(
                (tab) => (
                  <Button
                    key={tab}
                    variant={selectedTab === tab ? "secondary" : "ghost"}
                    size="sm"
                    onClick={() => setSelectedTab(tab as any)}
                  >
                    {tab
                      .replace("-", " ")
                      .replace(/\b\w/g, (c) => c.toUpperCase())}
                  </Button>
                )
              )}
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  className="pl-9 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button onClick={() => router.push("/projects/new-project")}>
                New Project
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-3">Project</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Priority</th>
                  <th className="px-6 py-3">Progress</th>
                  <th className="px-6 py-3">Due Date</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {loading ? (
                  // Skeleton rows
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="h-4 bg-gray-200 rounded w-1/4 ml-auto"></div>
                      </td>
                    </tr>
                  ))
                ) : error ? (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-red-500">
                      {error}
                    </td>
                  </tr>
                ) : filteredProjects.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-12 text-center">
                      No projects found
                    </td>
                  </tr>
                ) : (
                  filteredProjects.map((project) => (
                    <tr
                      key={project._id}
                      className="hover:bg-gray-50"
                      onClick={() => router.push(`/projects/${project._id}`)}
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">
                            {project.title}
                          </div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {project.description}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {getStatusIcon(project.status)}
                          <span
                            className={`ml-2 text-sm ${getStatusClass(
                              project.status
                            )}`}
                          >
                            {project.status.charAt(0).toUpperCase() +
                              project.status.slice(1).replace("-", " ")}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 text-xs rounded-md ${getPriorityClass(
                            project.priority
                          )}`}
                        >
                          {project.priority.charAt(0).toUpperCase() +
                            project.priority.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{
                                width: `${project.progress}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm ml-2 text-gray-500">
                            {project.progress}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(new Date(project.dueDate))}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() =>
                              router.push(`/projects/${project._id}/edit`)
                            }
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteProject(project._id)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button className="text-gray-400 hover:text-gray-600">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
