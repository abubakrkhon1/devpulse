"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Lightbulb,
  Users,
  ListPlus,
  StickyNote,
  Save,
  Send,
  Plus,
  X,
  Sparkles,
  Brain,
  Bot,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function BrainstormingPage() {
  const [projectName, setProjectName] = useState("");
  const [problem, setProblem] = useState("");
  const [audience, setAudience] = useState("");
  const [features, setFeatures] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState("");
  const [notes, setNotes] = useState("");
  const [chatMessages, setChatMessages] = useState<string[]>([]);
  const [userInput, setUserInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleAddFeature = () => {
    if (featureInput.trim() !== "") {
      setFeatures([...features, featureInput.trim()]);
      setFeatureInput("");
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddFeature();
    }
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    const brainstormingData = {
      projectName,
      problem,
      audience,
      features,
      notes,
    };
    try {
      const res = await fetch("/api/ideas/createIdea", {
        method: "POST",
        body: JSON.stringify(brainstormingData),
      });
      const data = await res.json();
      console.log(res, data);
      router.push("/ideas");
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Header with gradient background */}
      <header className="w-full max-w-7xl mx-auto px-6 md:px-8 pt-6">
        <div className="max-w-7xl ">
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
            <span className="text-slate-600 text-sm">Brainstorm Idea</span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <h1 className="text-2xl font-semibold tracking-tight">
              <span className="inline-flex items-center">
                <Brain className="h-6 w-6 mr-2 text-indigo-400" />
                Brainstorm Your New Project
              </span>
            </h1>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={handleSave}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="mr-2">Saving</span>
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
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Project
                      </>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Save your brainstorming session</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left section - Project Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-sm border-slate-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-medium text-slate-800">
                  Project Details
                </CardTitle>
                <CardDescription className="text-slate-500">
                  Define your project's core elements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 pt-2">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-indigo-500" />
                    <label className="font-medium text-slate-700">
                      Project Name
                    </label>
                  </div>
                  <Input
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="My Next Big Idea"
                    className="border-slate-200 focus-visible:ring-indigo-500"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-amber-500" />
                    <label className="font-medium text-slate-700">
                      Problem Statement
                    </label>
                  </div>
                  <Textarea
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                    placeholder="What problem does this project solve?"
                    className="resize-none h-24 border-slate-200 focus-visible:ring-indigo-500"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-green-500" />
                    <label className="font-medium text-slate-700">
                      Target Audience
                    </label>
                  </div>
                  <Input
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    placeholder="Who will use your product?"
                    className="border-slate-200 focus-visible:ring-indigo-500"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <ListPlus className="h-4 w-4 text-blue-500" />
                    <label className="font-medium text-slate-700">
                      Key Features
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={featureInput}
                      onChange={(e) => setFeatureInput(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Add a feature idea..."
                      className="border-slate-200 focus-visible:ring-indigo-500"
                    />
                    <Button
                      onClick={handleAddFeature}
                      className="bg-slate-800 hover:bg-slate-700 text-white"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {features.length > 0 ? (
                    <div className="mt-4">
                      <ScrollArea className="h-[120px] rounded-md border border-slate-200 p-4">
                        <div className="flex flex-wrap gap-2">
                          {features.map((feature, index) => (
                            <Badge
                              key={index}
                              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center gap-1.5"
                            >
                              <span className="text-sm">{feature}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-5 w-5 p-0 rounded-full hover:bg-slate-300/50"
                                onClick={() => handleRemoveFeature(index)}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </Badge>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  ) : (
                    <div className="mt-2 text-center py-4 text-slate-500 bg-slate-50 rounded-md border border-dashed border-slate-200">
                      <ListPlus className="h-6 w-6 mx-auto mb-2 text-slate-400" />
                      <p className="text-sm">No features added yet</p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <StickyNote className="h-4 w-4 text-purple-500" />
                    <label className="font-medium text-slate-700">Notes</label>
                  </div>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any random thoughts, tech stack ideas, etc."
                    className="resize-none h-24 border-slate-200 focus-visible:ring-indigo-500"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right side - AI Chat */}
          <div className="space-y-6">
            <Card className="shadow-sm border-slate-200 h-[600px] flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-lg font-medium text-slate-800">
                  <Bot className="h-5 w-5 text-indigo-500" />
                  AI Assistant
                  <Badge
                    variant="outline"
                    className="ml-2 border-indigo-200 text-indigo-600 text-xs"
                  >
                    Coming Soon
                  </Badge>
                </CardTitle>
                <CardDescription className="text-slate-500">
                  Get intelligent suggestions for your project
                </CardDescription>
              </CardHeader>

              <Separator className="mb-2" />

              <CardContent className="flex-1 overflow-hidden pt-2 flex flex-col">
                <ScrollArea className="flex-1 pr-4">
                  {chatMessages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center gap-3 text-center p-6">
                      <div className="p-3 bg-indigo-50 rounded-full">
                        <Bot className="h-8 w-8 text-indigo-500" />
                      </div>
                      <div className="space-y-1 max-w-xs">
                        <h3 className="font-medium text-slate-800">
                          Brainstorm with AI
                        </h3>
                        <p className="text-xs text-slate-500">
                          The AI assistant will be able to suggest features,
                          refine ideas, and help you expand on your project
                          concept.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 py-2">
                      {chatMessages.map((message, index) => (
                        <div
                          key={index}
                          className="p-3 bg-slate-100 rounded-lg"
                        >
                          {message}
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>

                <div className="pt-4 mt-auto">
                  <div className="flex items-center gap-2 bg-slate-50 rounded-md p-1 border border-slate-200">
                    <Input
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      placeholder="Type your question here..."
                      className="border-0 focus-visible:ring-0 bg-transparent"
                      disabled
                    />
                    <Button
                      size="sm"
                      disabled
                      className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1"
                    >
                      <Send className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-slate-200 bg-gradient-to-br from-indigo-50 to-slate-50">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="bg-indigo-100 p-2 rounded-full">
                    <Sparkles className="h-4 w-4 text-indigo-600" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium text-slate-800">
                      Pro Tip
                    </h4>
                    <p className="text-xs text-slate-600">
                      Great brainstorming often starts with a clearly defined
                      problem. Focus on articulating the core issue your project
                      aims to solve.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
