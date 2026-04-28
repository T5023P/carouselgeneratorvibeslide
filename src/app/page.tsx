"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Zap, Shield, TrendingUp, Globe } from "lucide-react";

export default function Home() {
  const categories = [
    { name: "Tech/SaaS", icon: Zap, vibe: "Bento Premium" },
    { name: "Health/Wellness", icon: Shield, vibe: "Organic Minimal" },
    { name: "Finance/Biz", icon: TrendingUp, vibe: "Bold Authority" },
    { name: "News/Viral", icon: Globe, vibe: "Neo-Brutalist" },
  ];

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-20">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 text-sm font-medium text-accent">
          <Sparkles className="h-4 w-4" />
          <span>VibeSlide 2.0 is Live</span>
        </div>
        
        <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-7xl">
          <span className="text-gradient">The Universal</span>
          <br />
          <span className="text-accent">Agentic Engine</span>
        </h1>
        
        <p className="mx-auto mb-10 max-w-2xl text-lg text-zinc-400">
          From a single URL or topic to a high-end carousel in seconds. 
          Powered by Llama 3.3 and real-time research.
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <button className="flex items-center gap-2 rounded-full bg-accent px-8 py-4 font-semibold text-black transition-transform hover:scale-105 active:scale-95">
            Get Started
            <ArrowRight className="h-5 w-5" />
          </button>
          <button className="glass rounded-full px-8 py-4 font-semibold text-white transition-colors hover:bg-white/10">
            View Templates
          </button>
        </div>
      </motion.div>

      {/* Category Grid */}
      <div className="mt-32 grid w-full max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="glass group flex flex-col items-start gap-4 rounded-3xl p-6 transition-all hover:border-accent/40"
          >
            <div className="rounded-2xl bg-accent/10 p-3 text-accent group-hover:bg-accent group-hover:text-black transition-colors">
              <cat.icon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">{cat.name}</h3>
              <p className="text-sm text-zinc-500">{cat.vibe}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
