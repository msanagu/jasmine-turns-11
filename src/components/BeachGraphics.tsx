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

      {/* Artistic Flair Wave footer layered curves */}
      <div className="absolute bottom-0 left-0 right-0 h-24 overflow-hidden z-0">
        {/* Layer 1 wave (0.5 opacity) */}
        <motion.svg 
          viewBox="0 0 1440 120" 
          className="absolute bottom-0 w-[200%] h-full fill-[#00B4D8] opacity-35"
          animate={{ x: [0, -1440] }}
          transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
        >
          <path d="M0,64L48,64C96,64,192,64,288,58.7C384,53,480,43,576,42.7C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
        </motion.svg>

        {/* Layer 2 wave (full opacity) */}
        <motion.svg 
          viewBox="0 0 1440 120" 
          className="absolute bottom-[-5px] w-[200%] h-full fill-[#0077B6]"
          animate={{ x: [-1440, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        >
          <path d="M0,96L48,85.3C96,75,192,53,288,53.3C384,53,480,75,576,85.3C672,96,768,96,864,85.3C960,75,1056,53,1152,48C1248,43,1344,53,1392,58.7L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
        </motion.svg>
      </div>
    </div>
  );
}
