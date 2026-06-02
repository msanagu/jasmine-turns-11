import React, { useState, useEffect } from 'react';
import { Calendar, Check, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  collection,
  onSnapshot,
  addDoc,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';
import { RSVP } from '../types';


const AVATAR_MAP: Record<RSVP['avatarStyle'], string> = {
  shark: '🦈',
  volleyball: '🏐',
  crab: '🦀',
  sunset: '🌅',
  shell: '🐚',
  umbrella: '🏖️',
  palm: '🌴',
  coral: '🪸',
  waves: '🌊',
  dolphin: '🐬',
  hibiscus: '🌺',
  drink: '🍹',
  swimsuit: '🩱',
  pineapple: '🍍',
};

export default function RsvpSection() {
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [attending, setAttending] = useState(true);
  const [adultCount, setAdultCount] = useState(1);
  const [childCount, setChildCount] = useState(0);
  const [boogieBoardCount, setBoogieBoardCount] = useState(0);
  const [avatar, setAvatar] = useState<RSVP['avatarStyle']>('shark');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'rsvps'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const firestoreRsvps: RSVP[] = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          name: data.name,
          attending: data.attending,
          adultCount: data.adultCount ?? 1,
          childCount: data.childCount ?? 0,
          bringingBoogieBoard: data.bringingBoogieBoard,
          boogieBoardCount: data.boogieBoardCount,
          avatarStyle: data.avatarStyle,
          timestamp: data.timestamp,
          message: data.message,
        };
      });
      setRsvps(firestoreRsvps);
    });
    return () => unsubscribe();
  }, []);

  const handleRsvp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const actualCount = attending ? boogieBoardCount : 0;
    await addDoc(collection(db, 'rsvps'), {
      name: name.trim(),
      attending,
      adultCount: attending ? adultCount : 0,
      childCount: attending ? childCount : 0,
      bringingBoogieBoard: actualCount > 0,
      boogieBoardCount: actualCount,
      avatarStyle: avatar,
      timestamp: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
      message: message.trim() || null,
      createdAt: serverTimestamp(),
    });

    setName('');
    setMessage('');
    setAttending(true);
    setAdultCount(1);
    setChildCount(0);
    setBoogieBoardCount(0);
    setAvatar('shark');
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 4000);
  };

  const displayRsvps = rsvps;

  const totals = {
    attending: displayRsvps.filter(r => r.attending !== false).length,
    regrets: displayRsvps.filter(r => r.attending === false).length,
    adults: displayRsvps.reduce((sum, r) => sum + (r.attending ? (r.adultCount || 0) : 0), 0),
    children: displayRsvps.reduce((sum, r) => sum + (r.attending ? (r.childCount || 0) : 0), 0),
    boogieBoards: displayRsvps.reduce((sum, r) => sum + (r.attending ? (r.boogieBoardCount || 0) : 0), 0),
  };

  return (
    <div className="grid lg:grid-cols-12 gap-8 items-stretch">
      {/* RSVP Form Column */}
      <div className="lg:col-span-12 xl:col-span-5 bg-white/90 shadow-2xl border-2 border-[#00B4D8]/25 rounded-[32px] p-6 md:p-8 flex flex-col gap-6 relative">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#CAF0F8] text-[#0077B6] mb-3">
            <Calendar className="w-3.5 h-3.5" /> RSVP BOARD
          </span>
          <h3 className="font-sans font-black text-2xl text-[#1D4E89] tracking-tight leading-none mb-1">
            {attending ? "Count Me In!" : "Send My Regrets"}
          </h3>
          <p className="font-sans text-xs text-gray-500 mb-3.5">
            {attending 
              ? "Let Jasmine and Mary know if you're coming to the beach birthday bash!" 
              : "Let Jasmine and Mary know you won't be able to make it (leave a sweet note!)."}
          </p>

          {/* Call / Text note */}
          <p className="font-sans text-[11px] text-gray-500 leading-relaxed bg-[#CAF0F8]/30 rounded-2xl p-3.5 border border-[#00B4D8]/15">
            📱 Prefer to RSVP directly, or need to change an existing response? Text Mary at{' '}
            <span className="font-bold text-[#0077B6] whitespace-nowrap">949-291-2504</span>.
          </p>
        </div>

        <form onSubmit={handleRsvp} className="flex flex-col gap-5">
          {/* Are you attending Toggle */}
          <div className="flex flex-col gap-1.5">
            <label className="font-sans font-bold text-xs text-gray-600 block">
              Will you be attending?
            </label>
            <div className="grid grid-cols-2 gap-2 bg-[#CAF0F8]/20 p-1 rounded-xl border border-[#00B4D8]/10">
              <button
                type="button"
                onClick={() => setAttending(true)}
                className={`py-2.5 px-3 rounded-lg font-sans font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  attending 
                    ? 'bg-[#0077B6] text-white shadow-sm font-black' 
                    : 'text-[#1D4E89]/80 hover:bg-white/50'
                }`}
              >
                👍 Yes, Count Me In!
              </button>
              <button
                type="button"
                onClick={() => setAttending(false)}
                className={`py-2.5 px-3 rounded-lg font-sans font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  !attending 
                    ? 'bg-[#D81B60] text-white shadow-sm font-black' 
                    : 'text-[#1D4E89]/80 hover:bg-white/50'
                }`}
              >
                😔 No, Send Regrets
              </button>
            </div>
          </div>

          {/* Headcount — adults & children */}
          {attending && (
            <div className="flex flex-col gap-2 bg-[#CAF0F8]/25 border border-[#00B4D8]/20 p-4 rounded-2xl">
              <span className="font-sans font-black text-xs text-[#0077B6]">How many in your group? 👨‍👩‍👧</span>
              <div className="grid grid-cols-2 gap-3">
                {/* Adults */}
                <div className="flex flex-col gap-1">
                  <span className="font-sans text-[10px] text-gray-500 font-bold uppercase tracking-wide">Adults</span>
                  <div className="flex items-center justify-between bg-white rounded-xl border border-[#00B4D8]/20 px-2 py-1.5">
                    <button type="button" onClick={() => setAdultCount(c => Math.max(0, c - 1))} className="w-6 h-6 rounded-lg bg-[#CAF0F8] text-[#0077B6] font-black text-sm flex items-center justify-center cursor-pointer hover:bg-[#0096C7] hover:text-white transition-all">−</button>
                    <span className="font-mono font-black text-sm text-[#0077B6]">{adultCount}</span>
                    <button type="button" onClick={() => setAdultCount(c => Math.min(10, c + 1))} className="w-6 h-6 rounded-lg bg-[#CAF0F8] text-[#0077B6] font-black text-sm flex items-center justify-center cursor-pointer hover:bg-[#0096C7] hover:text-white transition-all">+</button>
                  </div>
                </div>
                {/* Children */}
                <div className="flex flex-col gap-1">
                  <span className="font-sans text-[10px] text-gray-500 font-bold uppercase tracking-wide">Children</span>
                  <div className="flex items-center justify-between bg-white rounded-xl border border-[#00B4D8]/20 px-2 py-1.5">
                    <button type="button" onClick={() => setChildCount(c => Math.max(0, c - 1))} className="w-6 h-6 rounded-lg bg-[#CAF0F8] text-[#0077B6] font-black text-sm flex items-center justify-center cursor-pointer hover:bg-[#0096C7] hover:text-white transition-all">−</button>
                    <span className="font-mono font-black text-sm text-[#0077B6]">{childCount}</span>
                    <button type="button" onClick={() => setChildCount(c => Math.min(10, c + 1))} className="w-6 h-6 rounded-lg bg-[#CAF0F8] text-[#0077B6] font-black text-sm flex items-center justify-center cursor-pointer hover:bg-[#0096C7] hover:text-white transition-all">+</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Guest Name input */}
          <div className="flex flex-col gap-1.5">
            <label className="font-sans font-bold text-xs text-gray-600 block">
              Guest Name
            </label>
            <input
              type="text"
              placeholder="e.g. Charlie"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full font-sans text-sm p-3 bg-white border-2 border-gray-100 rounded-xl focus:outline-hidden focus:border-[#00B4D8] focus:bg-white transition-all text-[#1D4E89]"
              required
            />
          </div>

          {/* Select Avatar emoji */}
          <div className="flex flex-col gap-1.5">
            <span className="font-sans font-bold text-xs text-gray-600 block">
              Choose your Beach Badge / Icon
            </span>
            <div className="grid grid-cols-7 gap-1.5 bg-[#CAF0F8]/30 p-2 rounded-xl border border-[#00B4D8]/10">
              {Object.entries(AVATAR_MAP).map(([key, emoji]) => (
                <motion.button
                  key={key}
                  type="button"
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  animate={{ scale: avatar === key ? 1.15 : 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  onClick={() => setAvatar(key as RSVP['avatarStyle'])}
                  className={`flex items-center justify-center h-10 rounded-lg text-lg hover:bg-white cursor-pointer transition-all ${
                     avatar === key ? 'bg-white shadow-md border-2 border-[#0096C7]' : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  {emoji}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Guest Message / Wish input */}
          <div className="flex flex-col gap-1.5">
            <label className="font-sans font-bold text-xs text-gray-600 block flex justify-between">
              <span>{attending ? "Message or Wish (Optional)" : "Send a Wish to Jasmine! ✨"}</span>
              <span className="text-[10px] text-gray-400 font-normal">{message.length}/100</span>
            </label>
            <input
              type="text"
              placeholder={attending ? "Leave a short note or birthday wish... ✨" : "Write a warm birthday wish for Jasmine! 🎉"}
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, 100))}
              className="w-full font-sans text-sm p-3 bg-white border-2 border-gray-100 rounded-xl focus:outline-hidden focus:border-[#00B4D8] focus:bg-white transition-all text-[#1D4E89]"
            />
          </div>

          {/* Boogie Board Count Selector */}
          {attending && (
            <div className="flex flex-col gap-2 bg-[#CAF0F8]/25 border border-[#00B4D8]/20 p-4 rounded-2xl">
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-sans font-black text-xs text-[#0077B6] block">
                    Bringing Boogie Boards? 🌊
                  </span>
                  <span className="font-sans text-[10px] text-gray-500 leading-none block mt-0.5">
                    Select how many boards your group can bring!
                  </span>
                </div>
                <span className="text-sm font-mono font-bold text-[#0077B6] bg-white px-2.5 py-0.5 rounded-lg border border-[#00B4D8]/30">
                  {boogieBoardCount} board{boogieBoardCount !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2 mt-1">
                {[0, 1, 2, 3].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setBoogieBoardCount(count)}
                    className={`py-2 px-2.5 rounded-lg font-sans font-bold text-xs cursor-pointer transition-all ${
                      boogieBoardCount === count
                        ? 'bg-[#0096C7] text-white shadow-sm'
                        : 'bg-white hover:bg-[#CAF0F8]/30 text-[#1D4E89] border border-[#00B4D8]/15'
                    }`}
                  >
                    {count === 3 ? '3+ Boards' : count === 0 ? 'None' : `${count} Board`}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Submit button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className={`w-full mt-2 bg-gradient-to-r text-white font-sans font-bold p-3.5 rounded-xl shadow-lg flex items-center justify-center gap-2 cursor-pointer transition-colors ${
              attending 
                ? 'from-[#0096C7] to-[#0077B6] hover:from-[#0077B6] hover:to-[#00B4D8]' 
                : 'from-[#D81B60] to-[#E24E8D] hover:from-[#E24E8D] hover:to-[#D81B60]'
            }`}
          >
            <Send className="w-3.5 h-3.5" /> {attending ? "Save My Spot" : "Send My Regrets"}
          </motion.button>

          <AnimatePresence>
            {isSubmitted && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`border-2 p-3 rounded-xl flex items-center gap-2.5 ${
                  attending 
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-100' 
                    : 'bg-amber-50 text-amber-800 border-amber-100'
                }`}
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-white ${
                  attending ? 'bg-emerald-500' : 'bg-amber-500'
                }`}>
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <div className="font-sans text-xs">
                  {attending ? (
                    <>
                      <strong className="block">Awesome, you're added!</strong>
                      Your RSVP spot is safely secured on the beach blanket quilt!
                    </>
                  ) : (
                    <>
                      <strong className="block">We'll miss you! 😔</strong>
                      Your warm wishes have been sent to Jasmine and Mary.
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </div>

      {/* Guest blanket quilt column */}
      <div className="lg:col-span-12 xl:col-span-7 flex flex-col gap-6 h-full justify-between">
        {/* Beach quilt of guests */}
        <div className="bg-white/95 shadow-2xl border-2 border-[#00B4D8]/25 rounded-[32px] p-6 flex flex-col gap-4 relative z-10 flex-1 min-h-[350px]">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <h4 className="font-sans font-black text-lg text-[#1D4E89] tracking-tight flex items-center gap-2">
              🌞 Attendees Board
            </h4>
            <div className="flex gap-2">
              <span className="font-sans font-mono text-[10px] text-[#0077B6] font-bold bg-[#CAF0F8] px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs">
                {totals.adults + totals.children} Attending
              </span>
              <span className="font-sans font-mono text-[10px] text-[#D81B60] font-bold bg-[#FCE7F3] px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs">
                {totals.regrets} Regrets
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 overflow-y-auto max-h-[360px] pr-1">
            <AnimatePresence initial={false}>
              {displayRsvps.map(rsvp => (
                <motion.div
                  key={rsvp.id}
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className={`rounded-2xl p-3.5 border shadow-xs flex flex-col gap-2 relative group transition-all ${
                    rsvp.attending === false
                      ? 'bg-[#FDF2F8]/40 border-[#D81B60]/15 opacity-85 hover:border-[#D81B60]/30'
                      : 'bg-[#CAF0F8]/15 border-[#00B4D8]/25 hover:border-[#0096C7]'
                  }`}
                >
                  {/* Name row */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <span className="text-2xl select-none shrink-0 mt-0.5">{AVATAR_MAP[rsvp.avatarStyle]}</span>
                      <div className="min-w-0 flex-1">
                        <h5 className={`font-sans font-bold text-sm leading-snug wrap-break-word ${rsvp.attending === false ? 'text-[#B5179E]' : 'text-[#0077B6]'}`}>
                          {rsvp.name}
                        </h5>
                        <span className="font-sans text-[10px] text-gray-400 block mt-0.5">
                          {rsvp.timestamp} {rsvp.attending === false ? '• Sent Regrets' : ''}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Badges row */}
                  {rsvp.attending === false ? (
                    <div>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-sans text-xs bg-[#FCE7F3] text-[#D81B60] font-bold border border-[#D81B60]/15">
                        😔 Regrets
                      </span>
                    </div>
                  ) : ((rsvp.adultCount || 0) > 0 || (rsvp.childCount || 0) > 0 || (rsvp.boogieBoardCount || 0) > 0) && (
                    <div className="flex flex-wrap gap-1.5">
                      {((rsvp.adultCount || 0) > 0 || (rsvp.childCount || 0) > 0) && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-sans text-[10px] bg-[#E0F2FE] text-[#0077B6] font-bold border border-[#00B4D8]/15">
                          {(rsvp.adultCount || 0) > 0 && <>{rsvp.adultCount} adult{(rsvp.adultCount || 0) !== 1 ? 's' : ''}</>}
                          {(rsvp.adultCount || 0) > 0 && (rsvp.childCount || 0) > 0 && <span className="opacity-40">·</span>}
                          {(rsvp.childCount || 0) > 0 && <>{rsvp.childCount} kid{(rsvp.childCount || 0) !== 1 ? 's' : ''}</>}
                        </span>
                      )}
                      {(rsvp.boogieBoardCount || 0) > 0 && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-sans text-[10px] bg-[#CAF0F8] text-[#0077B6] font-bold border border-[#00B4D8]/15">
                          🌊 {rsvp.boogieBoardCount} board{(rsvp.boogieBoardCount || 0) !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                  )}

                  {rsvp.message && (
                    <p className={`font-sans text-xs italic p-2.5 border rounded-xl wrap-break-word leading-relaxed shadow-2xs w-full ${
                      rsvp.attending === false
                        ? 'text-gray-500 bg-white/40 border-[#D81B60]/10'
                        : 'text-gray-600 bg-white/65 border-[#00B4D8]/10'
                    }`}>
                      "{rsvp.message}"
                    </p>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Plans Changed Notice */}
          <div className="mt-2 pt-3 border-t border-[#00B4D8]/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left bg-[#CAF0F8]/10 p-2.5 rounded-xl">
            <div className="font-sans text-[11px] text-gray-500 leading-normal flex items-center gap-2 justify-center sm:justify-start">
              <span className="w-2 h-2 rounded-full bg-[#0077B6] animate-pulse shrink-0"></span>
              <span>
                Plans changed? Text Mary at{' '}
                <a href="sms:9492912504" className="underline font-bold text-[#0077B6] hover:text-[#005F73] inline-block whitespace-nowrap">
                  949-291-2504
                </a>{' '}
                to update!
              </span>
            </div>
            <div className="flex gap-1.5 shrink-0">
              <a
                href="sms:9492912504?body=Hi Mary, I need to update my RSVP status for Jasmine's beach bash."
                className="px-2.5 py-1 bg-white hover:bg-gray-50 border border-[#00B4D8]/20 text-[10px] font-sans font-bold text-[#0077B6] rounded-lg transition-all flex items-center gap-1 shadow-3xs"
              >
                💬 Text Update
              </a>
            </div>
          </div>
        </div>

        {/* Totals Summary */}
        <div className="bg-white border-2 border-[#00B4D8]/25 rounded-4xl p-5 grid grid-cols-5 gap-2 text-center shadow-2xl relative z-10">
          <div>
            <span className="font-sans text-[10px] text-gray-400 uppercase font-black tracking-wider block leading-tight">Groups</span>
            <div className="font-sans font-black text-xl sm:text-2xl text-[#0077B6] mt-1">{totals.attending}</div>
          </div>
          <div>
            <span className="font-sans text-[10px] text-gray-400 uppercase font-black tracking-wider block leading-tight">Regrets</span>
            <div className="font-sans font-black text-xl sm:text-2xl text-[#D81B60] mt-1">{totals.regrets}</div>
          </div>
          <div>
            <span className="font-sans text-[10px] text-gray-400 uppercase font-black tracking-wider block leading-tight">Adults</span>
            <div className="font-sans font-black text-xl sm:text-2xl text-[#023E8A] mt-1">{totals.adults}</div>
          </div>
          <div>
            <span className="font-sans text-[10px] text-gray-400 uppercase font-black tracking-wider block leading-tight">Kids</span>
            <div className="font-sans font-black text-xl sm:text-2xl text-[#0096C7] mt-1">{totals.children}</div>
          </div>
          <div>
            <span className="font-sans text-[10px] text-gray-400 uppercase font-black tracking-wider block leading-tight">Boards</span>
            <div className="font-sans font-black text-xl sm:text-2xl text-[#00B4D8] mt-1">{totals.boogieBoards}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
