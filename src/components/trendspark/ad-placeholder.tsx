
"use client";

import { cn } from "@/lib/utils";
import Script from "next/script";
import { useEffect, useState } from "react";

type AdPlaceholderProps = {
  type: "header" | "sidebar" | "in-feed";
  className?: string;
};

export default function AdPlaceholder({ type, className }: AdPlaceholderProps) {
  const [uniqueId, setUniqueId] = useState("");

  useEffect(() => {
    // Generate a unique ID on the client side to avoid hydration errors
    setUniqueId(Math.random().toString(36).substring(7));
  }, []);

  const dimensions = {
    header: "w-full min-h-[90px] md:w-[728px]",
    sidebar: "w-full min-h-[250px] md:w-[300px]",
    "in-feed": "w-full min-h-[100px]",
  };

  // Stable container ID using the client-side generated uniqueId
  const containerId = `container-6eaa19d8a6824496a6dfeea489379494-${type}-${uniqueId}`;

  // Don't render anything until the unique ID is generated on the client
  if (!uniqueId) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-lg bg-muted/50",
          dimensions[type],
          className
        )}
      >
        {/* Placeholder before ad loads */}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg bg-transparent text-gray-500 dark:text-gray-400 mx-auto",
        dimensions[type],
        className
      )}
    >
      {/* Adsterra Native Banner */}
      <Script
        async
        data-cfasync="false"
        src="//pl28094365.effectivegatecpm.com/6eaa19d8a6824496a6dfeea489379494/invoke.js"
        strategy="afterInteractive"
        onLoad={() => {
          // Now that the main script is loaded, `atag` should be available.
          // We can safely run the invocation script.
          try {
            if (window.atag) {
              window.atag.inv(document.getElementById(containerId));
            }
          } catch (e) {
            console.error("Adsterra invocation error:", e);
          }
        }}
      />
      <div id={containerId}></div>
    </div>
  );
}

// Add atag to the window object to satisfy TypeScript
declare global {
  interface Window {
    atag?: {
      inv: (element: HTMLElement | null) => void;
    };
  }
}
