"use client";

import { usePathname } from "next/navigation";
import AnnouncementBar from "./AnnouncementBar";
import Navbar from "./Navbar";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const hideAnnouncementPages = ["/checkout", "/login", "/register", "/order-success"];
  const isBarVisible = !hideAnnouncementPages.includes(pathname);

  return (
    <>
      {isBarVisible && <AnnouncementBar />}
      
      <Navbar isBarVisible={isBarVisible} />

      <main className={isBarVisible ? "pt-10" : "pt-0"}>
        {children}
      </main>
    </>
  );
}