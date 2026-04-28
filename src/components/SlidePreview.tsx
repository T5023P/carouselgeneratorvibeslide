"use client";

import { ThemeDictionary, type ThemeVibe } from "@/lib/ThemeDictionary";
import { cn } from "@/lib/utils";

interface SlidePreviewProps {
  theme: ThemeVibe;
  title: string;
  content: string;
  stepNumber?: number;
  totalSteps?: number;
}

export function SlidePreview({
  theme,
  title,
  content,
  stepNumber,
  totalSteps,
}: SlidePreviewProps) {
  const t = ThemeDictionary[theme];

  return (
    <div
      className={cn(
        "flex aspect-[4/5] w-full max-w-sm flex-col p-8 transition-all duration-500",
        t.background,
        t.text,
        t.font
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className={cn("text-sm font-bold opacity-80", t.accent)}>
          {stepNumber && totalSteps ? `Slide ${stepNumber} of ${totalSteps}` : "VibeSlide"}
        </div>
        {/* Decorative element based on theme */}
        {theme === "tech" && (
          <div className="flex gap-1">
            <div className="h-2 w-2 rounded-full bg-red-500" />
            <div className="h-2 w-2 rounded-full bg-yellow-500" />
            <div className="h-2 w-2 rounded-full bg-green-500" />
          </div>
        )}
      </div>

      {/* Main Content Area (The "Card") */}
      <div
        className={cn(
          "flex flex-1 flex-col justify-center rounded-2xl p-8",
          t.card,
          t.border,
          t.shadow
        )}
      >
        <h2 className={cn("mb-6 text-3xl md:text-4xl leading-tight", theme === "finance" ? "tracking-tighter" : "")}>
          {title}
        </h2>
        
        <p className="text-lg opacity-90 leading-relaxed">
          {content}
        </p>
      </div>

      {/* Footer */}
      <div className="mt-8 flex items-center justify-between opacity-60 text-sm">
        <div className="flex items-center gap-2">
          <div className={cn("h-6 w-6 rounded-full", t.text === "text-white" ? "bg-white" : "bg-black")} />
          <span>@yourhandle</span>
        </div>
        <span>Swipe</span>
      </div>
    </div>
  );
}
