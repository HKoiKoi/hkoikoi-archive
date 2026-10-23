/** YYYY-MM-DD → YYYY.MM */
export function formatYearMonth(date: string): string {
  return date.slice(0, 7).replace("-", ".");
}

/** 종료일이 없으면 "현재"로 표시한다. */
export function formatPeriod(startDate: string, endDate?: string): string {
  return `${formatYearMonth(startDate)} - ${endDate ? formatYearMonth(endDate) : "현재"}`;
}

/** ISO 8601 → YYYY.MM.DD (Asia/Seoul) */
export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Seoul",
  })
    .format(new Date(iso))
    .replace(/\.\s/g, ".")
    .replace(/\.$/, "");
}
