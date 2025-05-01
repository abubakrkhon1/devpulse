"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Sparkles,
  Calendar,
  Users,
  PanelRight,
  BrainCircuit,
} from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function IdeasPagePreview() {
  // Mock data for preview
  const router = useRouter();
  const [ideas, setIdeas] = useState([
    {
      _id: "1",
      projectName: "TaskFlow Pro",
      problem:
        "Existing task management tools are too complex for small teams and lack meaningful insights about productivity patterns.",
      audience: "Small businesses and startups",
      features: [
        "AI-powered prioritization",
        "Time tracking",
        "Team analytics",
      ],
      notes:
        "Focus on simplicity and clean UI. Consider adding calendar integration in v2.",
      createdAt: new Date(2025, 3, 25).toISOString(),
    },
    {
      _id: "2",
      projectName: "HealthSync",
      problem:
        "People struggle to maintain consistent health habits and track their wellness journey over time.",
      audience: "Health-conscious individuals",
      features: ["Habit tracking", "Nutrition log", "Sleep analytics"],
      notes:
        "Should integrate with popular fitness devices and apps. Consider partnering with nutritionists.",
      createdAt: new Date(2025, 3, 22).toISOString(),
    },
    {
      _id: "3",
      projectName: "DevPulse",
      problem:
        "Developers lack an elegant solution to track coding time and productivity across multiple projects and platforms.",
      audience: "Software developers",
      features: ["IDE integration", "GitHub analytics", "Focus sessions"],
      notes:
        "Research VSCode extension development. Consider premium tier for teams.",
      createdAt: new Date(2025, 3, 18).toISOString(),
    },
    {
      _id: "4",
      projectName: "DevPulse",
      problem:
        "Developers lack an elegant solution to track coding time and productivity across multiple projects and platforms.",
      audience: "Software developers",
      features: ["IDE integration", "GitHub analytics", "Focus sessions"],
      notes:
        "Research VSCode extension development. Consider premium tier for teams.",
      createdAt: new Date(2025, 3, 18).toISOString(),
    },
    {
      _id: "5",
      projectName: "DevPulse",
      problem:
        "Developers lack an elegant solution to track coding time and productivity across multiple projects and platforms.",
      audience: "Software developers",
      features: ["IDE integration", "GitHub analytics", "Focus sessions"],
      notes:
        "Research VSCode extension development. Consider premium tier for teams.",
      createdAt: new Date(2025, 3, 18).toISOString(),
    },
    {
      _id: "6",
      projectName: "DevPulse",
      problem:
        "Developers lack an elegant solution to track coding time and productivity across multiple projects and platforms.",
      audience: "Software developers",
      features: ["IDE integration", "GitHub analytics", "Focus sessions"],
      notes:
        "Research VSCode extension development. Consider premium tier for teams.",
      createdAt: new Date(2025, 3, 18).toISOString(),
    },
    {
      _id: "7",
      projectName: "DevPulse",
      problem:
        "Developers lack an elegant solution to track coding time and productivity across multiple projects and platforms.",
      audience: "Software developers",
      features: ["IDE integration", "GitHub analytics", "Focus sessions"],
      notes:
        "Research VSCode extension development. Consider premium tier for teams.",
      createdAt: new Date(2025, 3, 18).toISOString(),
    },
    {
      _id: "8",
      projectName: "DevPulse",
      problem:
        "Developers lack an elegant solution to track coding time and productivity across multiple projects and platforms.",
      audience: "Software developers",
      features: ["IDE integration", "GitHub analytics", "Focus sessions"],
      notes:
        "Research VSCode extension development. Consider premium tier for teams.",
      createdAt: new Date(2025, 3, 18).toISOString(),
    },
    {
      _id: "9",
      projectName: "DevPulse",
      problem:
        "Developers lack an elegant solution to track coding time and productivity across multiple projects and platforms.",
      audience: "Software developers",
      features: ["IDE integration", "GitHub analytics", "Focus sessions"],
      notes:
        "Research VSCode extension development. Consider premium tier for teams.",
      createdAt: new Date(2025, 3, 18).toISOString(),
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");

  // Simulated loading for demo purposes
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Function to get badge color based on feature type
  const getBadgeVariant = (feature: string) => {
    if (feature.toLowerCase().includes("ai")) return "default";
    if (feature.toLowerCase().includes("analytics")) return "secondary";
    if (feature.toLowerCase().includes("integration")) return "outline";
    return "secondary";
  };

  const filteredIdeas = ideas.filter((idea) => {
    if (filter === "all") return true;
    if (filter === "ai")
      return idea.features.some((f) => f.toLowerCase().includes("ai"));
    if (filter === "analytics")
      return idea.features.some((f) => f.toLowerCase().includes("analytics"));
    return true;
  });

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Header */}
      <header className="w-full max-w-7xl mx-auto px-6 md:px-8 pt-6">
        <div className="max-w-7xl">
          <div className="flex h-16 items-center justify-between">
            <h1 className="text-2xl font-semibold tracking-tight">
              <span className="inline-flex items-center">
                <Sparkles className="h-6 w-6 mr-2 text-indigo-400" />
                See your ideas
              </span>
            </h1>
            <Button
              onClick={() => router.push("/projects/brainstorm-idea")}
              className="gap-1"
            >
              <Plus className="h-4 w-4" />
              New Idea
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 md:p-8 max-w-7xl mx-auto w-full">
        <div className="mx-auto max-w-7xl">
          {/* Tabs and filters */}
          <div className="mb-8">
            <Tabs defaultValue="all" className="w-full">
              <div className="flex items-center justify-between">
                <TabsList>
                  <TabsTrigger value="all" onClick={() => setFilter("all")}>
                    All Ideas
                  </TabsTrigger>
                  <TabsTrigger value="ai" onClick={() => setFilter("ai")}>
                    AI-Powered
                  </TabsTrigger>
                  <TabsTrigger
                    value="analytics"
                    onClick={() => setFilter("analytics")}
                  >
                    Analytics
                  </TabsTrigger>
                </TabsList>
                <span className="text-sm text-muted-foreground">
                  {filteredIdeas.length} ideas found
                </span>
              </div>
            </Tabs>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, index) => (
                <Card key={index} className="overflow-hidden">
                  <div className="animate-pulse p-6 space-y-4">
                    <div className="h-6 bg-muted rounded w-3/4" />
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-full" />
                      <div className="h-4 bg-muted rounded w-5/6" />
                      <div className="h-4 bg-muted rounded w-4/6" />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <div className="h-6 bg-muted rounded w-20" />
                      <div className="h-6 bg-muted rounded w-24" />
                    </div>
                    <div className="pt-2">
                      <div className="h-4 bg-muted rounded w-full" />
                      <div className="h-4 bg-muted rounded w-2/3 mt-1" />
                    </div>
                    <div className="flex justify-between pt-4">
                      <div className="h-5 bg-muted rounded w-24" />
                      <div className="h-5 bg-muted rounded w-16" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : filteredIdeas.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <BrainCircuit className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No ideas found</h3>
              <p className="text-muted-foreground mt-2 max-w-md">
                You haven't created any ideas matching this filter yet. Click
                "New Idea" to start brainstorming.
              </p>
              <Button
                className="mt-6"
                onClick={() => router.push("/projects/brainstorm-idea")}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Idea
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredIdeas.map((idea) => (
                <Card
                  key={idea._id}
                  className="flex flex-col transition-all duration-200 hover:shadow-md hover:border-primary/20 cursor-pointer"
                  onClick={() => router.push(`/ideas/${idea._id}`)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex justify-between items-start">
                      <span className="line-clamp-1">{idea.projectName}</span>
                    </CardTitle>
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(idea.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <ScrollArea className="h-28 pr-4">
                      <p className="text-sm text-muted-foreground mb-2">
                        {idea.problem}
                      </p>
                    </ScrollArea>

                    <div className="mt-4 flex items-center gap-2">
                      <Users className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="text-xs font-medium">
                        {idea.audience}
                      </span>
                    </div>

                    <Separator className="my-3" />

                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {idea.features.slice(0, 3).map((feature, idx) => (
                        <Badge
                          key={idx}
                          variant={getBadgeVariant(feature)}
                          className="text-xs"
                        >
                          {feature}
                        </Badge>
                      ))}
                      {idea.features.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{idea.features.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2 pb-4 flex justify-between items-center">
                    <div className="flex items-center text-xs text-muted-foreground gap-1">
                      <PanelRight className="h-3 w-3" />
                      <span>Notes</span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/projects/idea/${idea._id}/edit`);
                      }}
                    >
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
