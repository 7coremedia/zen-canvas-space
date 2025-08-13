import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface CursorRingProps {
  enabled?: boolean;
  size?: number;
  className?: string;
}

export default function CursorRing({ enabled = true, size = 48, className = "" }: CursorRingProps) {
  const [isVisible, setIsVisible] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);

  const springX = useSpring(x, { stiffness: 400, damping: 40, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 400, damping: 40, mass: 0.6 });
  const springScale = useSpring(scale, { stiffness: 260, damping: 22 });

  useEffect(() => {
    if (!enabled) return;

    let ctrlPressTimes: number[] = [];

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX - size / 2);
      y.set(e.clientY - size / 2);
    };

    const onCustomShow = () => setIsVisible(true);
    const onCustomHide = () => setIsVisible(false);

    const onDown = () => {
      scale.set(0.85);
      setTimeout(() => scale.set(1), 120);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "control") {
        const now = Date.now();
        ctrlPressTimes = [...ctrlPressTimes.filter((t) => now - t < 450), now];
        if (ctrlPressTimes.length >= 2) {
          setIsVisible((v) => !v);
          ctrlPressTimes = [];
        }
      }
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("cursor-ring:show", onCustomShow as any);
    window.addEventListener("cursor-ring:hide", onCustomHide as any);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("cursor-ring:show", onCustomShow as any);
      window.removeEventListener("cursor-ring:hide", onCustomHide as any);
    };
  }, [enabled, size, x, y, scale]);

  if (!enabled) return null;

  return (
    <motion.div
      style={{
        position: "fixed",
        left: springX,
        top: springY,
        width: size,
        height: size,
        pointerEvents: "none",
        zIndex: 60,
        scale: springScale,
      }}
      className={`rounded-full border border-white/60 mix-blend-difference will-change-transform ${className}`}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.2 }}
    />
  );
}

