import chroma from "chroma-js";

export type Palette = {
  primary: string;
  brandLight: string;
  brandDark: string;
  lightBg: string;
  darkBg: string;
};

export function generatePalette(primaryHex: string): Palette {
  // Ensure valid hex, default to our accent lime if invalid
  const baseColor = chroma.valid(primaryHex) ? chroma(primaryHex) : chroma("#b3ff00");

  return {
    primary: baseColor.hex(),
    
    // Lighten by mixing with 20% white
    brandLight: chroma.mix(baseColor, "#ffffff", 0.2, "rgb").hex(),
    
    // Darken by mixing with 30% black
    brandDark: chroma.mix(baseColor, "#000000", 0.3, "rgb").hex(),
    
    // Off-white: 97% white, 3% brand color
    lightBg: chroma.mix("#ffffff", baseColor, 0.03, "rgb").hex(),
    
    // Dark BG: Zinc 950 with a 5% tint of the brand color
    darkBg: chroma.mix("#09090b", baseColor, 0.05, "rgb").hex(),
  };
}
