import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Volume2, Music, Waves, Sun } from 'lucide-react';
import { motion } from 'motion/react';

type SoundMode = 'steeldrum' | 'ukulele';

export interface SoundGeneratorHandle {
  startDefault: () => void;
  setMuted: (muted: boolean) => void;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
const SoundGenerator = forwardRef<SoundGeneratorHandle, {}>(function SoundGenerator(_, ref) {
  const [isPlayingWaves, setIsPlayingWaves] = useState(false);
  const [isPlayingAmbience, setIsPlayingAmbience] = useState(false);
  const [activeMode, setActiveMode] = useState<SoundMode>(() =>
    Math.random() < 0.5 ? 'steeldrum' : 'ukulele'
  );
  const [volume, setVolume] = useState(0.25);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const isMutedRef = useRef(false);
  const isPlayingWavesRef = useRef(false);
  const isPlayingAmbienceRef = useRef(false);

  const waveNodeRef = useRef<ScriptProcessorNode | null>(null);
  const waveGainRef = useRef<GainNode | null>(null);
  const waveIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const melodyGainRef = useRef<GainNode | null>(null);
  const ambientIntervalsRef = useRef<ReturnType<typeof setInterval>[]>([]);

  const setPlayingWaves = (v: boolean) => {
    isPlayingWavesRef.current = v;
    setIsPlayingWaves(v);
  };
  const setPlayingAmbience = (v: boolean) => {
    isPlayingAmbienceRef.current = v;
    setIsPlayingAmbience(v);
  };

  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const masterGain = audioCtxRef.current.createGain();
      masterGain.gain.setValueAtTime(isMutedRef.current ? 0 : 1, audioCtxRef.current.currentTime);
      masterGain.connect(audioCtxRef.current.destination);
      masterGainRef.current = masterGain;
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const playWaves = () => {
    try {
      const ctx = getAudioContext();
      const masterGain = masterGainRef.current!;

      const bufferSize = 4096;
      const scriptNode = ctx.createScriptProcessor(bufferSize, 1, 1);

      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      scriptNode.onaudioprocess = (e) => {
        const output = e.outputBuffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          const pink = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
          b6 = white * 0.115926;
          output[i] = pink * 0.11;
        }
      };

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, ctx.currentTime);
      filter.Q.setValueAtTime(1, ctx.currentTime);

      const modulator = () => {
        if (waveGainRef.current === null) return;
        const now = ctx.currentTime;
        filter.frequency.cancelScheduledValues(now);
        filter.frequency.setValueAtTime(filter.frequency.value, now);
        filter.frequency.linearRampToValueAtTime(800, now + 4);
        filter.frequency.linearRampToValueAtTime(300, now + 8.5);
      };

      const modInterval = setInterval(modulator, 8500);
      modulator();

      const waveGain = ctx.createGain();
      waveGain.gain.setValueAtTime(volume * 0.8, ctx.currentTime);

      scriptNode.connect(filter);
      filter.connect(waveGain);
      waveGain.connect(masterGain);

      waveNodeRef.current = scriptNode;
      waveGainRef.current = waveGain;
      waveIntervalRef.current = modInterval;
    } catch (e) {
      console.log('Audio error:', e);
    }
  };

  const stopWaves = () => {
    if (waveNodeRef.current) {
      waveNodeRef.current.disconnect();
      waveNodeRef.current = null;
    }
    if (waveGainRef.current) {
      waveGainRef.current.disconnect();
      waveGainRef.current = null;
    }
    if (waveIntervalRef.current) {
      clearInterval(waveIntervalRef.current);
      waveIntervalRef.current = null;
    }
  };

  const clearAmbientIntervals = () => {
    ambientIntervalsRef.current.forEach(clearInterval);
    ambientIntervalsRef.current = [];
  };

