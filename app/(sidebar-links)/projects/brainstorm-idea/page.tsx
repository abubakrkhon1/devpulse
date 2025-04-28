"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";

export default function BrainstormingPage() {
  const [projectName, setProjectName] = useState("");
  const [problem, setProblem] = useState("");
  const [audience, setAudience] = useState("");
  const [features, setFeatures] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState("");
  const [notes, setNotes] = useState("");
  const [chatMessages, setChatMessages] = useState<string[]>([]);
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

  const handleSave = async () => {
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
    } catch (error) {}
  };

  return (
    <div className="h-fit flex flex-col">
      <header className="border-b p-6">
        <h1 className="text-2xl font-bold">🧠 Brainstorm Your New Project</h1>
      </header>

      <main className="flex-1  p-6 flex flex-col gap-6 lg:flex-row lg:gap-10">
        {/* Left side */}
        <div className="flex-1 flex flex-col gap-6">
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Project Name</label>
                <Input
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="My Next Big Idea"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Problem it Solves</label>
                <Textarea
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  placeholder="What problem does this project solve?"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Target Audience</label>
                <Input
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  placeholder="Who will use it?"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Features</label>
                <div className="flex gap-2">
                  <Input
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    placeholder="Add a feature idea..."
                  />
                  <Button onClick={handleAddFeature}>Add</Button>
                </div>
                <ul className="space-y-2">
                  {features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between rounded-md bg-muted p-2"
                    >
                      <span>{feature}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRemoveFeature(index)}
                      >
                        Remove
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Notes</label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any random thoughts, tech stack ideas, etc."
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSave}>Save Brainstorm</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right side - Chat Space */}
        <div className="flex-1 lg:w-1/3 flex flex-col gap-4">
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>🤖 Brainstorm AI Chat (Coming Soon)</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col h-[500px]">
              <ScrollArea className="flex-1 rounded-md border p-4">
                {chatMessages.length === 0 ? (
                  <div className="text-muted-foreground text-sm text-center">
                    No messages yet. Start chatting when AI is ready!
                  </div>
                ) : (
                  <ul className="space-y-3">
                    {chatMessages.map((message, index) => (
                      <li key={index} className="p-2 bg-muted rounded">
                        {message}
                      </li>
                    ))}
                  </ul>
                )}
              </ScrollArea>
              <div className="mt-4 flex">
                <Input
                  placeholder="Type your idea here..."
                  className="flex-1"
                />
                <Button className="ml-2">Send</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
