import { cn } from "@/lib/cn";

interface HighlightProps {
  children: React.ReactNode;
  className?: string;
}

/** Accent color for achievements, metrics, and standout phrases. */
export default function Highlight({ children, className }: HighlightProps) {
  return <span className={cn("text-highlight", className)}>{children}</span>;
}
