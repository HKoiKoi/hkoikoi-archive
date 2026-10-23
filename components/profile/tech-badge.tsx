import { Badge } from "@/components/ui/badge";

export function TechBadge({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Badge variant="secondary" className={className}>
      {children}
    </Badge>
  );
}

/** 태그가 0개면 아무것도 렌더링하지 않는다. */
export function TechBadgeList({
  items,
  className,
}: {
  items: string[];
  className?: string;
}) {
  if (items.length === 0) return null;
  return (
    <ul className={className ?? "flex flex-wrap gap-1.5"}>
      {items.map((item) => (
        <li key={item}>
          <TechBadge>{item}</TechBadge>
        </li>
      ))}
    </ul>
  );
}
