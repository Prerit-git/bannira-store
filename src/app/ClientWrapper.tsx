"use client";

import { useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import Loader from "@/components/Loader";

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const contentTimer = setTimeout(() => {
      setShowContent(true);
    }, 1000);

    const loaderTimer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => {
      clearTimeout(contentTimer);
      clearTimeout(loaderTimer);
    };
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && <Loader />}
      </AnimatePresence>

      {showContent && children}
    </>
  );
}