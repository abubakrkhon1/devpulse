// components/ProjectSnapshotCards.tsx
"use client";

import {
  IconCheck,
  IconAlertTriangle,
  IconCalendar,
  IconPlus,
  IconBulb,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardAction,
} from "@/components/ui/card";

interface ActiveProject {
  name: string;
  status: "On Track" | "Behind";
  progress: number;
}

interface Deadline {
  task: string;
  project: string;
  due: string;
}

interface AtRisk {
  project: string;
  reason: string;
}

export function SectionCards() {
  const sections = [
    {
      key: "actions",
      title: "Quick Actions",
      Icon: IconBulb,
      items: [] as never[],
    },
    {
      key: "active",
      title: "Active Projects",
      Icon: IconCheck,
      items: [
        { name: "Alpha", status: "On Track", progress: 72 },
        { name: "Beta", status: "Behind", progress: 45 },
        { name: "Gamma", status: "On Track", progress: 88 },
      ] as ActiveProject[],
    },
    {
      key: "deadlines",
      title: "Upcoming Deadlines",
      Icon: IconCalendar,
      items: [
        { task: "Finalize UI", project: "Alpha", due: "Apr 25" },
        { task: "DB Migration", project: "Beta", due: "Apr 27" },
        { task: "Launch Campaign", project: "Delta", due: "Apr 29" },
      ] as Deadline[],
    },
    {
      key: "atrisk",
      title: "On-hold / At-Risk",
      Icon: IconAlertTriangle,
      items: [
        { project: "Epsilon", reason: "No updates for 5 days" },
        { project: "Zeta", reason: "Missing resources" },
      ] as AtRisk[],
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
      {sections.map(({ key, title, Icon, items }) => (
        <Card key={key}>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>{title}</CardTitle>
            <Icon className="h-5 w-5 text-gray-500" />
          </CardHeader>

          <CardContent>
            {key === "actions" ? (
              <div className="flex flex-col space-y-3">
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                >
                  <IconPlus className="h-4 w-4" /> New Project
                </Button>
                <Button className="w-full flex items-center justify-center gap-2">
                  <IconBulb className="h-4 w-4" /> Brainstorm Idea
                </Button>
              </div>
            ) : (
              <ul className="space-y-3">
                {key === "active" &&
                  (items as ActiveProject[]).map(
                    ({ name, status, progress }) => (
                      <li
                        key={name}
                        className="flex justify-between items-center"
                      >
                        <span>{name}</span>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={
                              status === "On Track"
                                ? "secondary"
                                : "destructive"
                            }
                          >
                            {status}
                          </Badge>
                          <span className="font-mono text-sm">{progress}%</span>
                        </div>
                      </li>
                    )
                  )}

                {key === "deadlines" &&
                  (items as Deadline[]).map(({ task, project, due }, i) => (
                    <li
                      key={`${task}-${i}`}
                      className="flex justify-between items-center"
                    >
                      <span>
                        {task}{" "}
                        <em className="text-muted-foreground">({project})</em>
                      </span>
                      <Badge variant="outline">{due}</Badge>
                    </li>
                  ))}

                {key === "atrisk" &&
                  (items as AtRisk[]).map(({ project, reason }) => (
                    <li
                      key={project}
                      className="flex justify-between items-center"
                    >
                      <span>{project}</span>
                      <Badge variant="default">{reason}</Badge>
                    </li>
                  ))}
              </ul>
            )}
          </CardContent>

          {key !== "actions" && (
            <CardFooter className="flex justify-end">
              <CardAction className="cursor-pointer hover:bg-primary hover:text-secondary p-2 rounded transition duration-300">
                View all
              </CardAction>
            </CardFooter>
          )}
        </Card>
      ))}
    </div>
  );
}
