import { motion, useScroll, useReducedMotion } from "framer-motion";

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) return null;

  return (
    <motion.div
      style={{
        scaleX: scrollYProgress,
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "2px",
        originX: 0,
        backgroundColor: "var(--accent-primary)",
        zIndex: 10000,
        boxShadow: "0 0 10px var(--accent-primary)"
      }}
    />
  );
}
