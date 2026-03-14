import { motion } from 'framer-motion';
import { HiPhone } from 'react-icons/hi';
import { HiChat } from 'react-icons/hi';

export default function MobileCallButton() {
  return (
    <div className="fixed bottom-6 left-4 z-50 lg:hidden flex flex-col items-start gap-2">
      <motion.a
        href="tel:01519369664"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="flex items-center gap-2 px-5 py-3.5 bg-accent hover:bg-accent-light text-white rounded-full shadow-xl shadow-accent/30 font-semibold text-sm transition-colors"
        aria-label="Call now"
      >
        <HiPhone className="w-5 h-5" />
        <span>Call Now</span>
      </motion.a>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-white/95 backdrop-blur text-gray-700 rounded-full shadow-lg text-xs font-medium border border-gray-200"
      >
        <HiChat className="w-4 h-4 text-accent" />
        <span>Instant quote available via chat</span>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
      </motion.div>
    </div>
  );
}
