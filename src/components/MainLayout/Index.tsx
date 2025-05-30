"use client";

import Head from "next/head";
import { ReactNode } from "react";
import Header from "@/components/Header/Index";
import Nav from "@/components/Nav/Index";
import { usePathname } from "next/navigation";

interface Props {
  children: ReactNode;
  name?: string;
}

export function MainLayout({ children, name }: Props) {
  const pathname = usePathname();

  const hideHeaderAndNav = pathname.startsWith("/dashboard");

  return (
    <div>
      <Head>
        <title>{name || "My Platform"}</title>
      </Head>

      {!hideHeaderAndNav && (
        <div className="fixed top-0 z-20 w-full text-white left-0">
          <Header />
          <Nav />
        </div>
      )}

      <main className={hideHeaderAndNav ? "" : "pt-[6rem]"}>{children}</main>
    </div>
  );
}
