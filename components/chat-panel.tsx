// components/ChatPanel.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ChatPanel({ profileId }: { profileId: string }) {
  const [messages, setMessages] = useState<{ from: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  // mock fetch existing messages
  useEffect(() => {
    // replace with real fetch...
    setMessages([
      { from: "them", text: "Hey there!" },
      { from: "you", text: "Hi! How’s it going?" },
    ]);
  }, [profileId]);

  // scroll to bottom on new message
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    if (!input.trim()) return;
    // replace with real socket / API send...
    setMessages((m) => [...m, { from: "you", text: input }]);
    setInput("");
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        Chat
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto space-y-2 pb-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`px-3 py-1 rounded ${
              m.from === "you" ? "bg-primary text-primary-foreground self-end" : "bg-muted"
            }`}
          >
            {m.text}
          </div>
        ))}
        <div ref={endRef} />
      </CardContent>
      <CardFooter className="pt-2">
        <div className="flex gap-2">
          <Input
            placeholder="Type a message…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
          />
          <Button onClick={send}>Send</Button>
        </div>
      </CardFooter>
    </Card>
  );
}
