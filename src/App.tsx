import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Phone, 
  Flame, 
  Waves, 
  Compass, 
  Sun, 
  MessageSquare, 
  Heart, 
  Award, 
  Share2, 
  ArrowRight,
  Info,
  Gift
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import BeachGraphics from './components/BeachGraphics';
import SoundGenerator from './components/SoundGenerator';
import PackingSection from './components/PackingSection';
import RsvpSection from './components/RsvpSection';
import MapSection from './components/MapSection';
import beachBanner from './assets/images/beach_birthday_banner_1780339169461.png';

// Targeted countdown date: Friday, June 12, 2026, 12:00 PM Pacific Standard Time (or -07:00 PDT)
const TARGET_BIRTHDAY = new Date('2026-06-12T12:00:00-07:00').getTime();

export default function App() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isOver: false
  });

  useEffect(() => {
    const calculateCountdown = () => {
      const now = new Date().getTime();
      const difference = TARGET_BIRTHDAY - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isOver: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isOver: false });
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Jasmine's 11th Beach Birthday Bash Invite! 🎉",
        text: "Join us for a beach birthday bash on Friday, June 12th at La Jolla Shores (just north of the boat launch)!",
        url: window.location.href,
      }).catch(console.error);
    } else {
      // Fallback
      navigator.clipboard.writeText(window.location.href);
      alert("Invitation link copied to clipboard! Share it with your friends.");
    }
  };

  // Google Calendar integration template link
  const calendarLink = "https://www.google.com/calendar/render?action=TEMPLATE&text=Jasmine's+Beach+Birthday+Bash+🎉&dates=20260612T190000Z/20260613T030000Z&details=Join+us+for+a+beach+birthday+bash!+Jasmine+turns+11+🎉++Bring+boogie+boards+if+you+have+them+🌊.+Contact+Mary+to+RSVP+949-291-2504&location=La+Jolla+Shores+Beach,+just+north+of+the+boat+launch,+La+Jolla,+CA+92037";

  return (
    <div id="jasmine_landing_page" className="min-h-screen bg-[#FDF6E3] text-[#1D4E89] relative flex flex-col justify-between overflow-x-hidden pb-16 font-sans">
      {/* Decorative background vectors */}
      <BeachGraphics />

      {/* Floating Header */}
      <header className="sticky top-0 z-50 bg-[#FDF6E3]/80 backdrop-blur-md border-b border-[#1D4E89]/10">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🏄‍♀️</span>
            <span className="font-sans font-black tracking-wider text-[#0077B6] text-sm uppercase">Jasmine turns 11!</span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="tel:9492912504"
              className="px-4 py-1.5 bg-[#0096C7] hover:bg-[#00b4d8] text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5" /> Contact Mary
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 md:px-8 py-8 relative z-10 w-full flex flex-col gap-12">
        
        {/* Hero Area / Polaroid Header */}
        <section className="grid lg:grid-cols-12 gap-8 items-center lg:py-4">
          
          {/* Polaroid Image Box with rotating 11 Old Badge */}
          <div className="lg:col-span-6 flex justify-center relative">
            <motion.div 
              style={{ rotate: '-2deg' }}
              whileHover={{ rotate: '1deg', scale: 1.02 }}
              className="bg-white p-4 pb-12 rounded-2xl border border-gray-200 shadow-2xl max-w-md w-full relative z-10"
            >
              {/* Pushpin decor */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-2xl drop-shadow-sm select-none z-10">📍</div>

              {/* Overlapping sticker/badge from the theme */}
              <div className="absolute -top-8 -right-8 w-28 h-28 bg-[#0096C7] rounded-full flex items-center justify-center rotate-12 shadow-xl border-4 border-white z-20">
                <p className="text-white font-black text-center leading-none font-sans">
                   <span className="text-4xl">11</span><br />
                  <span className="text-[10px] uppercase tracking-widest">Years Old</span>
                </p>
              </div>

              <div className="rounded-xl overflow-hidden bg-orange-50 border border-gray-100 aspect-video relative">
                <img 
                  src={beachBanner} 
                  alt="Beach party illustration banner" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Bottom polaroid print text */}
              <div className="mt-5 text-center flex flex-col items-center">
                <span className="font-sans font-mono tracking-widest text-[#0077B6] font-bold text-xs uppercase">Jasmine's 11th Bash</span>
                <span className="font-serif italic text-2xl text-[#023E8A] mt-1">Sun, Surf & S'mores! 🤙</span>
              </div>
            </motion.div>
          </div>

          {/* Invitation quick summary text & countdown */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.15,
                  delayChildren: 0.1
                }
              }
            }}
            className="lg:col-span-6 flex flex-col gap-6"
          >
            <div className="flex flex-col gap-2">
              <motion.span 
                variants={{
                  hidden: { opacity: 0, y: 15 },
                  visible: { opacity: 0.7, y: 0, transition: { duration: 0.6 } }
                }}
                className="text-lg md:text-xl tracking-[0.3em] font-light uppercase block text-[#1D4E89]"
              >
                You're Invited
              </motion.span>
              
              <h1 className="font-sans font-black text-6xl md:text-8xl tracking-tighter leading-none italic uppercase flex flex-col overflow-hidden">
                <motion.span 
                  variants={{
                    hidden: { opacity: 0, x: -50 },
                    visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100 } }
                  }}
                  className="text-[#0077B6]"
                >
                  Beach
                </motion.span>
                <motion.span 
                  variants={{
                    hidden: { opacity: 0, x: -50 },
                    visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100 } }
                  }}
                  className="ml-8 md:ml-12 text-[#00B4D8]"
                >
                  Birthday
                </motion.span>
                <motion.span 
                  variants={{
                    hidden: { opacity: 0, x: -50 },
                    visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100 } }
                  }}
                  className="ml-16 md:ml-24 text-[#1D4E89]"
                >
                  Bash
                </motion.span>
              </h1>
              
              <motion.p 
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
                }}
                className="font-sans text-gray-600 text-base sm:text-lg lg:text-xl mt-6 lg:mt-8 leading-relaxed lg:leading-relaxed antialiased"
              >
                Jasmine is turning <strong>11</strong> 🎉! We're celebrating with a sunny afternoon filled with splashing waves, beach games, burger grilling, and melting s'mores at sunset. Bring your boogie boards and join our beach squad directly next to the waves!
              </motion.p>
            </div>

            {/* Countdown widget */}
            <motion.div 
              variants={{
                hidden: { opacity: 0, scale: 0.95, y: 20 },
                visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 15 } }
              }}
              className="bg-white/90 backdrop-blur-md rounded-3xl p-6 border-2 border-[#1D4E89]/10 shadow-2xl flex flex-col gap-4 max-w-md"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <h4 className="font-sans font-bold text-xs text-gray-400 tracking-widest uppercase">Countdown to Bash</h4>
                {timeLeft.isOver ? (
                  <span className="text-xs text-teal-600 font-bold uppercase tracking-wider">Party is live! 🌴</span>
                ) : (
                  <span className="text-xs text-[#0077B6] font-bold uppercase tracking-wider">June 12th is close! 🌊</span>
                )}
              </div>

              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="bg-[#CAF0F8]/40 p-2.5 rounded-xl border border-[#00B4D8]/10">
                  <span className="block font-sans font-black text-2xl md:text-3xl text-[#0077B6]">{timeLeft.days}</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Days</span>
                </div>
                <div className="bg-[#CAF0F8]/40 p-2.5 rounded-xl border border-[#00B4D8]/10">
                  <span className="block font-sans font-black text-2xl md:text-3xl text-[#0077B6]">{timeLeft.hours}</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Hours</span>
                </div>
                <div className="bg-[#CAF0F8]/40 p-2.5 rounded-xl border border-[#00B4D8]/10">
                  <span className="block font-sans font-black text-2xl md:text-3xl text-[#0096C7]">{timeLeft.minutes}</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Mins</span>
                </div>
                <div className="bg-[#CAF0F8]/40 p-2.5 rounded-xl border border-[#00B4D8]/10">
                  <span className="block font-sans font-black text-2xl md:text-3xl text-[#00B4B8]">{timeLeft.seconds}</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">Secs</span>
                </div>
              </div>
            </motion.div>
          </motion.div>

        </section>

        {/* Quick Location & Details Cards in Artistic Flair style with fun rotates */}
        <motion.section 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.12
              }
            }
          }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
        >
          
          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 30, scale: 0.95 },
              visible: { 
                opacity: 1, 
                y: 0, 
                scale: 1,
                transition: { type: "spring", stiffness: 100, damping: 15 }
              }
            }}
            whileHover={{ y: -8, scale: 1.03, rotate: -2, boxShadow: "0 20px 25px -5px rgba(0, 119, 182, 0.1)" }}
            className="bg-white p-5 sm:p-6 rounded-2xl shadow-xl border border-gray-100/80 flex flex-col justify-between"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#00B4D8] rounded-xl flex-shrink-0 flex items-center justify-center text-white text-xl font-bold shadow-md rotate-3">
                12
              </div>
              <div className="flex-1 min-w-0">
                <h5 className="font-sans font-bold text-xs text-[#0077B6] uppercase tracking-widest leading-none">Friday • June</h5>
                <p className="font-serif italic text-lg sm:text-xl md:text-2xl lg:text-lg xl:text-2xl text-[#023E8A] mt-1.5 font-bold leading-tight tracking-tight break-words">12:00 PM — Sunset</p>
                <p className="font-sans text-xs sm:text-sm text-gray-500 mt-1">Burgers & s'mores on campfire</p>
              </div>
            </div>
            <a 
              href={calendarLink}
              target="_blank" 
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1 font-sans text-xs sm:text-sm text-[#0077B6] font-bold mt-5 hover:underline w-fit"
            >
              Add to Calendar <ArrowRight className="w-3.5 h-3.5 animate-pulse" />
            </a>
          </motion.div>

          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 30, scale: 0.95 },
              visible: { 
                opacity: 1, 
                y: 0, 
                scale: 1,
                transition: { type: "spring", stiffness: 100, damping: 15 }
              }
            }}
            whileHover={{ y: -8, scale: 1.03, rotate: 2, boxShadow: "0 20px 25px -5px rgba(2, 62, 138, 0.1)" }}
            className="bg-white p-5 sm:p-6 rounded-2xl shadow-xl border border-gray-100/80 flex flex-col justify-between"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#023E8A] rounded-xl flex-shrink-0 flex items-center justify-center text-white text-xl font-bold shadow-md rotate-[-2deg]">
                📍
              </div>
              <div className="flex-1 min-w-0">
                <h5 className="font-sans font-bold text-xs text-[#0077B6] uppercase tracking-widest leading-none">The Spot</h5>
                <p className="font-serif italic text-lg sm:text-xl md:text-2xl lg:text-lg xl:text-2xl text-[#023E8A] mt-1.5 font-bold leading-tight tracking-tight break-words">La Jolla Shores</p>
                <p className="font-sans text-xs sm:text-sm text-gray-500 mt-1">Just North of Launch Area</p>
              </div>
            </div>
            <a 
              href="#beach_map_block"
              className="inline-flex items-center gap-1 font-sans text-xs sm:text-sm text-[#0077B6] font-bold mt-5 hover:underline w-fit"
            >
              Show Local Map <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </motion.div>

          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 30, scale: 0.95 },
              visible: { 
                opacity: 1, 
                y: 0, 
                scale: 1,
                transition: { type: "spring", stiffness: 100, damping: 15 }
              }
            }}
            whileHover={{ y: -8, scale: 1.03, rotate: -1, boxShadow: "0 20px 25px -5px rgba(0, 150, 199, 0.1)" }}
            className="bg-white p-5 sm:p-6 rounded-2xl shadow-xl border border-gray-100/80 flex flex-col justify-between"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#0077B6] rounded-xl flex-shrink-0 flex items-center justify-center text-white text-xl font-bold shadow-md rotate-3">
                ☎️
              </div>
              <div className="flex-1 min-w-0">
                <h5 className="font-sans font-bold text-xs text-[#0077B6] uppercase tracking-widest leading-none">RSVP to Mary</h5>
                <p className="font-serif italic text-lg sm:text-xl md:text-2xl lg:text-lg xl:text-2xl text-[#023E8A] mt-1.5 font-bold leading-tight tracking-tight break-words">949.291.2504</p>
                <p className="font-sans text-xs sm:text-sm text-gray-500 mt-1">Contact Mary anytime</p>
              </div>
            </div>
            <div className="flex gap-2.5 mt-5">
              <a 
                href="tel:9492912504"
                className="font-sans text-xs sm:text-sm text-[#0077B6] font-bold hover:underline"
              >
                Call
              </a>
              <span className="text-gray-300">|</span>
              <a 
                href="sms:9492912504?body=Hi Mary, I would love to RSVP for Jasmine's beach bash!"
                className="font-sans text-xs sm:text-sm text-[#0077B6] font-bold hover:underline"
              >
                Text
              </a>
            </div>
          </motion.div>

          <motion.div 
            variants={{
              hidden: { opacity: 0, y: 30, scale: 0.95 },
              visible: { 
                opacity: 1, 
                y: 0, 
                scale: 1,
                transition: { type: "spring", stiffness: 100, damping: 15 }
              }
            }}
            whileHover={{ y: -8, scale: 1.03, rotate: 3, boxShadow: "0 20px 25px -5px rgba(255, 215, 0, 0.15)" }}
            className="bg-white p-5 sm:p-6 rounded-2xl shadow-xl border border-gray-100/80 flex flex-col justify-between"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-[#FFD700] rounded-xl flex-shrink-0 flex items-center justify-center text-gray-800 text-xl font-bold shadow-md rotate-[-3deg]">
                🌊
              </div>
              <div className="flex-1 min-w-0">
                <h5 className="font-sans font-bold text-xs text-[#0077B6] uppercase tracking-widest leading-none">Essential Bag</h5>
                <p className="font-serif italic text-lg sm:text-xl md:text-2xl lg:text-lg xl:text-2xl text-[#023E8A] mt-1.5 font-bold leading-tight tracking-tight break-words">Swim & Warmth</p>
                <p className="font-sans text-xs sm:text-sm text-gray-500 mt-1">Swimwear, jacket & towel</p>
              </div>
            </div>
            <a 
              href="#beach_packer_section"
              className="inline-flex items-center gap-1 font-sans text-xs sm:text-sm text-[#0077B6] font-bold mt-5 hover:underline w-fit"
            >
              Interactive Bag <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </motion.div>

        </motion.section>

        {/* Dynamic Interactive Features & Beach Sounds */}
        <section className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Packaging check lists / board */}
          <div id="beach_packer_section" className="lg:col-span-8">
            <PackingSection />
          </div>

          {/* synthesized sound engine box */}
          <div className="lg:col-span-4 h-full flex flex-col justify-between">
            <div className="flex flex-col gap-6 h-full">
              <SoundGenerator />
              
              {/* Note card styling matching Artistic Flair */}
              <div className="bg-white p-6 rounded-[32px] border-2 border-[#00B4D8]/25 flex-1 flex flex-col gap-3 relative shadow-2xl rotate-[-1deg]">
                <div className="absolute -top-3 -right-3 w-10 h-10 bg-[#fff7ca] rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-xl">🤙</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Award className="text-[#0077B6] w-5 h-5" />
                  <span className="font-sans font-black tracking-wider text-[#0077B6] text-sm uppercase">We've got you covered!</span>
                </div>
                <p className="font-sans text-sm sm:text-base text-gray-600 leading-relaxed tracking-wide italic">
                  We can't wait to play in the sand, ride the ocean waves on our boogie boards, and end the day with hot melting s'mores from our Coleman camp stove while watching a beautiful San Diego sunset! Burgers, buns, condiments, snacks, beverages, s'mores, and cooking skewers are fully covered by us. See you on Friday!
                </p>
              </div>
            </div>
          </div>

        </section>

        {/* Gift Wishlist Station Card */}
        <section id="gift_wishlist_section">
          <div className="bg-gradient-to-r from-[#CAF0F8] to-[#E0F2FE] shadow-2xl border-2 border-[#00B4D8]/30 rounded-[32px] p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-8 rotate-[-0.5deg]">
            <div className="w-16 h-16 bg-[#0096C7] rounded-2xl flex-shrink-0 flex items-center justify-center text-white text-3xl shadow-lg rotate-[-3deg]">
              🎁
            </div>
            <div className="flex-1 text-center md:text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-white text-[#0077B6] border-2 border-[#00B4D8]/30 mb-2 uppercase tracking-wide shadow-xs">
                Wishlist Station • Send with Love
              </span>
              <h3 className="font-sans font-black text-2xl text-[#1D4E89] tracking-tight leading-none mb-2">
                Jasmine's 11th Birthday Wishlist
              </h3>
              <p className="font-sans text-xs md:text-sm text-gray-600 leading-relaxed">
                If you feel inclined to send a birthday gift, they can be ordered online and delivered straight to Jasmine's home! This saves you the worry of protecting beautifully wrapped gifts from the fine beach sand or lugging packages across the shore. No gifts are expected physically at the beach—your joyous company is our biggest treat!
              </p>
            </div>
            <div className="shrink-0 w-full md:w-auto text-center">
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="https://www.amazon.com/hz/wishlist/ls/3U2J5IOQ0QIY8?ref_=wl_share"
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-[#0096C7] to-[#0077B6] hover:from-[#0077B6] hover:to-[#00B4D8] text-white font-sans font-black rounded-2xl shadow-xl text-xs uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap"
              >
                View Wishlist 🛍️
              </motion.a>
            </div>
          </div>
        </section>

        {/* RSVP System Blanket */}
        <section id="rsvp_board_section">
          <RsvpSection />
        </section>

        {/* Map, Travel Guidelines & Parking Advice */}
        <section id="beach_map_block">
          <MapSection />
        </section>

      </main>

      {/* Styled Footer */}
      <footer className="mt-12 bg-[#FDF6E3] border-t border-[#1D4E89]/10 py-8 text-center text-xs text-gray-500 relative z-30 select-none">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-center gap-1.5 font-sans font-medium text-gray-500">
          <span>Crafted with</span>
          <Heart className="w-3.5 h-3.5 text-[#0077B6] fill-[#0077B6]" />
          <span>for Jasmine's 11th Beach Birthday Bash by Mama Sanagu.</span>
        </div>
      </footer>
    </div>
  );
}
