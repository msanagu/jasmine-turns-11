import React, { useState } from 'react';
import { Check, Luggage, Waves, Sparkles, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { BeachItem } from '../types';

export default function PackingSection() {
  const [items, setItems] = useState<BeachItem[]>([
    { id: '1', name: 'Boogie Board 🌊', packed: false, required: false, icon: '🏄‍♀️' },
    { id: '2', name: 'Sunscreen', packed: false, required: true, icon: '🧴' },
    { id: '3', name: 'Warm Jacket or Hoodie for sunset breeze 🌅', packed: false, required: true, icon: '🧥' },
    { id: '4', name: 'Beach Towel', packed: false, required: true, icon: '🧣' },
    { id: '5', name: 'Swimwear', packed: false, required: true, icon: '🩳' },
    { id: '6', name: 'A dry change of clothes', packed: false, required: true, icon: '👕' },
    { id: '7', name: 'Appetite for burgers and s\'mores! 🍔', packed: false, required: true, icon: '🍫' },
  ]);

  const [bagAnimation, setBagAnimation] = useState(false);

  const togglePacked = (id: string) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const updatedPacked = !item.packed;
        if (updatedPacked) {
          // Trigger a cute bounce/pack animation
          setBagAnimation(true);
          setTimeout(() => setBagAnimation(false), 600);
        }
        return { ...item, packed: updatedPacked };
      }
      return item;
    }));
  };

  const packedCount = items.filter(i => i.packed).length;
  const isAllPacked = items.filter(i => i.required).every(i => i.packed);
  const isBoogiePacked = items.find(i => i.id === '1')?.packed;

  return (
    <div className="flex flex-col gap-3">
    <div className="bg-white/90 shadow-2xl border-2 border-[#00B4D8]/25 rounded-[32px] p-6 md:p-8 flex flex-col gap-6 relative rotate-[0.5deg]">
      <div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#CAF0F8] text-[#0077B6] mb-3">
          <Waves className="w-3.5 h-3.5" /> JASMINE'S BEACH PACKER
        </span>
        <h3 className="font-sans font-black text-2xl text-[#1D4E89] tracking-tight leading-none mb-1">
          Are you beach ready?
        </h3>
        <p className="font-sans text-sm text-gray-500">
          Click the recommended beach items below to pack them into your virtual beach bag!
        </p>
      </div>

      <div className="grid md:grid-cols-5 gap-6 items-center">
        {/* Interactive Bag visual display */}
        <div className="md:col-span-2 flex flex-col items-center justify-center p-6 bg-[#CAF0F8]/30 border border-[#00B4D8]/20 rounded-2xl relative overflow-hidden h-64 shadow-inner">
          <motion.div
            animate={bagAnimation ? {
              scale: [1, 1.15, 0.95, 1],
              rotate: [0, -5, 5, 0]
            } : {}}
            transition={{ duration: 0.5 }}
            className="text-7xl mb-4 relative select-none"
          >
            🎒
            <AnimatePresence>
              {isBoogiePacked && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0 }}
                  className="absolute -top-4 -right-4 text-3xl"
                >
                  🏄‍♀️
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <div className="text-center">
            <h4 className="font-sans font-bold text-gray-700 text-sm">Your Beach Bag</h4>
            <p className="font-sans text-xs text-[#0096C7] font-black mt-1 uppercase tracking-wider">
              {packedCount} / {items.length} Packed
            </p>
          </div>

          {/* Packed item icons flowing in */}
          <div className="flex flex-wrap justify-center gap-1 mt-2 min-h-7 px-2">
            <AnimatePresence>
              {items.filter(i => i.packed).map(item => (
                <motion.span
                  key={item.id}
                  initial={{ scale: 0, opacity: 0, y: -10 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                  className="text-lg select-none"
                >
                  {item.icon}
                </motion.span>
              ))}
            </AnimatePresence>
          </div>

          {/* Quick status tip */}
          <div className="absolute bottom-3 left-3 right-3 text-center">
            <AnimatePresence mode="wait">
              {isAllPacked ? (
                <motion.span
                  key="done"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full"
                >
                  <Sparkles className="w-3 h-3" /> Fully Prepared!
                </motion.span>
              ) : (
                <motion.span
                  key="packing"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-[11px] font-bold text-gray-500"
                >
                  Keep packing! Let's hit the waves.
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Packing items interactive list */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.05
              }
            }
          }}
          className="md:col-span-3 flex flex-col gap-2"
        >
          {items.map(item => (
            <motion.button
              key={item.id}
              variants={{
                hidden: { opacity: 0, x: 20 },
                visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 120 } }
              }}
              whileHover={{ scale: 1.015, x: 2 }}
              whileTap={{ scale: 0.985 }}
              onClick={() => togglePacked(item.id)}
              className={`flex items-center justify-between p-3 rounded-xl border text-left cursor-pointer transition-all ${
                item.packed 
                  ? 'bg-[#CAF0F8]/50 border-[#00B4D8] text-[#005F73]' 
                  : 'bg-white/60 hover:bg-white border-gray-200 text-[#1D4E89]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className="text-xl select-none">{item.icon}</span>
                <span className={`font-sans text-sm ${item.packed ? 'line-through opacity-65 font-medium' : ''}`}>
                  {item.name}
                </span>
              </div>
 
              <div className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                item.packed 
                  ? 'bg-[#0096C7] border-[#CAF0F8] text-white scale-110' 
                  : 'border-gray-300 bg-white'
              }`}>
                {item.packed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </div>

    {/* Boogie board reminder — outside card so it has full width */}
    <AnimatePresence>
      {!isBoogiePacked && !isAllPacked && (
        <motion.p
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          className="flex items-center gap-1.5 text-xs font-bold text-[#0096C7] px-2"
        >
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          Don't forget to pack a boogie board if you have one!
        </motion.p>
      )}
    </AnimatePresence>
    </div>
  );
}
