import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formattedString = (str: string) => {
  //split the string by "-" and then capitalize each part
  const parts = str.split("-");
  const capitalized = parts.map((part) => {
    return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
  });
  return capitalized.join(" ");
};
