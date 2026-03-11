import Image from "next/image";
import React, { useEffect, useState } from "react";

export default function HeroSection({ onUnlock }: { onUnlock: () => void }) {
  return (
    <div
      className="relative bg-no-repeat bg-cover bg-center min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: "url('/images/heroSection/heroSection-bg.svg')",
      }}
    >
      {/* top gradient */}
      <div className="absolute inset-x-0 top-0 h-32 bg-linear-to-b from-black/80 to-transparent pointer-events-none z-10" />
      {/* bottom gradient */}
      <div className="absolute inset-x-0 bottom-0 h-32bg-linear-to-t from-black/80 to-transparent pointer-events-none z-10" />
      <div className="flex flex-col justify-center items-center w-[90%] max-w-[1200px]">
        <Image
          alt="sponsor"
          width={642}
          height={158}
          src="/images/heroSection/logo.svg"
          className="w-[43%] h-auto -mb-2 sm:-mb-4 md:-mb-6 xl:-mb-14"
        />
        <Image
          alt="new year rewards text"
          width={1493}
          height={306}
          src="/images/heroSection/new-year-rewards-text.svg"
          className="w-full h-auto -mb-2 lg:-mb-6"
        />
        <Image
          alt="spin to lock text"
          width={1501}
          height={135}
          src="/images/heroSection/spin-to-lock-text.png"
          className="w-full h-auto"
        />
        <button
          className="w-[45%] h-auto cursor-pointer"
          style={{ animation: "pulse-scale 2.5s ease-in-out infinite" }}
          onClick={onUnlock}
        >
          <Image
            alt="try your luck now button"
            width={676}
            height={153}
            src="/images/heroSection/try-your-luck-now-button.png"
            className="w-full mt-3 lg:mt-6"
          />
        </button>
      </div>
    </div>
  );
}
