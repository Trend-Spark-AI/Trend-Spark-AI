import { cn } from "@/lib/utils";

type AdPlaceholderProps = {
  type: "header" | "sidebar" | "in-feed";
  className?: string;
};

export default function AdPlaceholder({ type, className }: AdPlaceholderProps) {
  const dimensions = {
    header: "w-full h-[90px] md:w-[728px]",
    sidebar: "w-full h-[250px] md:w-[300px]",
    "in-feed": "w-full h-[100px]",
  };

  const labels = {
    header: "Advertisement (728x90)",
    sidebar: "Advertisement (300x250)",
    "in-feed": "Advertisement",
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 mx-auto",
        dimensions[type],
        className
      )}
    >
      <span className="text-xs font-medium">{labels[type]}</span>
      <span className="text-[10px] mt-1">Your Ad Here</span>
    </div>
  );
}