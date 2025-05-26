import Head from "next/head";
import { ReactNode } from "react";
import Header from "@/components/Header/Index";
import Nav from "@/components/Nav/Index";
// import Footer from "@/components/Footer";

interface Props {
  children: ReactNode;
  name?: string;
}

export function MainLayout({ children, name }: Props) {
  return (
    <div>
      <Head>
        <title>{name || "My Platform"}</title>
      </Head>
      <div className="fixed top-0 z-20 w-full text-white left-0">
        <Header />

        <Nav />
      </div>
      <main>{children}</main>
      {/* <Footer /> */}
    </div>
  );
}
