// components/RouteLoaderWrapper.jsx
"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import GlobalLoader from "@/components/GlobalLoader";

export default function RouteLoaderWrapper({ children }) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // jab bhi pathname change ho -> loader dikhao
    setLoading(true);

    const timeout = setTimeout(() => {
      setLoading(false);
    }, 500); // 0.5s delay (adjust kar sakte ho)

    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <>
      {loading && <GlobalLoader />}
      {children}
    </>
  );
}
