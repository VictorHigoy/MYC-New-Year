import Image from "next/image";
import React from "react";

export default function Footer() {
  return (
    <div
      className="relative -mt-3 min-[1394px]:mt-0 bg-no-repeat bg-cover z-10 bg-top flex items-center justify-center px-3 py-8 sm:py-10"
      style={{
        backgroundImage: "url('/images/footer/footer-bg.svg')",
      }}
    >
      <Image
        width={1000}
        height={50}
        src={"/images/footer/footer-line.svg"}
        alt="footer line"
        className="w-full absolute -top-0 left-0"
      />
      <div className="flex flex-col justify-center gap-5">
        <Image
          width={1000}
          height={50}
          src={"/images/footer/footer-text.png"}
          alt="footer header text"
        />
        <Image
          width={1000}
          height={50}
          src={"/images/footer/sponsors.svg"}
          alt="sponsors"
          className="px-5 sm:px-18"
        />
      </div>
    </div>
  );
}
