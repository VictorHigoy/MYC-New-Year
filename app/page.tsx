import Header from "@/components/HeroSection/Header";
import HeroSection from "@/components/HeroSection/HeroSection";
import SlotMachineSection from "@/components/SlotMachineSection/SlotMachineSection";

export default function Home() {
  return (
    <div>
      <div className="relative min-h-screen overflow-hidden">
        <Header />
        <HeroSection />
      </div>
      <SlotMachineSection />
    </div>
  );
}
