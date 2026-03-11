import React, { useCallback, useEffect, useRef, useState } from "react";
import { REEL_ITEMS, STOP_INDICES, REEL_ASPECT } from "@/utils/constants";
import Image from "next/image";

// ─── Easing ──────────────────────────────────────────────────────────────────

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export function useSlotSound() {
  const playSpinSound = useCallback(() => {
    const ctx = new AudioContext();
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.connect(ctx.destination);

    for (let i = 0; i < 60; i++) {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.connect(g);
      g.connect(gain);
      const t = ctx.currentTime + i * 0.05;
      osc.frequency.setValueAtTime(300 + Math.random() * 200, t);
      g.gain.setValueAtTime(0.2, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
      osc.start(t);
      osc.stop(t + 0.05);
    }

    return () => {
      gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      setTimeout(() => ctx.close(), 300);
    };
  }, []);

  const playWinSound = useCallback(() => {
    const ctx = new AudioContext();
    [523, 659, 784, 1047].forEach((freq, i) => {
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
  }, []);

  return { playSpinSound, playWinSound };
}

// ─── Reel ─────────────────────────────────────────────────────────────────────

interface ReelProps {
  itemSize: number;
  stopIndex: number;
  duration: number;
  isAlmostMiss?: boolean;
  onStop?: () => void;
}

const Reel = React.memo(function Reel({
  itemSize,
  stopIndex,
  duration,
  isAlmostMiss = false,
  onStop,
}: ReelProps) {
  const [offset, setOffset] = useState(0);
  const animRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const stoppedRef = useRef(false);

  const targetOffset = -(stopIndex * itemSize);
  const startOffset = -(REEL_ITEMS.length * itemSize - itemSize);
  const totalDistance = Math.abs(targetOffset - startOffset);
  const almostMissExtra = isAlmostMiss ? itemSize * 0.5 : 0;

  useEffect(() => {
    stoppedRef.current = false;
    startTimeRef.current = null;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / (duration * 1000), 1);

      if (isAlmostMiss && progress > 0.75) {
        const subProgress = (progress - 0.75) / 0.25;
        const overshoot = Math.sin(subProgress * Math.PI) * (itemSize * 0.5);
        const eased = easeOutCubic(Math.min(progress * 1.33, 1));
        setOffset(targetOffset + overshoot);
        setOffset(
          Math.max(
            startOffset + totalDistance * eased + overshoot,
            targetOffset - almostMissExtra,
          ),
        );
      } else {
        setOffset(startOffset + totalDistance * easeOutCubic(progress));
      }

      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        setOffset(targetOffset);
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
    <div style={{ height: itemSize, overflow: "hidden", position: "relative" }}>
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
});

export default Reel;
