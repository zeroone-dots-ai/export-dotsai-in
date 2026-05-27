import type { Config } from "tailwindcss";

/**
 * ZeroOne D.O.T.S. AI brand palette + typography.
 * Lavender / Mint / Peach / Sky on cream paper.
 * Instrument Serif for headlines, DM Sans for body, Space Mono for code/data.
 */
const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./content/**/*.{md,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1.25rem", lg: "2rem" },
      screens: { "2xl": "1280px" },
    },
    extend: {
      colors: {
        // ZeroOne brand (soft, editorial)
        lavender: {
          50: "#F5F1FF",
          100: "#ECE4FF",
          200: "#DCCCFF",
          300: "#C8B6FF",
          400: "#A993F7",
          500: "#8A6FED",
          600: "#6F52D5",
          700: "#5A3FB0",
          800: "#46318C",
          900: "#322368",
        },
        mint: {
          50: "#F2FBF7",
          100: "#E2F5EC",
          200: "#CDEDDE",
          300: "#B8E0D2",
          400: "#8FCBB6",
          500: "#67B69A",
          600: "#4A9A7F",
          700: "#387C66",
          800: "#2A5E4E",
          900: "#1D4037",
        },
        peach: {
          50: "#FFF7F2",
          100: "#FFEEE5",
          200: "#FFDFCB",
          300: "#FFCDB2",
          400: "#FFB58E",
          500: "#FF9966",
          600: "#E67A42",
          700: "#BD5F2E",
          800: "#92481F",
          900: "#673214",
        },
        sky: {
          50: "#F1F8FF",
          100: "#E2F0FF",
          200: "#C4E1FF",
          300: "#A2D2FF",
          400: "#7DBCFD",
          500: "#52A2FA",
          600: "#2E84E8",
          700: "#1F69C3",
          800: "#164F95",
          900: "#0D376A",
        },
        // Canvas
        paper: "#FDFBF7",   // warm cream — primary background
        ink: "#1A1A1A",     // primary text
        muted: "#6B6B6B",   // secondary text
        line: "#E8E4DC",    // hairline borders
        // shadcn semantic
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      fontFamily: {
        serif: ["var(--font-instrument-serif)", "ui-serif", "Georgia", "serif"],
        sans: ["var(--font-dm-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-space-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      fontSize: {
        // Editorial display sizes
        "display-xl": ["clamp(3rem, 6vw, 5rem)", { lineHeight: "1.02", letterSpacing: "-0.02em" }],
        "display-lg": ["clamp(2.25rem, 4.5vw, 3.5rem)", { lineHeight: "1.05", letterSpacing: "-0.015em" }],
        "display-md": ["clamp(1.75rem, 3vw, 2.5rem)", { lineHeight: "1.1", letterSpacing: "-0.01em" }],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-up": "fade-up 600ms cubic-bezier(0.22, 1, 0.36, 1)",
        "shimmer": "shimmer 2.5s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
