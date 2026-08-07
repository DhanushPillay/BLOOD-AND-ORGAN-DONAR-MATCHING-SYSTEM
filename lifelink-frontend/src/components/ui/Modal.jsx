/**
 * @file Modal.jsx
 * @description Re-usable UI overlay modal component with backdrop blur styling and Framer Motion spring physics.
 * @author KrishBansod99
 * @reviewed Reviewed and documented by KrishBansod99 for code maintainability.
 */

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="modal-content glass-strong"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          >
            {title && <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: 20 }}>{title}</h2>}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
