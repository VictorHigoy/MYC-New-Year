"use client";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

const ITEMS = [
  { alt: "Iphone", src: "/images/slotMachineSection/Iphone.svg" },
  { alt: "Angpao", src: "/images/slotMachineSection/Angpao.svg" },
  { alt: "199 Free Spin", src: "/images/slotMachineSection/199FS.svg" },
];

// Each reel strips: repeat items to create the scroll illusion
const REEL_ITEMS = [...ITEMS, ...ITEMS, ...ITEMS, ...ITEMS];

function useSlotSound() {
  const spinRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  const playSpinSound = () => {
    const ctx = new AudioContext();
    spinRef.current = ctx;
    const gain = ctx.createGain();
    gainRef.current = gain;
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.connect(ctx.destination);

    const playClick = (time: number) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.connect(g);
      g.connect(gain);
      osc.frequency.setValueAtTime(300 + Math.random() * 200, time);
      g.gain.setValueAtTime(0.2, time);
      g.gain.exponentialRampToValueAtTime(0.001, time + 0.05);
      osc.start(time);
      osc.stop(time + 0.05);
    };

    for (let i = 0; i < 60; i++) {
      playClick(ctx.currentTime + i * 0.05);
    }

    return () => {
      gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      setTimeout(() => ctx.close(), 300);
    };
  };

  const playWinSound = () => {
    const ctx = new AudioContext();
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = "sine";
      const t = ctx.currentTime + i * 0.15;
      gain.gain.setValueAtTime(0.4, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
      osc.start(t);
      osc.stop(t + 0.4);
    });
  };

  return { playSpinSound, playWinSound };
}

interface ReelProps {
  itemSize: number;
  stopIndex: number;
  duration: number;
  delay: number;
  isAlmostMiss?: boolean;
  onStop?: () => void;
}

function Reel({
  itemSize,
  stopIndex,
  duration,
  delay,
  isAlmostMiss = false,
  onStop,
}: ReelProps) {
  const [offset, setOffset] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const animRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const stoppedRef = useRef(false);

  // Target: land on stopIndex item (from top of REEL_ITEMS)
  // We want the reel to scroll so that stopIndex item is visible
  const targetOffset = -(stopIndex * itemSize);
  // Start offset: high up (scroll many items)
  const startOffset = -(REEL_ITEMS.length * itemSize - itemSize);

  useEffect(() => {
    stoppedRef.current = false;
    setSpinning(true);

    const totalDistance = Math.abs(targetOffset - startOffset);
    const almostMissExtra = isAlmostMiss ? itemSize * 0.85 : 0;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current - delay * 1000;
      if (elapsed < 0) {
        animRef.current = requestAnimationFrame(animate);
        return;
      }

      const progress = Math.min(elapsed / (duration * 1000), 1);

      // Easing: fast start, slow end
      let eased: number;
      if (isAlmostMiss && progress > 0.75) {
        // almost miss: overshoot then snap back
        const subProgress = (progress - 0.75) / 0.25;
        const overshoot = Math.sin(subProgress * Math.PI) * almostMissExtra;
        eased = easeOutCubic(Math.min(progress * 1.33, 1));
        const newOffset = startOffset + totalDistance * eased + overshoot;
        setOffset(Math.max(newOffset, targetOffset - almostMissExtra));
      } else {
        eased = easeOutCubic(progress);
        setOffset(startOffset + totalDistance * eased);
      }

      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        setOffset(targetOffset);
        setSpinning(false);
        if (!stoppedRef.current) {
          stoppedRef.current = true;
          onStop?.();
        }
      }
    };

    animRef.current = requestAnimationFrame(animate);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  return (
    <div
      style={{
        height: itemSize,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        style={{
          transform: `translateY(${offset}px)`,
          willChange: "transform",
        }}
      >
        {REEL_ITEMS.map((item, i) => (
          <div
            key={i}
            style={{
              height: itemSize,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Image
              alt={item.alt}
              width={150}
              height={300}
              src={item.src}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export default function SlotMachineSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [reelHeight, setReelHeight] = useState(300);
  const [spinning, setSpinning] = useState(false);
  const [key, setKey] = useState(0);
  const stoppedCount = useRef(0);
  const { playSpinSound, playWinSound } = useSlotSound();
  const stopSpinSoundRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        const w = containerRef.current.offsetWidth * 0.3;
        setReelHeight(w * (300 / 150));
      }
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  const handleSpin = () => {
    if (spinning) return;
    stoppedCount.current = 0;
    setSpinning(true);
    setKey((k) => k + 1);
    stopSpinSoundRef.current = playSpinSound();
  };

  const handleReelStop = () => {
    stoppedCount.current += 1;
    if (stoppedCount.current === 3) {
      stopSpinSoundRef.current?.();
      playWinSound();
      setSpinning(false);
    }
  };

  // Final stop indices: land on index 2 (Iphone=0, Angpao=1, 199FS=2) for all — jackpot!
  const stopIndices = [2, 5, 8]; // different rows but same image (199FS pattern repeat)

  return (
    <div
      className="bg-no-repeat bg-center relative z-10 bg-cover min-h-screen flex items-center justify-center"
      style={{
        backgroundImage:
          "url('/images/slotMachineSection/slot-machine-bg.svg')",
        backgroundSize: "cover",
      }}
    >
      <Image
        alt="slot machine section top border"
        width={642}
        height={158}
        src="/images/slotMachineSection/slot-machine-top-border.svg"
        className="w-full absolute -top-2 left-0"
      />
      <div className="relative w-[90%] max-w-[800px]">
        <Image
          alt="slot machine"
          width={800}
          height={158}
          src="/images/slotMachineSection/slot-machine.svg"
          className="w-full h-auto relative ml-3"
        />
        <div
          ref={containerRef}
          className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 flex items-center gap-[9%] w-[70%] sm:gap-[8.5%] sm:w-[73%] ml-1.5 sm:ml-1"
        >
          {[0, 1, 2].map((reelIndex) => (
            <div key={reelIndex} className="w-[30%] aspect-[150/300]">
              <Reel
                key={`${key}-${reelIndex}`}
                itemSize={reelHeight}
                stopIndex={stopIndices[reelIndex]}
                duration={reelIndex === 2 ? 3 : 1}
                delay={0}
                isAlmostMiss={reelIndex === 2}
                onStop={handleReelStop}
              />
            </div>
          ))}
        </div>

        {/* Spin button */}
        <button
          onClick={handleSpin}
          disabled={spinning}
          className="absolute -bottom-14 left-1/2 -translate-x-1/2 px-8 py-3 rounded-full font-bold text-white text-lg shadow-lg transition-all"
          style={{
            background: spinning
              ? "linear-gradient(135deg, #888, #555)"
              : "linear-gradient(135deg, #f59e0b, #ef4444)",
            cursor: spinning ? "not-allowed" : "pointer",
            transform: "translateX(-50%)",
          }}
        >
          {spinning ? "Spinning..." : "SPIN"}
        </button>
      </div>
    </div>
  );
}
