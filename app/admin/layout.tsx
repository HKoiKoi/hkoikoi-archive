import { notFound } from "next/navigation";

import { features } from "@/lib/site-config";

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  if (!features.admin) notFound();

  return children;
}
