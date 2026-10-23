import { Separator } from "@/components/ui/separator";

export type TimelineItem = {
  id: string;
  title: string;
  subtitle?: string;
  /** 표시용 기간 문자열 */
  period: string;
  details?: string[];
};

export function Timeline({
  items,
  label,
}: {
  items: TimelineItem[];
  /** 목록의 접근성 이름 */
  label?: string;
}) {
  if (items.length === 0) return null;

  return (
    <ol aria-label={label} className="flex flex-col">
      {items.map((item, index) => (
        <li key={item.id} className="relative flex gap-4">
          <div className="flex flex-col items-center">
            <span
              aria-hidden
              className="mt-1.5 size-2.5 shrink-0 rounded-full bg-primary"
            />
            {index < items.length - 1 ? (
              <Separator orientation="vertical" className="my-1 flex-1" />
            ) : null}
          </div>
          <div className="min-w-0 flex-1 pb-8">
            <p className="text-xs text-muted-foreground">{item.period}</p>
            <h3 className="font-heading font-medium break-words">
              {item.title}
            </h3>
            {item.subtitle ? (
              <p className="text-sm text-muted-foreground">{item.subtitle}</p>
            ) : null}
            {item.details && item.details.length > 0 ? (
              <ul className="mt-2 flex list-disc flex-col gap-1 pl-4 text-sm">
                {item.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
