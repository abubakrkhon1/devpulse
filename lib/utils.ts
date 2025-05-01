import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: Date) {
  const date = new Date(dateString);
  const now = new Date();

  // Format just the time portion
  const timeFormat = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });
  const timeString = timeFormat.format(date);

  // Check if it's today
  if (date.toDateString() === now.toDateString()) {
    return `Today at ${timeString}`;
  }

  // Check if it's yesterday
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return `Yesterday at ${timeString}`;
  }

  // If it's not today or yesterday, show the date
  const dateFormat = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  });
  const dateStringed = dateFormat.format(date);

  return `${dateStringed} at ${timeString}`;
}
