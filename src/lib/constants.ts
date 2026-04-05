export const PLANS = {
  free: {
    name: "Free",
    monthlyLimit: 3,
    price: 0,
  },
  pro: {
    name: "Pro",
    monthlyLimit: Infinity,
    price: 29,
  },
  annual: {
    name: "Pro (Annual)",
    monthlyLimit: Infinity,
    price: 249,
  },
} as const;

export type PlanType = keyof typeof PLANS;

export const TONES = [
  { value: "professional", label: "Professional" },
  { value: "casual", label: "Casual" },
  { value: "witty", label: "Witty" },
  { value: "educational", label: "Educational" },
] as const;

export type ToneType = (typeof TONES)[number]["value"];

export const PLATFORMS = [
  { key: "linkedin", label: "LinkedIn", icon: "Briefcase" },
  { key: "twitter", label: "X / Twitter", icon: "AtSign" },
  { key: "instagram", label: "Instagram", icon: "Camera" },
  { key: "newsletter", label: "Newsletter", icon: "Mail" },
  { key: "reddit", label: "Reddit", icon: "MessageSquare" },
  { key: "tiktok", label: "TikTok", icon: "Video" },
  { key: "email", label: "Email", icon: "Send" },
] as const;

export type PlatformKey = (typeof PLATFORMS)[number]["key"];
