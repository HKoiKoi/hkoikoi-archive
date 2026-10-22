import { notFound } from "next/navigation";

import { features } from "@/lib/site-config";

export default function BlogLayout({ children }: LayoutProps<"/blog">) {
  if (!features.blog) notFound();

  return children;
}
