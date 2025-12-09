"use client";

import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export function SmoothCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 400 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent | TouchEvent) => {
      let x: number, y: number;
      
      if ('touches' in e) {
        x = e.touches[0].clientX;
        y = e.touches[0].clientY;
      } else {
        x = e.clientX;
        y = e.clientY;
      }
      
      cursorX.set(x - 16);
      cursorY.set(y - 16);
      setIsVisible(true);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("mouseenter", handleMouseEnter);
    
    // Touch support
    window.addEventListener("touchstart", moveCursor);
    window.addEventListener("touchmove", moveCursor);
    window.addEventListener("touchend", () => {
      setIsClicking(false);
      // Keep visible for a moment after touch
      setTimeout(() => setIsVisible(false), 500);
    });

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("mouseenter", handleMouseEnter);
      window.removeEventListener("touchstart", moveCursor);
      window.removeEventListener("touchmove", moveCursor);
      window.removeEventListener("touchend", () => setIsVisible(false));
    };
  }, [cursorX, cursorY]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="pointer-events-none fixed left-0 top-0 z-[9999]"
          style={{
            x: cursorXSpring,
            y: cursorYSpring,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
        >
          <motion.div
            className="relative flex h-8 w-8 items-center justify-center"
            animate={{
              scale: isClicking ? 0.8 : 1,
            }}
            transition={{ duration: 0.15 }}
          >
            {/* Mouse pointer arrow shape */}
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute"
            >
              <motion.path
                d="M5.5 3.21V20.79L12.5 13.79L17.5 18.79L19.5 16.79L14.5 11.79L21.5 4.79L5.5 3.21Z"
                fill="#C3073F"
                stroke="#C3073F"
                strokeWidth="1.5"
                strokeLinejoin="round"
                animate={{
                  scale: isClicking ? 0.85 : 1,
                }}
                transition={{ duration: 0.15 }}
              />
            </svg>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
