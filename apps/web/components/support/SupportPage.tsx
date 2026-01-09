"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  HelpCircle,
  Mail,
  MessageSquare,
  BookOpen,
  Bug,
  LifeBuoy,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/*
  CollabFlow – Support Page
  Goals:
  - Clear help paths
  - Fast self‑service
  - Human support fallback
*/

export default function SupportPage() {
  return (
    <main className="container mx-auto px-6 py-24 space-y-24">
      <Header />
      <QuickHelp />
      <ContactOptions />
      <FAQ />
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
      <h1 className="text-4xl md:text-5xl font-bold">Support</h1>
      <p className="text-muted-foreground max-w-xl mx-auto">
        Need help with CollabFlow? Start here — most issues are solved in
        minutes.
      </p>
    </motion.section>
  );
}

/* ---------------- QUICK HELP ---------------- */
function QuickHelp() {
  const items = [
    {
      icon: <BookOpen />,
      title: "Documentation",
      desc: "Guides, concepts, and API references.",
      href: "/docs",
    },
    {
      icon: <Bug />,
      title: "Report a Bug",
      desc: "Found something broken? Let us know.",
      href: "https://github.com/your-org/collabflow/issues",
    },
    {
      icon: <LifeBuoy />,
      title: "System Status",
      desc: "Live uptime and incident reports.",
      href: "/status",
    },
  ];

  return (
    <section className="grid md:grid-cols-3 gap-8">
      {items.map((item) => (
        <motion.div
          key={item.title}
          whileHover={{ y: -6 }}
          transition={{ type: "spring", stiffness: 300 }}>
          <Card className="h-full">
            <CardContent className="p-6 space-y-4">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                {item.icon}
              </div>
              <h3 className="font-semibold text-lg">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
              <Button asChild variant="link" className="px-0">
                <Link href={item.href}>Learn more →</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </section>
  );
}

/* ---------------- CONTACT OPTIONS ---------------- */
function ContactOptions() {
  return (
    <section className="grid md:grid-cols-2 gap-12 items-center">
      <div className="space-y-4">
        <h2 className="text-3xl font-bold">Contact Support</h2>
        <p className="text-muted-foreground">
          If you can’t find what you’re looking for, reach out directly. We
          usually respond within one business day.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <ContactCard
          icon={<Mail />}
          title="Email"
          desc="support@collabflow.app"
          href="mailto:support@collabflow.app"
        />
        <ContactCard
          icon={<MessageSquare />}
          title="Community"
          desc="Join discussions and ask questions"
          href="/community"
        />
      </div>
    </section>
  );
}

function ContactCard({ icon, title, desc, href }: any) {
  return (
    <motion.div whileHover={{ y: -4 }}>
      <Card className="h-full">
        <CardContent className="p-6 space-y-3">
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            {icon}
          </div>
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{desc}</p>
          <Button asChild variant="outline" size="sm">
            <Link href={href}>Contact</Link>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* ---------------- FAQ ---------------- */
function FAQ() {
  const faqs = [
    {
      q: "Is CollabFlow free to use?",
      a: "Yes. You can start for free. Paid plans will add advanced features and higher limits.",
    },
    {
      q: "Does CollabFlow support real-time updates?",
      a: "Yes. CollabFlow is built around real-time events, workers, and live activity streams.",
    },
    {
      q: "Can I self-host CollabFlow?",
      a: "Self-hosting options are planned. Stay tuned for updates.",
    },
    {
      q: "Where can I report security issues?",
      a: "Please email security@collabflow.app for responsible disclosure.",
    },
  ];

  return (
    <section className="max-w-3xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-12">FAQ</h2>
      <div className="space-y-6">
        {faqs.map((f) => (
          <motion.div
            key={f.q}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}>
            <Card>
              <CardContent className="p-6 space-y-2">
                <p className="font-medium">{f.q}</p>
                <p className="text-sm text-muted-foreground">{f.a}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
