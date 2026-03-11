"use client";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/HeroSection/Header";
import HeroSection from "@/components/HeroSection/HeroSection";
import FormModal from "@/components/Modals/FormModal";
import WinModal from "@/components/Modals/WinModal";
import SlotMachineSection from "@/components/SlotMachineSection/SlotMachineSection";
import { useEffect, useState } from "react";

export default function Home() {
  const [clickSpin, setClickSpin] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [openForm, setOpenForm] = useState(false);

  const [unlocked, setUnlocked] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("unlocked") === "true"; // ✅ read on init
  });

  useEffect(() => {
    if (!unlocked) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [unlocked]);

  const handleUnlock = () => {
    setUnlocked(true);
    localStorage.setItem("unlocked", "true");
    setTimeout(() => {
      document
        .getElementById("slot-machine-section")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  console.log("openForm", openForm);
  useEffect(() => {
    if (clickSpin && !spinning) {
      const timer = setTimeout(() => {
        setShowModal(true);
      }, 1000); // 1 second delay
      return () => clearTimeout(timer);
    }
  }, [clickSpin, spinning, openForm]);

  return (
    <div>
      <div className="relative min-h-screen overflow-hidden">
        <Header />
        <HeroSection onUnlock={handleUnlock} />
      </div>

      <div id="slot-machine-section">
        <SlotMachineSection
          setClickSpin={setClickSpin}
          spinning={spinning}
          setSpinning={setSpinning}
        />
      </div>

      {showModal && (
        <WinModal
          setOpenForm={setOpenForm}
          setClickSpin={setClickSpin}
          setShowModal={setShowModal}
        />
      )}
      {openForm && <FormModal setOpenForm={setOpenForm} />}
      <Footer />
    </div>
  );
}
