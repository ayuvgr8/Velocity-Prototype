// Velocity design-system tokens (imported from "Velocity Context Layer.dc.html").
// Shared so dynamic inline styles stay exactly on-palette.
export const C = {
  cream: "#F4EFE6",
  panel: "#FBF9F4",
  sunken: "#F8F5EE",
  white: "#FFFFFF",
  border: "#E1DBCF",
  border2: "#d8d1c2",
  borderSoft: "#ECE6D9",
  ink: "#17150E",
  ink2: "#3a362d",
  muted: "#5C574C",
  muted2: "#a59f90",
  muted3: "#b3ac9c",
  chip: "#F1ECE1",
  purple: "#4326D6",
  purple2: "#5B3DF5",
  purpleSoft: "#EAE5FF",
  orange: "#F87D0C",
  orangeDeep: "#B5560A",
  green: "#1F7A4D",
  greenSoft: "#E1F0E8",
  greenSoft2: "#EEF6F0",
  danger: "#C24026",
  dark: "#0E0C07",
} as const;

export const mono = "font-mono tracking-[0.14em]";

// shared panel surface used across the workspace
export const panelStyle =
  "bg-panel border border-border rounded-2xl shadow-[0_18px_40px_-30px_rgba(20,18,12,0.5)]";
