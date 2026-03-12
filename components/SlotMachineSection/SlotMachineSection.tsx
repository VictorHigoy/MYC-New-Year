"use client";
import Image from "next/image";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { REEL_ITEMS, STOP_INDICES, REEL_ASPECT } from "@/utils/constants";
import Reel from "./SlotMachineFunctions";
import DelayedReel from "./SlotMachineDelayEffect";

export default function SlotMachineSection({
  setSpinning,
  setClickSpin,
  spinning,
}: {
  setSpinning: (value: boolean) => void;
  setClickSpin: (value: boolean) => void;
  spinning: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [reelHeight, setReelHeight] = useState(300);
  const [spinKey, setSpinKey] = useState(0);
  const stoppedCount = useRef(0);
  const isSpinningRef = useRef(false);

  const spinAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    spinAudioRef.current = new Audio("/audio/spin-sound.m4a");
    spinAudioRef.current.loop = false;
  }, []);

  // responsive reel height
  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        const w = containerRef.current.offsetWidth * 0.3;
        setReelHeight(w * REEL_ASPECT);
      }
    };
    updateHeight();
    const ro = new ResizeObserver(updateHeight);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const handleReelStop = useCallback(() => {
    stoppedCount.current += 1;
    if (stoppedCount.current === 3) {
      if (spinAudioRef.current) {
        spinAudioRef.current.pause();
        spinAudioRef.current.currentTime = 0;
      }
      setSpinning(false);
      isSpinningRef.current = false;
    }
  }, []);

  const handleSpin = useCallback(() => {
    if (spinning || isSpinningRef.current) return;
    isSpinningRef.current = true;
    stoppedCount.current = 0;
    setSpinning(true);
    setClickSpin(true);
    setSpinKey((k) => k + 1);

    // play spin sound
    if (spinAudioRef.current) {
      spinAudioRef.current.currentTime = 0;
      spinAudioRef.current.play();
    }
  }, [spinning]);

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
      />{" "}
      <Image
        alt="dice 1"
        width={286}
        height={258}
        src="/images/slotMachineSection/dice-1.svg"
        className="w-[150px] lg:w-[200px] 2xl:w-[286px] absolute -top-15 2xl:w-[286px]-top-30 left-5 2xl:left-20"
      />
      <Image
        alt="dice 2"
        width={306}
        height={227}
        src="/images/slotMachineSection/dice-2.svg"
        className="w-[150px] lg:w-[200px] 2xl:w-[306px] absolute bottom-0 2xl:-bottom-20 right-5 2xl:right-20"
      />
      <div className="relative w-[90%] max-w-[800px]">
        <Image
          alt="slot machine"
          width={800}
          height={158}
          src="/images/slotMachineSection/slot-machine.svg"
          className="w-full h-auto relative ml-3"
        />
        <Image
          alt="chip 1"
          width={230}
          height={312}
          src="/images/slotMachineSection/chip-1.svg"
          className="w-[120px] xs:w-[150px] lg:w-[170px] xl:w-[230px] absolute -top-35 lg:top-[-40%] xl:top-[-20%] right-0 lg:left-[90%] xl:left-full"
        />
        <Image
          alt="chip 2"
          width={300}
          height={295}
          src="/images/slotMachineSection/chip-2.svg"
          className="w-[120px] xs:w-[150px] lg:w-[170px] xl:w-[300px] absolute -left-10 lg:-left-30 xl:left-[-30%] -bottom-25 xs:-bottom-20 xl:bottom-[-55%]"
        />
        {/* Reels */}
        <div
          ref={containerRef}
          className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 flex items-center gap-[9%] w-[69%] sm:gap-[8.5%] ml-1.5 sm:ml-1"
        >
          {STOP_INDICES.map((stopIndex, reelIndex) => (
            <div key={reelIndex} className="w-[30%] aspect-[150/300]">
              <DelayedReel
                key={`${spinKey}-${reelIndex}`}
                delay={1500} // all spin freely for 3s first
                itemSize={reelHeight}
                stopIndex={stopIndex}
                duration={reelIndex === 1 ? 3 : reelIndex === 2 ? 5 : 7}
                isAlmostMiss={false}
                onStop={handleReelStop}
              />
            </div>
          ))}
        </div>

        {/* Spin Button */}
        <button
          onClick={handleSpin}
          disabled={spinning}
          className={`absolute left-1/2 w-[60%] ml-2 -translate-x-1/2 top-[93%] transition-all select-none
            ${spinning ? "opacity-50 cursor-not-allowed pointer-events-none" : "cursor-pointer"}`}
          style={{ animation: "pulse-scale 1s ease-in-out infinite" }}
        >
          <div className="relative">
            <Image
              alt="spin now button"
              width={690}
              height={153}
              src="/images/slotMachineSection/spin-now-button.png"
              className={`w-full h-auto ${spinning ? "brightness-50" : ""}`}
            />
            {spinning && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              </div>
            )}
          </div>
        </button>
      </div>
    </div>
  );
}
