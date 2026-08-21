import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CopyEmail({ email, className = '' }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={className} style={{ position: 'relative', cursor: 'pointer' }} onClick={handleCopy}>
      <span>{email}</span>
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.8 }}
            animate={{ opacity: 1, y: -30, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            style={{
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'var(--text-primary)',
              color: 'var(--bg-primary)',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: '600',
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            Copied!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