  const playAmbience = (mode: SoundMode) => {
    try {
      const ctx = getAudioContext();
      const masterGain = masterGainRef.current!;
      const melodyGain = ctx.createGain();
      melodyGain.gain.setValueAtTime(volume * 0.5, ctx.currentTime);
      melodyGain.connect(masterGain);
      melodyGainRef.current = melodyGain;

      clearAmbientIntervals();

      if (mode === 'steeldrum') {
        const scale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25];
        let step = 0;
        const melodyNotes = [
          3, 4, 5, 3, 5, 4, 3, 2,
          4, 5, 6, 4, 6, 5, 4, 3,
          5, 5, 7, 6, 5, 3, 4, 2,
          3, 1, 0, 2, 3, 4, 5, 6
        ];

        const interval = setInterval(() => {
          const now = ctx.currentTime;
          const noteIndex = melodyNotes[step % melodyNotes.length];
          const freq = scale[noteIndex];

          const osc = ctx.createOscillator();
          const localGain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);

          localGain.gain.setValueAtTime(0, now);
          localGain.gain.linearRampToValueAtTime(0.3, now + 0.02);
          localGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

          const oscSub = ctx.createOscillator();
          oscSub.type = 'triangle';
          oscSub.frequency.setValueAtTime(freq * 1.51, now);
          const subGain = ctx.createGain();
          subGain.gain.setValueAtTime(0, now);
          subGain.gain.linearRampToValueAtTime(0.08, now + 0.01);
          subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

          osc.connect(localGain);
          oscSub.connect(subGain);
          localGain.connect(melodyGain);
          subGain.connect(melodyGain);

          osc.start(now);
          oscSub.start(now);
          osc.stop(now + 1.2);
          oscSub.stop(now + 0.5);

          step++;
        }, 360);

        ambientIntervalsRef.current.push(interval);

      } else if (mode === 'ukulele') {
        const chords = [
          [392.00, 261.63, 329.63, 440.00],
          [440.00, 261.63, 349.23, 440.00],
          [392.00, 293.66, 392.00, 493.88],
          [440.00, 261.63, 329.63, 440.00],
        ];
        let chordIdx = 0;

        const interval = setInterval(() => {
          const now = ctx.currentTime;
          const currentChord = chords[chordIdx % chords.length];

          currentChord.forEach((freq, stringIdx) => {
            const strumDelay = stringIdx * 0.05;
            const osc = ctx.createOscillator();
            const localGain = ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + strumDelay);

            localGain.gain.setValueAtTime(0, now + strumDelay);
            localGain.gain.linearRampToValueAtTime(0.38, now + strumDelay + 0.015);
            localGain.gain.exponentialRampToValueAtTime(0.0001, now + strumDelay + 1.4);

            osc.connect(localGain);
            localGain.connect(melodyGain);

            osc.start(now + strumDelay);
            osc.stop(now + strumDelay + 1.4);
          });

          chordIdx++;
        }, 1800);

