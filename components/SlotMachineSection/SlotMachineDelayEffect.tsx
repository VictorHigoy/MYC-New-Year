import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { REEL_ITEMS } from "@/utils/constants";
import Reel from "./SlotMachineFunctions";

const SpinningPlaceholder = ({ itemSize }: { itemSize: number }) => {
  const [offset, setOffset] = useState(0);
  const animRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const loopLength = REEL_ITEMS.length * itemSize;
  const spinSpeedPx = itemSize * 18;

  useEffect(() => {
    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = (timestamp - startTimeRef.current) / 1000;
      setOffset(-((elapsed * spinSpeedPx) % loopLength));
      animRef.current = requestAnimationFrame(animate);
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
};

const DelayedReel = ({
  delay,
  ...props
}: { delay: number } & React.ComponentProps<typeof Reel>) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  if (!show) return <SpinningPlaceholder itemSize={props.itemSize} />;

  return <Reel {...props} />;
};

export default DelayedReel;
