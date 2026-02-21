import { cn } from "@/lib/utils";

interface ScoreBadgeProps {
  score: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function ScoreBadge({ score, size = "md", className }: ScoreBadgeProps) {
  const color =
    score >= 85
      ? "bg-success text-success-foreground"
      : score >= 65
      ? "bg-accent text-accent-foreground"
      : "bg-destructive text-destructive-foreground";

  const sizes = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-1",
    lg: "text-base px-3 py-1.5 font-semibold",
  };

  return (
    <span className={cn("rounded-full font-medium inline-flex items-center gap-1", color, sizes[size], className)}>
      {score}
      <span className="opacity-70 text-[0.75em]">pts</span>
    </span>
  );
}
