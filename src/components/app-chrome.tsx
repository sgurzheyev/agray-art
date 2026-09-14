"use client";

import { usePathname } from "next/navigation";
import { AiChat } from "@/components/ai-chat";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import type { Category, SiteButton } from "@/lib/types";

export function AppChrome({
  children,
  navButtons,
  categories,
}: {
  children: React.ReactNode;
  navButtons: SiteButton[];
  categories: Category[];
}) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) {
    return <>{children}</>;
  }
  return (
    <>
      <Header navButtons={navButtons} categories={categories} />
      <main className="flex-1">{children}</main>
      <Footer categories={categories} />
      <AiChat />
    </>
  );
}
