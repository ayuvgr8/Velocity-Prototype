import type { Config } from "tailwindcss";

// Velocity design-system palette (imported from "Velocity Context Layer.dc.html")
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#F4EFE6",
        panel: "#FBF9F4",
        sunken: "#F8F5EE",
        border: "#E1DBCF",
        "border-2": "#d8d1c2",
        "border-soft": "#ECE6D9",
        ink: "#17150E",
        "ink-2": "#3a362d",
        muted: "#5C574C",
        "muted-2": "#a59f90",
        chip: "#F1ECE1",
        purple: "#4326D6",
        "purple-2": "#5B3DF5",
        "purple-soft": "#EAE5FF",
        orange: "#F87D0C",
        "orange-deep": "#B5560A",
        green: "#1F7A4D",
        "green-soft": "#E1F0E8",
        danger: "#C24026",
        dark: "#0E0C07",
      },
      fontFamily: {
        display: ["var(--font-display)", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
