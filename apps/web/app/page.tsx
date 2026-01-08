"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Users,
  Workflow,
  CheckCircle2,
  LayoutDashboard,
  Zap,
  Shield,
  Globe,
  TrendingUp,
  Clock,
  Award,
  Star,
  Activity,
  GitBranch,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useRef } from "react";

function CollabFlowLanding({
  isAuthenticated = false,
}: {
  isAuthenticated?: boolean;
}) {
  return (
    <main className="relative overflow-hidden">
      <FloatingOrbs />
      <Hero isAuthenticated={isAuthenticated} />
      <StatsSection />
      <Features />
      <DetailedShowcase />
      <WorkflowSection />
      <Testimonials />
      <PricingSection />
      <FinalCTA isAuthenticated={isAuthenticated} />
    </main>
  );
}

export default function Home() {
  return <CollabFlowLanding isAuthenticated={false} />;
}

/* ---------------- FLOATING ORBS BACKGROUND ---------------- */
function FloatingOrbs() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full opacity-20 blur-3xl"
          style={{
            background:
              i % 3 === 0
                ? "radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)"
                : i % 3 === 1
                ? "radial-gradient(circle, #3b82f6 0%, transparent 70%)"
                : "radial-gradient(circle, #8b5cf6 0%, transparent 70%)",
            width: `${Math.random() * 300 + 100}px`,
            height: `${Math.random() * 300 + 100}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            x: [0, Math.random() * 100 - 50, 0],
            y: [0, Math.random() * 100 - 50, 0],
            scale: [1, 1.1, 1],
            opacity: [0.15, 0.25, 0.15],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  );
}

/* ---------------- HERO ---------------- */
function Hero({ isAuthenticated }: { isAuthenticated: boolean }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as any },
    },
  };

  return (
    <section
      ref={ref}
      className="relative min-h-[100vh] flex items-center overflow-hidden">
      <motion.div
        style={{ y, opacity }}
        className="absolute inset-0 -z-10 bg-gradient-to-br from-background via-background to-muted">
        <div className="absolute inset-0">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-48 -left-48 h-96 w-96 rounded-full bg-primary/20 blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              rotate: [90, 0, 90],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-48 -right-48 h-96 w-96 rounded-full bg-blue-500/20 blur-3xl"
          />
        </div>
      </motion.div>

      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6">
          <motion.span
            variants={itemVariants}
            className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm text-primary ring-1 ring-primary/20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}>
              <Sparkles className="h-4 w-4" />
            </motion.div>
            Real-time collaboration for serious teams
            <Badge variant="secondary" className="ml-1 text-xs">
              New
            </Badge>
          </motion.span>

          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-bold leading-tight">
            Build faster with{" "}
            <motion.span
              className="block bg-gradient-to-r from-primary via-blue-500 to-cyan-500 bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              style={{ backgroundSize: "200% 200%" }}>
              CollabFlow
            </motion.span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl text-muted-foreground max-w-xl leading-relaxed">
            A modern workspace for teams to collaborate, manage projects, run
            background workflows, and stay in sync — without chaos.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
            {isAuthenticated ? (
              <Button asChild size="lg" className="gap-2 group">
                <Link href="/dashboard">
                  Go to Dashboard
                  <LayoutDashboard className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            ) : (
              <Button
                asChild
                size="lg"
                className="gap-2 group relative overflow-hidden">
                <Link href="/login">
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/20 to-primary/0"
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                      repeatDelay: 1,
                    }}
                  />
                  <span className="relative">Get Started</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform relative" />
                </Link>
              </Button>
            )}
            <Button size="lg" variant="outline" className="gap-2 group">
              View Live Demo
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}>
                <Activity className="h-4 w-4" />
              </motion.div>
            </Button>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="flex items-center gap-6 pt-4">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.1, zIndex: 10 }}
                  className="h-10 w-10 rounded-full border-2 border-background bg-gradient-to-br from-primary to-cyan-500"
                />
              ))}
            </div>
            <div className="text-sm">
              <p className="font-semibold">2,000+ teams</p>
              <p className="text-muted-foreground">already collaborating</p>
            </div>
          </motion.div>
        </motion.div>

        <AnimatedMockup />
      </div>
    </section>
  );
}

/* ---------------- ENHANCED MOCKUP ---------------- */
function AnimatedMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
      transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] as any }}
      className="relative">
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotateX: [0, 2, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="rounded-2xl border-2 bg-background shadow-2xl overflow-hidden"
        style={{
          boxShadow:
            "0 20px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)",
        }}>
        <div className="h-12 border-b bg-gradient-to-r from-muted to-muted/50 flex items-center px-4 gap-2">
          <div className="flex gap-2">
            <motion.span
              whileHover={{ scale: 1.2 }}
              className="h-3 w-3 rounded-full bg-red-500 cursor-pointer"
            />
            <motion.span
              whileHover={{ scale: 1.2 }}
              className="h-3 w-3 rounded-full bg-yellow-500 cursor-pointer"
            />
            <motion.span
              whileHover={{ scale: 1.2 }}
              className="h-3 w-3 rounded-full bg-green-500 cursor-pointer"
            />
          </div>
          <div className="ml-6 flex-1 flex items-center gap-2 text-xs text-muted-foreground">
            <Shield className="h-3 w-3" />
            <span>collabflow.app/dashboard</span>
          </div>
        </div>

        <div className="p-6 bg-gradient-to-br from-background to-muted/30">
          <div className="flex items-center justify-between mb-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}>
              <h3 className="font-semibold text-lg">Dashboard Overview</h3>
              <p className="text-sm text-muted-foreground">
                Real-time workspace activity
              </p>
            </motion.div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}>
              <Activity className="h-5 w-5 text-primary" />
            </motion.div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <MockCard
              title="Active Projects"
              value="24"
              icon={<GitBranch className="h-4 w-4" />}
              delay={0.6}
            />
            <MockCard
              title="Team Members"
              value="18"
              icon={<Users className="h-4 w-4" />}
              delay={0.7}
            />
            <MockCard
              title="Tasks Today"
              value="156"
              icon={<CheckCircle2 className="h-4 w-4" />}
              delay={0.8}
            />
            <MockCard
              title="Live Activity"
              value="8"
              icon={<Activity className="h-4 w-4" />}
              delay={0.9}
              pulse
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-4 rounded-lg border bg-card p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">Recent Activity</span>
              <motion.div
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="h-2 w-2 rounded-full bg-green-500"
              />
            </div>
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 + i * 0.1 }}
                  className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  <div className="h-1.5 flex-1 bg-muted rounded-full">
                    <motion.div
                      className="h-full bg-primary rounded-full"
                      initial={{ width: "0%" }}
                      animate={{ width: `${Math.random() * 60 + 30}%` }}
                      transition={{ delay: 1.2 + i * 0.1, duration: 0.8 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-6 -right-6 h-24 w-24 rounded-xl bg-gradient-to-br from-primary to-cyan-500 shadow-lg flex items-center justify-center">
        <Zap className="h-12 w-12 text-white" />
      </motion.div>

      <motion.div
        animate={{
          y: [0, 20, 0],
          rotate: [0, -5, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute -bottom-6 -left-6 h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg flex items-center justify-center">
        <Globe className="h-10 w-10 text-white" />
      </motion.div>
    </motion.div>
  );
}

function MockCard({
  title,
  value,
  icon,
  delay,
  pulse,
}: {
  title: string;
  value?: string;
  icon?: React.ReactNode;
  delay: number;
  pulse?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.05, y: -2 }}
      className="rounded-lg border bg-card/50 backdrop-blur-sm p-4 relative overflow-hidden group cursor-pointer">
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-primary/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
        layoutId={`card-bg-${title}`}
      />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <p className="font-medium text-sm">{title}</p>
          <div className="text-primary">{icon}</div>
        </div>
        {value && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay + 0.2 }}
            className="text-2xl font-bold">
            {value}
          </motion.p>
        )}
        {pulse && (
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute top-2 right-2 h-2 w-2 rounded-full bg-green-500"
          />
        )}
      </div>
    </motion.div>
  );
}

/* ---------------- STATS SECTION ---------------- */
function StatsSection() {
  const stats = [
    { value: "10k+", label: "Active Users", icon: <Users /> },
    { value: "99.9%", label: "Uptime", icon: <Activity /> },
    { value: "50M+", label: "Tasks Completed", icon: <CheckCircle2 /> },
    { value: "150+", label: "Countries", icon: <Globe /> },
  ];

  return (
    <section className="py-20 border-y bg-gradient-to-b from-muted/50 to-background">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center group">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                {stat.icon}
              </motion.div>
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 + 0.2, type: "spring" }}>
                <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent">
                  {stat.value}
                </p>
              </motion.div>
              <p className="text-sm text-muted-foreground mt-2">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- FEATURES ---------------- */
function Features() {
  const features = [
    {
      icon: <Users />,
      title: "Team Workspaces",
      desc: "Manage members, roles, and permissions effortlessly with granular control.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: <Workflow />,
      title: "Background Jobs",
      desc: "Queues and workers for real production workloads at any scale.",
      color: "from-green-500 to-emerald-500",
    },
    {
      icon: <CheckCircle2 />,
      title: "Realtime Sync",
      desc: "Live updates powered by events and websockets for instant collaboration.",
      color: "from-orange-500 to-red-500",
    },
    {
      icon: <Zap />,
      title: "Lightning Fast",
      desc: "Optimized for speed with edge computing and intelligent caching.",
      color: "from-yellow-500 to-orange-500",
    },
    {
      icon: <Shield />,
      title: "Enterprise Security",
      desc: "Bank-level encryption, SSO, and compliance with SOC 2 & GDPR.",
      color: "from-red-500 to-rose-500",
    },
    {
      icon: <Globe />,
      title: "Global CDN",
      desc: "Deploy worldwide with our distributed infrastructure and low latency.",
      color: "from-cyan-500 to-blue-500",
    },
  ];

  return (
    <section className="container mx-auto px-6 py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-16">
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 200 }}
          className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm text-primary mb-4">
          <Star className="h-4 w-4" />
          <span>Feature-rich platform</span>
        </motion.div>
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Everything your team needs
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Built for modern teams who demand excellence
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, i) => (
          <FeatureCard key={feature.title} {...feature} index={i} />
        ))}
      </div>
    </section>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
  color,
  index,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  color: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group">
      <Card className="h-full bg-background border-2 hover:border-primary/50 transition-all duration-300 overflow-hidden relative">
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
        />
        <CardContent className="p-6 space-y-4 relative z-10">
          <motion.div
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.6 }}
            className={`h-14 w-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center text-white shadow-lg`}>
            {icon}
          </motion.div>
          <h3 className="font-bold text-xl group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-muted-foreground leading-relaxed">{desc}</p>
          <motion.div
            className="flex items-center gap-2 text-primary font-medium text-sm"
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}>
            <span>Learn more</span>
            <motion.div
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}>
              <ArrowRight className="h-4 w-4" />
            </motion.div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* ---------------- DETAILED SHOWCASE ---------------- */
function DetailedShowcase() {
  return (
    <section className="py-32 bg-gradient-to-b from-background via-muted/30 to-background relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            See it in action
          </h2>
          <p className="text-xl text-muted-foreground">
            Experience the power of seamless collaboration
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6">
            <div className="space-y-4">
              {[
                {
                  icon: <MessageSquare />,
                  title: "Integrated Communication",
                  desc: "Chat, comments, and notifications all in one place",
                },
                {
                  icon: <TrendingUp />,
                  title: "Advanced Analytics",
                  desc: "Track progress with detailed insights and reports",
                },
                {
                  icon: <Clock />,
                  title: "Time Tracking",
                  desc: "Automatic time logs and productivity metrics",
                },
                {
                  icon: <Award />,
                  title: "Goal Management",
                  desc: "Set, track, and achieve team objectives",
                },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ x: 10 }}
                  className="flex gap-4 items-start group cursor-pointer">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all group-hover:scale-110">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                      {item.title}
                    </h4>
                    <p className="text-muted-foreground text-sm">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative">
            <div className="rounded-2xl border-2 bg-gradient-to-br from-card to-muted/50 p-8 shadow-2xl">
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.2 }}
                    className="flex items-center gap-3 p-4 rounded-lg bg-background border">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.3,
                      }}
                      className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-cyan-500"
                    />
                    <div className="flex-1 space-y-2">
                      <motion.div
                        className="h-3 bg-muted rounded-full"
                        initial={{ width: "0%" }}
                        whileInView={{ width: "70%" }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.2 + 0.3, duration: 0.8 }}
                      />
                      <motion.div
                        className="h-2 bg-muted rounded-full"
                        initial={{ width: "0%" }}
                        whileInView={{ width: "50%" }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.2 + 0.5, duration: 0.8 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- WORKFLOW ---------------- */
function WorkflowSection() {
  return (
    <section className="py-32">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring" }}>
              <Badge className="mb-4">Workflow Engine</Badge>
            </motion.div>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Designed for modern engineering teams
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              CollabFlow is built around real workflows — not toy demos. Perfect
              for async teams, startups, and serious builders.
            </p>
            <Button size="lg" className="gap-2 group">
              Explore Workflows
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}>
            <Card className="border-2 bg-gradient-to-br from-card to-muted/30 shadow-xl overflow-hidden">
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <Workflow className="h-5 w-5" />
                  </motion.div>
                  <div>
                    <p className="font-bold text-lg">Typical Workflow</p>
                    <p className="text-sm text-muted-foreground">
                      From setup to execution
                    </p>
                  </div>
                </div>

                <Separator className="mb-6" />

                <div className="space-y-4">
                  {[
                    {
                      step: "1",
                      text: "Create workspace",
                      icon: <LayoutDashboard />,
                    },
                    { step: "2", text: "Invite team members", icon: <Users /> },
                    { step: "3", text: "Launch projects", icon: <GitBranch /> },
                    {
                      step: "4",
                      text: "Run background jobs",
                      icon: <Workflow />,
                    },
                    {
                      step: "5",
                      text: "Track live activity",
                      icon: <Activity />,
                    },
                  ].map((item, i) => (
                    <motion.div
                      key={item.step}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ x: 10, scale: 1.02 }}
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-all cursor-pointer group">
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 360 }}
                        transition={{ duration: 0.6 }}
                        className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold group-hover:bg-primary group-hover:text-white transition-colors">
                        {item.step}
                      </motion.div>
                      <span className="flex-1 font-medium">{item.text}</span>
                      <div className="text-muted-foreground group-hover:text-primary transition-colors">
                        {item.icon}
                      </div>
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        className="text-primary">
                        <CheckCircle2 className="h-5 w-5" />
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- TESTIMONIALS ---------------- */
function Testimonials() {
  const testimonials = [
    {
      quote:
        "CollabFlow transformed how our team works. We're 3x more productive now.",
      author: "Sarah Chen",
      role: "CTO at TechCorp",
      avatar: "from-pink-500 to-rose-500",
    },
    {
      quote:
        "The best collaboration tool we've ever used. Intuitive and powerful.",
      author: "Michael Rodriguez",
      role: "Product Manager at StartupXYZ",
      avatar: "from-blue-500 to-cyan-500",
    },
    {
      quote:
        "Real-time sync is a game changer. Our remote team feels connected.",
      author: "Emily Watson",
      role: "Engineering Lead at DevTeam",
      avatar: "from-green-500 to-emerald-500",
    },
  ];

  return (
    <section className="py-32 bg-muted/30">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Loved by teams worldwide
          </h2>
          <p className="text-xl text-muted-foreground">
            See what our customers have to say
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}>
              <Card className="h-full border-2 hover:border-primary/50 transition-all duration-300">
                <CardContent className="p-6 space-y-4">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, j) => (
                      <motion.div
                        key={j}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 + j * 0.05 }}>
                        <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                      </motion.div>
                    ))}
                  </div>
                  <p className="text-lg leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                  <div className="flex items-center gap-3 pt-4">
                    <div
                      className={`h-12 w-12 rounded-full bg-gradient-to-br ${testimonial.avatar}`}
                    />
                    <div>
                      <p className="font-semibold">{testimonial.author}</p>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- PRICING ---------------- */
function PricingSection() {
  const plans = [
    {
      name: "Starter",
      price: "$9",
      period: "/month",
      features: [
        "Up to 5 team members",
        "10 projects",
        "Basic analytics",
        "Email support",
      ],
      cta: "Start Free Trial",
      popular: false,
    },
    {
      name: "Professional",
      price: "$29",
      period: "/month",
      features: [
        "Up to 20 team members",
        "Unlimited projects",
        "Advanced analytics",
        "Priority support",
        "Custom workflows",
      ],
      cta: "Get Started",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      features: [
        "Unlimited team members",
        "Unlimited everything",
        "Dedicated support",
        "Custom integrations",
        "SLA guarantee",
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ];

  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background -z-10" />

      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-xl text-muted-foreground">
            Choose the perfect plan for your team
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -12, scale: 1.02 }}
              className="relative">
              {plan.popular && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <Badge className="bg-primary text-white shadow-lg">
                    Most Popular
                  </Badge>
                </motion.div>
              )}
              <Card
                className={`h-full border-2 ${
                  plan.popular ? "border-primary shadow-2xl scale-105" : ""
                } transition-all duration-300`}>
                <CardContent className="p-8 space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground">
                        {plan.period}
                      </span>
                    </div>
                  </div>

                  <Separator />

                  <ul className="space-y-3">
                    {plan.features.map((feature, j) => (
                      <motion.li
                        key={j}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 + j * 0.05 }}
                        className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                        <span>{feature}</span>
                      </motion.li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full ${plan.popular ? "bg-primary" : ""}`}
                    variant={plan.popular ? "default" : "outline"}
                    size="lg">
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- FINAL CTA ---------------- */
function FinalCTA({ isAuthenticated }: { isAuthenticated: boolean }) {
  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-cyan-500/10 to-background -z-10" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8 relative">
          <motion.div
            animate={{
              y: [0, -20, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -top-20 -left-20 h-40 w-40 rounded-full bg-primary/20 blur-3xl"
          />
          <motion.div
            animate={{
              y: [0, 20, 0],
              rotate: [0, -5, 5, 0],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-cyan-500/20 blur-3xl"
          />

          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200 }}>
            <Badge className="mb-6 text-base px-6 py-2">
              Join thousands of teams
            </Badge>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl font-bold leading-tight">
            Ready to collaborate{" "}
            <span className="bg-gradient-to-r from-primary via-cyan-500 to-blue-500 bg-clip-text text-transparent">
              in flow?
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
            Start using CollabFlow today and bring clarity to your team's work.
            No credit card required.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-4 justify-center pt-4">
            {isAuthenticated ? (
              <Button
                asChild
                size="lg"
                className="gap-2 text-lg px-8 py-6 group">
                <Link href="/dashboard">
                  <span>Go to Dashboard</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            ) : (
              <>
                <Button
                  asChild
                  size="lg"
                  className="gap-2 text-lg px-8 py-6 group relative overflow-hidden">
                  <Link href="/login">
                    <motion.span
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                      animate={{ x: ["-200%", "200%"] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                        repeatDelay: 1,
                      }}
                    />
                    <span className="relative">Start for Free</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform relative" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6">
                  <Link href="/contact">Talk to Sales</Link>
                </Button>
              </>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-6 pt-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>Free 14-day trial</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>No credit card</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>Cancel anytime</span>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
