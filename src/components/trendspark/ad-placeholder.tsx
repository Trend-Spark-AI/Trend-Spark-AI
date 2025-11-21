import { cn } from "@/lib/utils";
import Script from "next/script";

type AdPlaceholderProps = {
  type: "header" | "sidebar" | "in-feed";
  className?: string;
};

export default function AdPlaceholder({ type, className }: AdPlaceholderProps) {
  const dimensions = {
    header: "w-full min-h-[90px] md:w-[728px]",
    sidebar: "w-full min-h-[250px] md:w-[300px]",
    "in-feed": "w-full min-h-[100px]",
  };

  // Unique ID for the container div to avoid conflicts
  const containerId = `container-6eaa19d8a6824496a6dfeea489379494-${type}-${Math.random().toString(36).substring(7)}`;

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
        />
        <div id={containerId}></div>
        <Script id={`adsterra-native-invoker-${type}`} strategy="afterInteractive">
          {`
            try {
              if(atag) {
                atag.inv(document.getElementById("${containerId}"));
              }
            } catch(e) {
              console.error("Adsterra invocation error:", e);
            }
          `}
        </Script>
    </div>
  );
}
