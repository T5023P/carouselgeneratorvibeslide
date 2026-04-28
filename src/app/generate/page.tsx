"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, ArrowLeft, Wand2, Sparkles } from "lucide-react";
import Link from "next/link";
import { SlidePreview } from "@/components/SlidePreview";
import { type ThemeVibe } from "@/lib/ThemeDictionary";

const categories = [
  { id: "tech", label: "Tech/SaaS" },
  { id: "health", label: "Health/Wellness" },
  { id: "finance", label: "Finance/Biz" },
  { id: "news", label: "News/Viral" },
];

function GenerateContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "tech";

  const [category, setCategory] = useState<string>(initialCategory);
  const [topic, setTopic] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [slides, setSlides] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsLoading(true);
    setError(null);
    setSlides([]);

    const categoryLabel = categories.find((c) => c.id === category)?.label || "Tech/SaaS";

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, category: categoryLabel }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate carousel");
      }

      const data = await response.json();
      if (data.slides && Array.isArray(data.slides)) {
        setSlides(data.slides);
      } else {
        throw new Error("Invalid response format from AI");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-6xl px-4 py-12">
      <Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[400px_1fr]">
        {/* Left Column: Form */}
        <div>
          <h1 className="mb-2 text-3xl font-bold tracking-tight">Generate Carousel</h1>
          <p className="mb-8 text-zinc-400">Enter a topic or URL, and our agent will research and design your slides.</p>

          <form onSubmit={handleGenerate} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-300">Category Vibe</label>
              <div className="grid grid-cols-2 gap-3">
                {categories.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCategory(c.id)}
                    className={`rounded-xl border p-3 text-sm font-medium transition-all ${
                      category === c.id
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:border-zinc-700"
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="topic" className="mb-2 block text-sm font-medium text-zinc-300">
                Topic or Source URL
              </label>
              <textarea
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. The latest Vercel Breach details..."
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 text-white placeholder-zinc-500 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent min-h-[120px] resize-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !topic.trim()}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-6 py-4 font-bold text-black transition-all hover:bg-[#b3ff00] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Researching live data...
                </>
              ) : (
                <>
                  <Wand2 className="h-5 w-5" />
                  Generate Carousel
                </>
              )}
            </button>
            
            {error && (
              <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
                {error}
              </div>
            )}
          </form>
        </div>

        {/* Right Column: Preview Area */}
        <div className="flex flex-col items-center justify-center rounded-3xl border border-zinc-800/50 bg-zinc-900/20 p-8 min-h-[600px]">
          <AnimatePresence mode="wait">
            {isLoading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center text-center text-zinc-400"
              >
                <div className="relative mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 shadow-2xl">
                  <div className="absolute inset-0 rounded-full border-t-2 border-accent animate-spin" />
                  <Wand2 className="h-8 w-8 text-accent animate-pulse" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-white">Agent is working...</h3>
                <p className="max-w-[250px] text-sm">
                  Fetching real-time context via Tavily and crafting copy with Llama 3.3.
                </p>
              </motion.div>
            )}

            {!isLoading && slides.length === 0 && !error && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center text-zinc-500"
              >
                <div className="mb-4 rounded-full bg-zinc-900 p-6">
                  <Sparkles className="h-8 w-8 opacity-50" />
                </div>
                <p>Your generated slides will appear here.</p>
              </motion.div>
            )}

            {!isLoading && slides.length > 0 && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full flex overflow-x-auto pb-8 gap-6 snap-x snap-mandatory"
                style={{ scrollbarWidth: 'thin' }}
              >
                {slides.map((slide, idx) => (
                  <div key={idx} className="shrink-0 snap-center">
                    <SlidePreview
                      theme={category as ThemeVibe}
                      title={slide.title}
                      content={slide.bodyText}
                      stepNumber={idx + 1}
                      totalSteps={slides.length}
                    />
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

// Wrap in Suspense because useSearchParams causes client-side de-opt
export default function GeneratePage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-accent" /></div>}>
      <GenerateContent />
    </Suspense>
  );
}
