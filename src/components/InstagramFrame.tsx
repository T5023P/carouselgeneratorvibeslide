"use client";

import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { type Palette } from "@/lib/colors";
import { useState, useRef, useEffect } from "react";

interface InstagramFrameProps {
  children: React.ReactNode;
  totalSlides: number;
  palette: Palette;
}

export function InstagramFrame({ children, totalSlides, palette }: InstagramFrameProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (scrollRef.current) {
      const scrollLeft = scrollRef.current.scrollLeft;
      const width = scrollRef.current.clientWidth;
      const index = Math.round(scrollLeft / width);
      setCurrentSlide(index);
    }
  };

  return (
    <div className="w-full max-w-[420px] rounded-3xl border border-zinc-800 bg-black overflow-hidden shadow-2xl relative mx-auto font-sans">
      {/* IG Header */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-800/50">
        <div className="flex items-center gap-3">
          <div 
            className="h-8 w-8 rounded-full shadow-inner" 
            style={{ background: `linear-gradient(135deg, ${palette.brandLight}, ${palette.primary})` }}
          />
          <span className="text-sm font-semibold text-white">vibeslide_app</span>
        </div>
        <MoreHorizontal className="h-5 w-5 text-zinc-500" />
      </div>

      {/* Viewport - 4:5 Aspect Ratio Container */}
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex aspect-[4/5] w-full overflow-x-auto snap-x snap-mandatory hide-scrollbar"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {children}
      </div>

      {/* IG Footer Actions */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-4">
            <Heart className="h-6 w-6 text-white hover:text-zinc-400 transition-colors cursor-pointer" />
            <MessageCircle className="h-6 w-6 text-white hover:text-zinc-400 transition-colors cursor-pointer" />
            <Send className="h-6 w-6 text-white hover:text-zinc-400 transition-colors cursor-pointer" />
          </div>
          {/* Progress Dots */}
          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalSlides }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === currentSlide 
                    ? "w-1.5 bg-blue-500" // Active dot is always IG blue
                    : "w-1.5 bg-zinc-600"
                )}
              />
            ))}
          </div>
          <Bookmark className="h-6 w-6 text-white hover:text-zinc-400 transition-colors cursor-pointer" />
        </div>
        
        <div className="text-sm">
          <span className="font-semibold text-white mr-2">vibeslide_app</span>
          <span className="text-zinc-300">Transform your research into stunning carousels instantly. 🔥</span>
        </div>
      </div>
      
      {/* Global hide scrollbar styles (since inline style might not be fully supported in all browsers) */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}} />
    </div>
  );
}
