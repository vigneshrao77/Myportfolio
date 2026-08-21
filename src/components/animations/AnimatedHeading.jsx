import { motion, useReducedMotion } from 'framer-motion';

export default function AnimatedHeading({ text, as: Tag = 'h2', className = '', trailing = null, ...props }) {
  const shouldReduceMotion = useReducedMotion();
  const words = text.split(' ');

  const container = {
    hidden: {},
    visible: {
      transition: { staggerChildren: shouldReduceMotion ? 0 : 0.08 },
    },
  };

  const word = {
    hidden: { y: shouldReduceMotion ? '0%' : '100%', opacity: 0 },
    visible: {
      y: '0%',
      opacity: 1,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <Tag className={className} {...props}>
      <span style={{ overflow: 'hidden', display: 'inline' }}>
        <motion.span
          style={{ display: 'inline-block' }}
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.6 }}
        >
          {words.map((w, i) => (
            <span key={i} style={{ display: 'inline-block', overflow: 'hidden', marginRight: '0.28em' }}>
              <motion.span style={{ display: 'inline-block' }} variants={word}>
                {w}
              </motion.span>
            </span>
          ))}
        </motion.span>
      </span>
      {trailing}
    </Tag>
  );
}
