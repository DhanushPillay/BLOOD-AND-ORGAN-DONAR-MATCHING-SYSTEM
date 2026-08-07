import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  in: { 
    opacity: 1, y: 0,
    transition: { duration: 0.3, ease: 'easeOut' }
  },
  out: { 
    opacity: 0, y: -8,
    transition: { duration: 0.2, ease: 'easeIn' }
  },
};

export const PageTransition = ({ children, transitionKey }) => {
  const location = useLocation();
  
  return (
    <motion.div
      key={transitionKey || location.pathname}
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
    >
      {children}
    </motion.div>
  );
};