        ambientIntervalsRef.current.push(interval);
      }
    } catch (e) {
      console.log('Audio error:', e);
    }
  };

  const stopAmbience = () => {
    clearAmbientIntervals();
    if (melodyGainRef.current) {
      melodyGainRef.current.disconnect();
      melodyGainRef.current = null;
    }
  };

  useImperativeHandle(ref, () => ({
    startDefault() {
      if (!isPlayingWavesRef.current) {
        playWaves();
        setPlayingWaves(true);
      }
      if (!isPlayingAmbienceRef.current) {
        playAmbience(activeMode);
        setPlayingAmbience(true);
      }
    },
    setMuted(muted: boolean) {
      isMutedRef.current = muted;
      if (masterGainRef.current) {
        masterGainRef.current.gain.setValueAtTime(
          muted ? 0 : 1,
          masterGainRef.current.context.currentTime
        );
      }
    },
  }));

  const toggleWaves = () => {
    if (isPlayingWaves) {
      stopWaves();
      setPlayingWaves(false);
    } else {
      playWaves();
      setPlayingWaves(true);
    }
  };

  const toggleAmbience = () => {
    if (isPlayingAmbience) {
      stopAmbience();
      setPlayingAmbience(false);
    } else {
      playAmbience(activeMode);
      setPlayingAmbience(true);
    }
  };

  const handleModeChange = (mode: SoundMode) => {
    setActiveMode(mode);
    if (isPlayingAmbience) {
      stopAmbience();
      playAmbience(mode);
    }
  };

  useEffect(() => {
    if (waveGainRef.current) {
      waveGainRef.current.gain.linearRampToValueAtTime(volume * 0.8, waveGainRef.current.context.currentTime + 0.1);
    }
    if (melodyGainRef.current) {
      melodyGainRef.current.gain.linearRampToValueAtTime(volume * 0.5, melodyGainRef.current.context.currentTime + 0.1);
    }
  }, [volume]);

  useEffect(() => {
    return () => {
      stopWaves();
      stopAmbience();
    };
  }, []);

  return (
    <div className="bg-white/90 shadow-2xl border-2 border-[#00B4D8]/25 rounded-4xl p-6 max-w-sm mx-auto flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-[#CAF0F8] rounded-xl text-[#0077B6]">
          <Music className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <h4 className="font-sans font-black text-[#1D4E89] text-sm tracking-tight uppercase">Beachside Jukebox</h4>
          <p className="font-sans text-xs text-[#1D4E89]/75">Enable synthesized beach soundscapes!</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={toggleWaves}
          className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold font-sans transition-all cursor-pointer ${
            isPlayingWaves
              ? 'bg-[#CAF0F8] border-[#00B4D8] text-[#005F73] shadow-md font-sans'
              : 'bg-white/60 hover:bg-white border-gray-200 text-[#1D4E89]'
          }`}
        >
          <Waves className={`w-4 h-4 ${isPlayingWaves ? 'animate-bounce' : ''}`} />
          {isPlayingWaves ? 'Mute Waves' : 'Play Waves'}
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={toggleAmbience}
          className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold font-sans transition-all cursor-pointer ${
            isPlayingAmbience
              ? 'bg-[#CAF0F8] border-[#00B4D8] text-[#005F73] shadow-md'
              : 'bg-white/60 hover:bg-white border-gray-200 text-[#1D4E89]'
          }`}
        >
          <Sun className={`w-4 h-4 ${isPlayingAmbience ? 'animate-spin' : ''}`} />
          {isPlayingAmbience ? 'Mute Atmosphere' : 'Play Atmosphere'}
        </motion.button>
      </div>

      <div className="flex flex-col gap-1.5 mt-1">
        <span className="font-sans font-bold text-[10px] uppercase tracking-wider text-gray-500">
          Atmosphere Instrument
        </span>
        <div className="grid grid-cols-2 gap-1.5 bg-[#CAF0F8]/30 p-1.5 rounded-xl border border-[#00B4D8]/10 text-center">
          <button
            type="button"
            onClick={() => handleModeChange('steeldrum')}
            className={`py-1.5 px-1 rounded-lg text-[10px] font-sans font-black transition-all cursor-pointer ${
              activeMode === 'steeldrum'
                ? 'bg-white text-[#005F73] shadow-xs border border-[#00B4D8]/10'
                : 'text-gray-500 opacity-80 hover:opacity-100'
            }`}
          >
            🪘 Steel Drums
          </button>
          <button
            type="button"
            onClick={() => handleModeChange('ukulele')}
            className={`py-1.5 px-1 rounded-lg text-[10px] font-sans font-black transition-all cursor-pointer ${
              activeMode === 'ukulele'
                ? 'bg-white text-[#005F73] shadow-xs border border-[#00B4D8]/10'
                : 'text-gray-500 opacity-80 hover:opacity-100'
            }`}
          >
            🪕 Ukulele
          </button>
        </div>
      </div>

      {(isPlayingWaves || isPlayingAmbience) && (
        <div className="flex items-center gap-3 bg-[#CAF0F8]/30 p-2.5 rounded-xl border border-[#00B4D8]/10">
          <Volume2 className="w-4 h-4 text-[#0077B6]" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full accent-[#00B4D8] h-1.5 bg-gray-200 rounded-lg appearance-auto cursor-pointer"
          />
        </div>
      )}
    </div>
  );
});

export default SoundGenerator;
