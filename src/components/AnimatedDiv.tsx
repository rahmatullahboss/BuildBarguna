// src/components/AnimatedDiv.tsx
"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

type AnimatedDivProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

export function AnimatedDiv({ children, className, delay = 0 }: AnimatedDivProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      transition={{ duration: 0.5, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
