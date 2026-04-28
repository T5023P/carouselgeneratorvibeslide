import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { ThemeDictionary, type ThemeVibe } from "@/lib/ThemeDictionary";

export const runtime = "edge";

// Helper to fetch fonts
async function loadGoogleFont(font: string, text: string) {
  const url = `https://fonts.googleapis.com/css2?family=${font}&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(url)).text();
  const resource = css.match(/src: url\((.+)\) format\('(opentype|truetype)'\)/);

  if (resource) {
    const response = await fetch(resource[1]);
    if (response.status == 200) {
      return await response.arrayBuffer();
    }
  }
  
  // Fallback for woff2 or other formats
  const fallbackResource = css.match(/url\(([^)]+)\)/);
  if (fallbackResource) {
    const response = await fetch(fallbackResource[1]);
    return await response.arrayBuffer();
  }
  throw new Error("Failed to load font data");
}

// Fallback font buffers if dynamic fetch fails
const interFontP = fetch(
  new URL("https://fonts.gstatic.com/s/inter/v13/OpeYSRMFwQY28S8PIyJztw.ttf", import.meta.url)
).then((res) => res.arrayBuffer());

const serifFontP = fetch(
  new URL("https://fonts.gstatic.com/s/playfairdisplay/v30/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKdFvXDXbtM.ttf", import.meta.url)
).then((res) => res.arrayBuffer());


export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, bodyText, theme = "tech", stepNumber = 1, totalSteps = 7 } = body;

    const currentTheme = theme as ThemeVibe;
    const t = ThemeDictionary[currentTheme];

    // Load fonts based on theme
    let fontData;
    let fontFamilyName = "Inter";
    
    try {
      if (currentTheme === "health") {
        fontData = await serifFontP;
        fontFamilyName = "Playfair Display";
      } else {
        fontData = await interFontP;
      }
    } catch (e) {
      console.warn("Failed to load specific font, falling back to Inter", e);
      fontData = await interFontP;
    }

    // Extract hex colors from ThemeDictionary for safe Satori rendering
    // Satori's Tailwind doesn't always support arbitrary CSS variables well,
    // so we map the vibe directly to reliable inline styles.
    let bgColor = "#09090b"; // tech bg-zinc-950
    let textColor = "#f4f4f5"; // tech text-zinc-100
    let accentColor = "#CCFF00"; // tech
    let cardBg = "#18181b"; // tech zinc-900

    if (currentTheme === "health") {
      bgColor = "#FDFCF0";
      textColor = "#1A362D";
      accentColor = "#2E5C4E";
      cardBg = "#ffffff";
    } else if (currentTheme === "finance") {
      bgColor = "#0A2540";
      textColor = "#ffffff";
      accentColor = "#635BFF";
      cardBg = "#ffffff";
    } else if (currentTheme === "news") {
      bgColor = "#FFD700";
      textColor = "#000000";
      accentColor = "#FF3366";
      cardBg = "#ffffff";
    }

    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            height: "100%",
            backgroundColor: bgColor,
            color: textColor,
            fontFamily: fontFamilyName,
            padding: "80px",
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "80px" }}>
            <div style={{ color: accentColor, fontSize: "32px", fontWeight: "bold" }}>
              VibeSlide {stepNumber}/{totalSteps}
            </div>
            {currentTheme === "tech" && (
              <div style={{ display: "flex", gap: "12px" }}>
                <div style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "#ef4444" }} />
                <div style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "#eab308" }} />
                <div style={{ width: "24px", height: "24px", borderRadius: "50%", backgroundColor: "#22c55e" }} />
              </div>
            )}
          </div>

          {/* Card / Main Content */}
          <div
            style={{
              display: "flex",
              flex: 1,
              flexDirection: "column",
              justifyContent: "center",
              backgroundColor: currentTheme === "finance" ? cardBg : cardBg,
              color: currentTheme === "finance" ? "#0A2540" : currentTheme === "news" ? "#000000" : textColor,
              borderRadius: "48px",
              padding: "80px",
              border: currentTheme === "news" ? "12px solid black" : currentTheme === "tech" ? "2px solid #27272a" : currentTheme === "health" ? "2px solid #E5E5D8" : "none",
              boxShadow: currentTheme === "news" ? "24px 24px 0px 0px rgba(0,0,0,1)" : "0px 20px 40px rgba(0,0,0,0.2)",
            }}
          >
            <h1
              style={{
                fontSize: "72px",
                fontWeight: currentTheme === "finance" ? "800" : currentTheme === "news" ? "900" : "700",
                letterSpacing: currentTheme === "finance" ? "-2px" : currentTheme === "news" ? "-4px" : "normal",
                textTransform: currentTheme === "news" ? "uppercase" : "none",
                marginBottom: "48px",
                lineHeight: 1.1,
              }}
            >
              {title}
            </h1>
            <p
              style={{
                fontSize: "48px",
                opacity: 0.9,
                lineHeight: 1.4,
              }}
            >
              {bodyText}
            </p>
          </div>

          {/* Footer */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "80px", opacity: 0.7, fontSize: "32px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div style={{ width: "48px", height: "48px", borderRadius: "50%", backgroundColor: textColor === "#ffffff" ? "white" : "black" }} />
              <span>@yourhandle</span>
            </div>
            <span>Swipe ➔</span>
          </div>
        </div>
      ),
      {
        width: 1080,
        height: 1350,
        fonts: [
          {
            name: fontFamilyName,
            data: fontData,
            style: "normal",
          },
        ],
      }
    );
  } catch (error: any) {
    console.error("[API Render Slide] Error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
