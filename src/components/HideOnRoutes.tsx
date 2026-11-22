"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

export default function HideOnRoutes({
  routes,
  children,
}: {
  routes: string[];
  children: ReactNode;
}) {
  const pathname = usePathname();
  if (routes.includes(pathname)) return null;
  return <>{children}</>;
}