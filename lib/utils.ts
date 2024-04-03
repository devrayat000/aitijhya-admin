import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export function env(key: string): string | undefined;
export function env(key: string, fallback: string): string;
export function env(key: string, fallback?: string) {
  return process.env[key] || fallback;
}

env.int = (key: string, fallback?: number) => {
  const val = env(key);
  return val ? parseInt(val) : fallback;
};

env.bool = (key: string, fallback?: boolean) => {
  const val = env(key);
  return val ? val === "true" : fallback;
};

env.string = (key: string, fallback?: string) => {
  // @ts-ignore
  return env(key, fallback);
};

export async function createFile(
  fileUrl: string,
  type: `${string}/${string}` = "image/jpeg"
) {
  if (typeof window === "undefined") {
    return null;
  }

  console.log("fileUrl", fileUrl);

  const response = await fetch(fileUrl);
  const data = await response.blob();
  const metadata = { type };
  const fileName = fileUrl.split("/").pop();

  return new File([data], decodeURIComponent(fileName!), metadata);
}
