import React from 'react';
import { motion } from 'motion/react';

export default function BeachGraphics() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
      {/* Background Ornaments from Artistic Flair */}
      <div className="absolute top-[-50px] right-[-50px] w-96 h-96 bg-[#FFD700] rounded-full opacity-25 blur-3xl pointer-events-none" />
      <div className="absolute bottom-20 left-[-100px] w-80 h-80 bg-[#4CC9F0] rounded-full opacity-15 blur-3xl pointer-events-none" />
      
      {/* Decorative palm leaf silhouettes waving gently */}
      <motion.div 
        className="absolute top-[-40px] left-[-40px] w-48 h-48 text-teal-600/10 origin-top-left"
        animate={{ rotate: [-2, 4, -2] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full">
          <path d="M10,10 Q30,15 50,40 Q60,50 70,80 Q50,70 40,50 Q20,30 10,10" />
          <path d="M10,10 Q40,10 65,30 Q80,45 90,75 Q70,60 55,45 Q30,25 10,10" />
          <path d="M10,10 Q15,40 35,65 Q50,80 80,90 Q65,70 50,55 Q30,30 10,10" />
        </svg>
      </motion.div>

      {/* Decorative palm leaf silhouettes in top right */}
      <motion.div 
        className="absolute top-[-20px] right-[-20px] w-64 h-64 text-teal-600/8 origin-top-right scale-x-[-1]"
        animate={{ rotate: [-3, 3, -3] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full">
          <path d="M10,10 Q30,15 50,40 Q60,50 70,80 Q50,70 40,50 Q20,30 10,10" />
          <path d="M10,10 Q40,10 65,30 Q80,45 90,75 Q70,60 55,45 Q30,25 10,10" />
        </svg>
      </motion.div>

      {/* Seamlessly tiling wave footer */}
      <div className="absolute bottom-0 left-0 right-0 h-24 overflow-hidden z-0">
        {/* Layer 1: light wave, moves left */}
        <motion.div
          className="absolute inset-y-0 flex"
          style={{ width: '200%' }}
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
        >
          {[0, 1].map(i => (
            <svg key={i} viewBox="0 0 1440 96" preserveAspectRatio="none"
              className="fill-[#00B4D8]/40 h-full shrink-0"
              style={{ width: '50%' }}>
              <path d="M0,60 C360,28 1080,92 1440,60 L1440,96 L0,96 Z" />
            </svg>
          ))}
        </motion.div>

        {/* Layer 2: dark wave, moves right */}
        <motion.div
          className="absolute inset-y-0 flex"
          style={{ width: '200%' }}
          animate={{ x: ['-50%', '0%'] }}
          transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
        >
          {[0, 1].map(i => (
            <svg key={i} viewBox="0 0 1440 96" preserveAspectRatio="none"
              className="fill-[#0077B6] h-full shrink-0"
              style={{ width: '50%' }}>
              <path d="M0,72 C400,42 1040,90 1440,72 L1440,96 L0,96 Z" />
            </svg>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
