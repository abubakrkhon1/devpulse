"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Idea {
  _id: string;
  projectName: string;
  problem: string;
  audience: string;
  features: string[];
  notes: string;
  createdAt: string;
}

export default function IdeasPage() {
  const router = useRouter();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchIdeas = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/ideas/fetchIdeas");
        const data = await res.json();
        console.log(data);

        setIdeas(data.ideas || []); // safer
      } catch (error) {
        console.error("Failed to fetch ideas:", error);
        setIdeas([]); // also safer
      } finally {
        setLoading(false);
      }
    };

    fetchIdeas();
  }, []);

  return (
    <div className="min-h-screen p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">🚀 Project Ideas</h1>
        <Button onClick={() => router.push("/projects/brainstorm-idea")}>
          Add New Idea
        </Button>{" "}
        {/* Hook it later */}
      </div>

      {loading ? (
        <div className="text-center">Loading ideas...</div>
      ) : ideas.length === 0 ? (
        <div className="text-center text-muted-foreground">No ideas found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {ideas.map((idea) => (
            <Card key={idea._id} className="flex flex-col justify-between">
              <CardHeader>
                <CardTitle>{idea.projectName}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <div>
                  <strong>Problem:</strong>{" "}
                  {idea.problem.length > 100
                    ? idea.problem.slice(0, 100) + "..."
                    : idea.problem}
                </div>
                <div>
                  <strong>Audience:</strong> {idea.audience}
                </div>
                {idea.features.length > 0 && (
                  <div>
                    <strong>Features:</strong> {idea.features.join(", ")}
                  </div>
                )}
                <div>
                  <strong>Notes:</strong>{" "}
                  {idea.notes.length > 100
                    ? idea.notes.slice(0, 100) + "..."
                    : idea.notes}
                </div>
                <div className="text-xs mt-2 text-right">
                  {new Date(idea.createdAt).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
