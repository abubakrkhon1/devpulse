"use client";

import { useParams } from "next/navigation";

export default function ProjectsDashboard() {
  const { projectId } = useParams();
  return <div className="bg-gray-50 min-h-screen p-6">{projectId}</div>;
}
