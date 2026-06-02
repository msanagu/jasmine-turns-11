import React, { useState } from 'react';
import { MapPin, Navigation, Compass, Info, ExternalLink, Car, Shield, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

// Party location details
const PARTY_LAT = 32.8550;
const PARTY_LNG = -117.2570;

export default function MapSection() {
  const [startAddress, setStartAddress] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  const handleDirectionsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startAddress.trim()) return;
    
    // Open Google Maps directions in a new tab smoothly
    const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(startAddress.trim())}&destination=${PARTY_LAT},${PARTY_LNG}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div id="map-section-card" className="bg-white/95 shadow-2xl border-2 border-[#00B4D8]/25 rounded-[32px] p-6 md:p-8 flex flex-col gap-6 md:gap-8 rotate-[0.5deg]">
      {/* Search & Intro */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-5 pb-2">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#CAF0F8] text-[#0077B6] mb-3">
            <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} /> BEACH FINDER
          </span>
          <h3 className="font-sans font-black text-2xl sm:text-3xl text-[#1D4E89] tracking-tight leading-none mb-1">
            Where is Jasmine's Beach Spot?
          </h3>
          <p className="font-sans text-sm text-gray-500 leading-relaxed">
            La Jolla Shores, San Diego, CA (just north of the boat launch). Double click map to zoom!
          </p>
        </div>

        {/* Dynamic Navigation & Address Search Actions */}
        <div className="flex flex-col sm:flex-row items-stretch gap-2.5 max-w-xl w-full xl:justify-end">
          <form onSubmit={handleDirectionsSubmit} className="flex gap-2 flex-1">
            <input
              id="directions-origin-input"
              type="text"
              placeholder="Enter starting address..."
              value={startAddress}
              onChange={(e) => setStartAddress(e.target.value)}
              className="px-4 py-3 bg-white border-2 border-[#00B4D8]/15 rounded-xl font-sans text-sm focus:outline-hidden focus:border-[#00B4D8] hover:bg-gray-100/30 transition-all text-gray-800 flex-1 shadow-xs"
            />
            <button
              id="get-directions-btn"
              type="submit"
              disabled={!startAddress.trim()}
              className="bg-[#0077B6] hover:bg-[#023E8A] disabled:bg-gray-200 disabled:text-gray-400 disabled:border-gray-200 disabled:cursor-not-allowed disabled:pointer-events-none text-white font-sans text-sm font-bold px-4 rounded-xl cursor-pointer transition-all flex items-center justify-center gap-1.5 shrink-0 hover:scale-[1.02] active:scale-[0.98] shadow-xs"
            >
              <Navigation className="w-4 h-4" /> Directions
            </button>
          </form>

          <a
            id="open-native-maps"
            href="https://maps.app.goo.gl/wr7mCZKs9QFoXswi7"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-1.5 px-5 py-3 bg-[#E0F2FE] hover:bg-[#0077B6] text-[#0077B6] hover:text-white font-sans font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs hover:scale-[1.01] border-2 border-[#00B4D8]/20 text-center"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Launch GPS Map
          </a>
        </div>
      </div>

      {/* Map Display & Tab Panel Arrangement */}
      <div className="w-full flex flex-col gap-4">
        
        {/* Full-Width Interactive Google Maps Embed with custom aesthetic borders */}
        <div className="rounded-[24px] overflow-hidden border-2 border-[#1D4E89]/15 relative shadow-inner h-[380px] w-full bg-[#E5E9F0]">
          {!isLoaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-sky-50/50 z-20 gap-3">
              <div className="w-8 h-8 rounded-full border-4 border-[#00B4D8] border-t-transparent animate-spin" />
              <span className="font-sans text-xs font-semibold text-[#0077B6]/70">Anchoring Map...</span>
            </div>
          )}
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoaded ? 1 : 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1340.0543632468307!2d-117.25752945778848!3d32.85507310575798!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80dc03dbdfa27a85%3A0xe37a933ff22883ef!2sLa%20Jolla%20Shores%20Boat%20Launch%20Area!5e0!3m2!1sen!2sus!4v1717270000000!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Jasmine's Birthday Beach Location"
              onLoad={() => setIsLoaded(true)}
              className="w-full h-full"
            />
          </motion.div>

          {/* Floated beach helper banner */}
          <div className="absolute bottom-3 left-3 right-3 sm:right-auto bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-lg border border-[#00B4D8]/25 z-10 font-sans text-[11px] sm:text-xs font-bold text-gray-700 flex flex-col gap-2 select-none max-w-sm">
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-[#D81B60] shrink-0 animate-bounce" />
              <span>
                <span className="text-[#023E8A] font-black">Setup Spot:</span> Just North of the boat launch area!
              </span>
            </div>
            <div className="h-[1px] bg-[#00B4D8]/15 w-full" />
            <div className="flex items-center gap-2.5">
              <div className="w-4 h-4 rounded-full bg-[#FCE7F3] flex items-center justify-center shrink-0">
                <span className="text-[10px] sm:text-xs leading-none">👋</span>
              </div>
              <span>
                <span className="text-[#8f117c] font-black">Drop-off Spot:</span> The end of Avenida De La Playa
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Prominent Full-Width Parental Guide and Travel Section */}
      <div className="border-t-2 border-[#00B4D8]/15 pt-6 mt-2 flex flex-col gap-5">
        <div className="flex items-center gap-2">
          <h4 className="font-sans font-black text-base sm:text-lg text-[#1D4E89] uppercase tracking-wider">
            🚗 Essential Arrival, Parking & Safety Guide
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Parking Card */}
          <div className="bg-[#CAF0F8]/30 border-2 border-[#00B4D8]/20 rounded-2xl p-5 flex flex-col gap-4 relative overflow-hidden group hover:border-[#0096C7]/50 transition-all shadow-3xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white text-[#0077B6] flex items-center justify-center border border-[#00B4D8]/20 shadow-xs shrink-0 select-none">
                <Car className="w-5 h-5 text-[#0077B6]" />
              </div>
              <div>
                <span className="font-sans font-black text-[9px] text-[#0077B6] uppercase tracking-wide block leading-none">Option 1</span>
                <span className="font-sans font-bold text-sm text-[#023E8A] block mt-0.5">Free Street Parking</span>
              </div>
            </div>
            <p className="font-sans text-xs sm:text-xs text-gray-600 leading-relaxed">
              There is free street parking available along the adjacent residential streets and Camino Del Oro if parents wish to stay and join us for beach activities! Arriving slightly early to secure street parking is highly recommended due to the beautiful weather.
            </p>
          </div>

          {/* Drop-off Card */}
          <div className="bg-[#FAF5FF]/40 border-2 border-[#D81B60]/15 rounded-2xl p-5 flex flex-col gap-4 relative overflow-hidden group hover:border-[#D81B60]/35 transition-all shadow-3xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white text-[#D81B60] flex items-center justify-center border border-[#D81B60]/20 shadow-xs shrink-0 select-none">
                <MapPin className="w-5 h-5 text-[#ca5ab9]" />
              </div>
              <div>
                <span className="font-sans font-black text-[9px] text-[#ca5ab9] uppercase tracking-wide block leading-none">Option 2</span>
                <span className="font-sans font-bold text-sm text-[#8f117c] block mt-0.5">Avenida de la Playa Drop-off</span>
              </div>
            </div>
            <p className="font-sans text-xs sm:text-xs text-gray-600 leading-relaxed">
              Drop-off and pick-up instructions are set for the end of Avenida de la Playa. If dropping off kids, simply park temporarily or pull right up to the end of the street—we will meet you right there and coordinate walking kids safely to the sand spot!
            </p>
          </div>

          {/* Amenities & Security Card */}
          <div className="bg-[#D8F3DC]/35 border-2 border-[#2D6A4F]/25 rounded-2xl p-5 flex flex-col gap-4 relative overflow-hidden group hover:border-[#2D6A4F]/50 transition-all shadow-3xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white text-[#2D6A4F] flex items-center justify-center border border-[#2D6A4F]/20 shadow-xs shrink-0 select-none">
                <Shield className="w-5 h-5 text-[#0e804d]" />
              </div>
              <div>
                <span className="font-sans font-black text-[9px] text-[#0e804d] uppercase tracking-wide block leading-none">Facilities</span>
                <span className="font-sans font-bold text-sm text-[#084736] block mt-0.5">Amenities & Safety</span>
              </div>
            </div>
            <p className="font-sans text-xs sm:text-xs text-gray-600 leading-relaxed">
              Clean restrooms, drinking fountains, and outdoor rinse-off showers are active at Kellogg Park right next to the beach boardwalk. There are also active San Diego lifeguard towers stationed directly beside our boat launch spot to ensure maximum safety.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
