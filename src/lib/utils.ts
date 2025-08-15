import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper functions moved to top level for better organization
export const getLongestValue = (values: string[]): string => {
  return values
    .filter((val) => val && val.trim() !== "")
    .reduce(
      (longest, current) =>
        current.length > longest.length ? current : longest,
      values[0] || ""
    );
};

export const getLongestNote = (notes: string[]): string => {
  return notes
    .filter((note) => note && note.trim() !== "")
    .reduce(
      (longest, current) =>
        current.length > longest.length ? current : longest,
      ""
    );
};

export const normalizeScientificName = (name: string): string => {
  return name.replace(/\s*\([^)]*\).*$/, "").trim();
};
