export type ThemeVibe = "tech" | "health" | "finance" | "news";

export interface ThemeConfig {
  background: string;
  text: string;
  accent: string;
  font: string;
  card: string;
  border: string;
  shadow: string;
}

export const ThemeDictionary: Record<ThemeVibe, ThemeConfig> = {
  tech: {
    background: "bg-zinc-950",
    text: "text-zinc-100",
    accent: "text-[#CCFF00]",
    font: "font-mono",
    card: "bg-zinc-900/50 backdrop-blur-md",
    border: "border border-zinc-800",
    shadow: "shadow-xl shadow-black/50",
  },
  health: {
    background: "bg-[#FDFCF0]",
    text: "text-[#1A362D]",
    accent: "text-[#2E5C4E]",
    font: "font-serif",
    card: "bg-white",
    border: "border border-[#E5E5D8]",
    shadow: "shadow-lg shadow-black/5",
  },
  finance: {
    background: "bg-[#0A2540]",
    text: "text-white",
    accent: "text-[#635BFF]",
    font: "font-sans font-bold tracking-tight",
    card: "bg-white text-[#0A2540]",
    border: "border-none",
    shadow: "shadow-[0_8px_30px_rgb(0,0,0,0.12)]",
  },
  news: {
    background: "bg-[#FFD700]",
    text: "text-black",
    accent: "text-[#FF3366]",
    font: "font-black tracking-tighter uppercase",
    card: "bg-white",
    border: "border-4 border-black",
    shadow: "shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]",
  },
};
