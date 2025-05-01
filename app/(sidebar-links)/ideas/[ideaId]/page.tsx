"use client";

import { useParams } from "next/navigation";

export default function ProjectsDashboard() {
  const { ideaId } = useParams();
  return <div className="bg-gray-50 min-h-screen p-6">{ideaId}</div>;
}
