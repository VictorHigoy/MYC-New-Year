"use client";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

export default function WinModal({
  setOpenForm,
  setClickSpin,
  setShowModal,
}: {
  setOpenForm: (value: boolean) => void;
  setClickSpin: (value: boolean) => void;
  setShowModal: (value: boolean) => void;
}) {
  const winAudioRef = useRef<HTMLAudioElement | null>(null);
  const [loadedCount, setLoadedCount] = useState(0);
  const totalImages = 2;
  const allLoaded = loadedCount >= totalImages;
  const handleImageLoad = () => setLoadedCount((prev) => prev + 1);

  useEffect(() => {
    if (!allLoaded) return;
    winAudioRef.current = new Audio("/audio/win-sound.mp3");
    winAudioRef.current.play();

    return () => {
      if (winAudioRef.current) {
        winAudioRef.current.pause();
        winAudioRef.current.currentTime = 0;
      }
    };
  }, [allLoaded]);

  return (
    <div className="bg-black/60 fixed top-0 left-0 w-screen z-40 h-screen flex items-center justify-center">
      <div className="max-w-[800px] relative">
        <div className="pop-in">
          <Image
            onLoad={handleImageLoad}
            width={800}
            height={800}
            src="/images/modals/win-modal.png"
            alt="win modal"
            className="win modal"
            style={{ animation: "pulse-scale 2.5s ease-in-out infinite" }}
          />
          <button
            className="h-auto cursor-pointer absolute bottom-[14%] left-1/2 -translate-x-1/2  transition-all"
            style={{ animation: "pulse-scale 2.5s ease-in-out infinite" }}
            onClick={() => {
              setShowModal(false);
              setOpenForm(true);
              setClickSpin(false);
            }}
          >
            <Image
              onLoad={handleImageLoad}
              alt="claim button"
              width={450}
              height={153}
              src="/images/modals/claim-button.png"
              className=""
            />
          </button>
        </div>
      </div>
    </div>
  );
}
