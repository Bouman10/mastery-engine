import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Duration } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getCycleCount(duration: Duration): number {
  return duration === 30 ? 4 : duration === 60 ? 8 : 12;
}

export function getDurationLabel(duration: Duration): string {
  return duration === 30 ? "Sprint" : duration === 60 ? "Deep Dive" : "Mastery Arc";
}
