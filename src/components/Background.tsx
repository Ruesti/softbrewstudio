"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";

const MAP = {
  "/focuspilot": { desktop: "/bg/focuspilot-desktop.jpg", mobile: "/bg/focuspilot-mobile.jpg" },
  "/shiftrix":   { desktop: "/bg/shiftrix-desktop.jpg",   mobile: "/bg/shiftrix-mobile.jpg" },
  "/linguai":    { desktop: "/bg/linguai-desktop.jpg",    mobile: "/bg/linguai-mobile.jpg" },
  "/updates":    { desktop: "/bg/updates-desktop.jpg",    mobile: "/bg/updates-mobile.jpg" },
  "/":           { desktop: "/bg/softbrew-desktop.jpg",   mobile: "/bg/softbrew-mobile.jpg" },
} as const;

export default function Background() {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const update = () => setIsMobile(window.matchMedia("(max-width: 768px)").matches);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Längsten Prefix matchen (damit /focuspilot nicht von "/" überdeckt wird)
  const key =
    (Object.keys(MAP) as Array<keyof typeof MAP>)
      .sort((a, b) => b.length - a.length)
      .find(k => pathname?.startsWith(k)) || "/";

  const src = isMobile ? MAP[key].mobile : MAP[key].desktop;

  return (
    <div className="fixed inset-0 z-0 overflow-hidden"> {/* z-0 statt -z-10 */}
      <Image
        src={src}
        alt="Background"
        fill
        priority
        sizes="100vw"
        className="object-cover object-center opacity-90 motion-safe:animate-slow-zoom"
      />
      <div className="absolute inset-0 bg-softbrew-blue/20 mix-blend-soft-light" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:40px_40px]" />
    </div>
  );
}

