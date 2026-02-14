import { motion } from 'framer-motion';
import { HiPhone } from 'react-icons/hi';

export default function MobileCallButton() {
  return (
    <motion.a
      href="tel:01519369664"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1, duration: 0.5 }}
      className="fixed bottom-6 right-6 z-50 lg:hidden flex items-center gap-2 px-5 py-3.5 bg-accent hover:bg-accent-light text-white rounded-full shadow-xl shadow-accent/30 font-semibold text-sm transition-colors"
      aria-label="Call now"
    >
      <HiPhone className="w-5 h-5" />
      <span>Call Now</span>
    </motion.a>
  );
}
