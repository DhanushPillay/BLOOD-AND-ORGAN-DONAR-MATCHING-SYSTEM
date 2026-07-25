import { motion } from 'framer-motion';

export const Skeleton = ({ width, height, borderRadius, style, className }) => {
  return (
    <motion.div
      className={`skeleton-loader ${className || ''}`}
      style={{
        width,
        height,
        borderRadius: borderRadius || 'var(--radius-sm)',
        background: 'linear-gradient(90deg, rgba(0,0,0,0.03) 25%, rgba(0,0,0,0.08) 50%, rgba(0,0,0,0.03) 75%)',
        backgroundSize: '200% 100%',
        ...style,
      }}
      animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
    />
  );
};

export const DonorCardSkeleton = () => {
  return (
    <div className="donor-card glass" style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '24px', borderRadius: 'var(--radius-sm)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Skeleton width="48px" height="48px" borderRadius="50%" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Skeleton width="140px" height="18px" />
          <Skeleton width="100px" height="14px" />
        </div>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
        <Skeleton width="100%" height="24px" />
      </div>
      
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
        <Skeleton width="100%" height="40px" borderRadius="var(--radius-sm)" />
      </div>
    </div>
  );
};
