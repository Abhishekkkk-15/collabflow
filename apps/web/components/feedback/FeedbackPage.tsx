"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  MessageSquarePlus,
  ThumbsUp,
  Bug,
  Lightbulb,
  Send,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

/*
  CollabFlow – Feedback Page
  Goals:
  - Collect actionable feedback
  - Minimal friction
  - Clear feedback categories
*/

export default function FeedbackPage() {
  const [type, setType] = useState<"idea" | "bug" | "general">("general");

  return (
    <main className="container mx-auto px-6 py-24 space-y-20">
      <Header />
      <FeedbackType value={type} onChange={setType} />
      <FeedbackForm type={type} />
    </main>
  );
}

/* ---------------- HEADER ---------------- */
function Header() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center space-y-4">
      <h1 className="text-4xl md:text-5xl font-bold">Feedback</h1>
      <p className="text-muted-foreground max-w-xl mx-auto">
        Your feedback shapes CollabFlow. Tell us what’s working and what’s not.
      </p>
    </motion.section>
  );
}

/* ---------------- FEEDBACK TYPE ---------------- */
function FeedbackType({ value, onChange }: any) {
  const options = [
    { id: "general", label: "General", icon: <MessageSquarePlus /> },
    { id: "idea", label: "Feature Idea", icon: <Lightbulb /> },
    { id: "bug", label: "Bug Report", icon: <Bug /> },
  ];

  return (
    <section className="grid sm:grid-cols-3 gap-6">
      {options.map((o) => (
        <motion.button
          key={o.id}
          whileHover={{ y: -4 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onChange(o.id)}
          className={`rounded-xl border p-6 text-left transition \
            ${
              value === o.id ? "border-primary bg-primary/5" : "bg-background"
            }`}>
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
            {o.icon}
          </div>
          <h3 className="font-semibold">{o.label}</h3>
        </motion.button>
      ))}
    </section>
  );
}

/* ---------------- FORM ---------------- */
function FeedbackForm({ type }: { type: string }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}>
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-6 space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold">Submit feedback</h2>
            <p className="text-sm text-muted-foreground">
              {type === "bug"
                ? "Please include steps to reproduce the issue."
                : type === "idea"
                ? "Describe your idea and how it would help you."
                : "Share your thoughts with us."}
            </p>
          </div>

          <Input placeholder="Title" />

          <Textarea
            placeholder={
              type === "bug"
                ? "What happened? What did you expect?"
                : type === "idea"
                ? "Describe your feature idea in detail"
                : "Write your feedback here"
            }
            rows={6}
          />

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ThumbsUp className="h-4 w-4" /> We read every message
            </div>
            <Button className="gap-2">
              <Send className="h-4 w-4" /> Submit
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.section>
  );
}
