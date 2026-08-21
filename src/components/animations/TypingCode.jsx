import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

export default function TypingCode({ code, speed = 12 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const shouldReduceMotion = useReducedMotion();
  const [shown, setShown] = useState('');

  useEffect(() => {
    if (shouldReduceMotion) {
      setShown(code);
      return;
    }
    
    if (!inView) return;
    let i = 0;
    const id = setInterval(() => {
      i += 2;
      setShown(code.slice(0, i));
      if (i >= code.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [inView, code, speed, shouldReduceMotion]);

  return (
    <pre ref={ref} style={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', display: 'inline' }}>
      {shown}
      {!shouldReduceMotion && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, repeatType: 'reverse' }}
          style={{ display: 'inline-block', width: '0.5em', background: 'currentColor' }}
        >
          &nbsp;
        </motion.span>
      )}
    </pre>
  );
}
