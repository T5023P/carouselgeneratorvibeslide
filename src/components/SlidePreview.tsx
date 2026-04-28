"use client";

import { cn } from "@/lib/utils";
import { type Palette } from "@/lib/colors";
import { CheckCircle2, ChevronRight, Zap, Target, Layers } from "lucide-react";

interface SlidePreviewProps {
  layoutType: string;
  title: string;
  content: string;
  stepNumber: number;
  totalSteps: number;
  palette: Palette;
}

export function SlidePreview({
  layoutType,
  title,
  content,
  stepNumber,
  totalSteps,
  palette,
}: SlidePreviewProps) {
  // Common background styles
  const isSolution = layoutType === "solution";
  const bgStyle = isSolution 
    ? { background: `linear-gradient(135deg, ${palette.darkBg}, ${palette.brandDark})` }
    : { backgroundColor: palette.lightBg };
    
  const textColor = isSolution ? "text-white" : "text-black";
  
  // Extract bullet points or sentences for list-based layouts
  const listItems = content.split(/[.!?]+/).filter(i => i.trim().length > 0).slice(0, 3);

  return (
    <div
      className={cn(
        "flex aspect-[4/5] w-full min-w-full flex-col justify-between p-8 shrink-0 snap-center font-sans relative overflow-hidden",
        textColor
      )}
      style={bgStyle}
    >
      {/* Dynamic Header */}
      {layoutType !== "hero" && layoutType !== "cta" && (
        <div className="flex items-center justify-between mb-8 z-10">
          <div className="text-xs font-bold tracking-widest uppercase opacity-60" style={{ color: isSolution ? palette.brandLight : palette.primary }}>
            Phase 0{stepNumber}
          </div>
          <div className="flex gap-1">
            <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: palette.primary }} />
            <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: isSolution ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)" }} />
          </div>
        </div>
      )}

      {/* Hero Layout */}
      {layoutType === "hero" && (
        <div className="flex flex-col items-center justify-center h-full text-center z-10">
          <div className="mb-6 p-4 rounded-2xl shadow-lg" style={{ backgroundColor: palette.primary }}>
            <Zap className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-black tracking-tight leading-none mb-6" style={{ color: palette.darkBg }}>
            {title}
          </h1>
          <p className="text-lg font-medium opacity-80 max-w-[280px]">
            {content}
          </p>
        </div>
      )}

      {/* Problem Layout */}
      {layoutType === "problem" && (
        <div className="flex flex-col justify-center h-full z-10">
          <h2 className="text-3xl font-bold mb-8">{title}</h2>
          <div className="flex flex-col gap-4">
            <div className="relative inline-flex self-start px-4 py-2 text-sm font-semibold text-white/50 line-through rounded-full bg-red-500/10 border border-red-500/20">
              The old, broken way
            </div>
            <p className="text-xl font-medium leading-relaxed">
              {content}
            </p>
          </div>
        </div>
      )}

      {/* Solution Layout */}
      {layoutType === "solution" && (
        <div className="flex flex-col justify-center h-full z-10">
          <div className="mb-6 inline-flex items-center justify-center h-12 w-12 rounded-xl bg-white/10 backdrop-blur-md">
            <Target className="h-6 w-6" style={{ color: palette.brandLight }} />
          </div>
          <h2 className="text-3xl font-bold mb-6 text-white">{title}</h2>
          
          <div className="p-5 rounded-xl border border-white/10 bg-black/20 backdrop-blur-md shadow-2xl relative">
            <div className="absolute top-0 left-4 -translate-y-1/2 px-2 bg-black text-[10px] font-bold tracking-wider uppercase rounded text-white/50 border border-white/10">
              Prompt / Strategy
            </div>
            <p className="text-base text-white/90 font-mono leading-relaxed">
              {content}
            </p>
          </div>
        </div>
      )}

      {/* Features Layout */}
      {layoutType === "features" && (
        <div className="flex flex-col justify-center h-full z-10">
          <h2 className="text-3xl font-bold mb-8">{title}</h2>
          <div className="flex flex-col gap-5">
            {listItems.map((item, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-white shadow-sm border border-black/5">
                <CheckCircle2 className="h-6 w-6 shrink-0 mt-0.5" style={{ color: palette.primary }} />
                <p className="font-medium text-sm leading-snug">{item.trim()}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Details Layout */}
      {layoutType === "details" && (
        <div className="flex flex-col justify-center h-full z-10">
          <div className="p-6 rounded-3xl bg-white border border-black/5 shadow-xl relative overflow-hidden h-full flex flex-col justify-center">
            <div className="absolute -right-12 -top-12 w-40 h-40 rounded-full opacity-10" style={{ backgroundColor: palette.primary }} />
            <h2 className="text-3xl font-black mb-6 leading-tight">{title}</h2>
            <p className="text-lg font-medium opacity-80 leading-relaxed border-l-4 pl-4" style={{ borderColor: palette.primary }}>
              {content}
            </p>
          </div>
        </div>
      )}

      {/* How-To Layout */}
      {layoutType === "how-to" && (
        <div className="flex flex-col justify-center h-full z-10">
          <h2 className="text-3xl font-bold mb-8">{title}</h2>
          <div className="space-y-6">
            {listItems.map((item, i) => (
              <div key={i} className="flex gap-4 items-start relative">
                {i !== listItems.length - 1 && (
                  <div className="absolute left-4 top-10 w-0.5 h-10 opacity-20" style={{ backgroundColor: palette.primary }} />
                )}
                <div className="flex items-center justify-center w-8 h-8 rounded-full text-white font-bold text-sm shrink-0" style={{ backgroundColor: palette.primary }}>
                  0{i + 1}
                </div>
                <p className="font-semibold text-sm pt-1">{item.trim()}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA Layout */}
      {layoutType === "cta" && (
        <div className="flex flex-col items-center justify-center h-full text-center z-10 bg-black text-white absolute inset-0 p-8">
          <div className="mb-8 p-6 rounded-3xl" style={{ backgroundColor: palette.darkBg }}>
            <Layers className="h-16 w-16" style={{ color: palette.brandLight }} />
          </div>
          <h2 className="text-4xl font-black mb-6 leading-tight">
            {title}
          </h2>
          <p className="text-lg opacity-80 mb-10 max-w-[250px]">
            {content}
          </p>
          <div className="w-full py-4 rounded-xl font-bold shadow-2xl flex items-center justify-center gap-2" style={{ backgroundColor: palette.primary, color: palette.darkBg }}>
            Get Started Now
            <ChevronRight className="h-5 w-5" />
          </div>
        </div>
      )}

      {/* Global Footer (except CTA) */}
      {layoutType !== "cta" && (
        <div className="mt-auto pt-6 flex items-center justify-between z-10 border-t border-black/5 opacity-60">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded-full" style={{ backgroundColor: palette.primary }} />
            <span className="text-xs font-bold tracking-tight">@vibeslide_app</span>
          </div>
          <span className="text-xs font-bold uppercase tracking-wider">Swipe</span>
        </div>
      )}

      {/* Global subtle texture/glow */}
      <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'radial-gradient(circle at center, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
    </div>
  );
}
