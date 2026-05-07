import type { Variants } from 'framer-motion';

export const EASE_STANDARD: [number, number, number, number] = [0.22, 1, 0.36, 1];
export const viewportOnce = { once: true, margin: '-80px' };

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE_STANDARD, delay },
  }),
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_STANDARD } },
};
