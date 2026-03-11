"use client";
import Image from "next/image";
import React, { useState } from "react";
import { Noto_Sans_SC } from "next/font/google";

const notoSansSC = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["400", "700"],
});

interface FormData {
  username: string;
  password: string;
  phone: string;
}

interface FormErrors {
  username?: string;
  password?: string;
  phone?: string;
}

export default function FormModal({
  setOpenForm,
}: {
  setOpenForm: (value: boolean) => void;
}) {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    password: "",
    phone: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);
  const totalImages = 2; // form-container + registration-button
  const allLoaded = loadedCount >= totalImages;
  const handleImageLoad = () => setLoadedCount((prev) => prev + 1);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.username.trim()) newErrors.username = "Username is required";

    if (!formData.password.trim()) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^\+?[\d\s\-]{7,15}$/.test(formData.phone))
      newErrors.phone = "Enter a valid phone number";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined })); // clear error on change
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      // replace with your API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setOpenForm(false);
      setSubmitted(true);
    } catch (err) {
      console.error("Submission error:", err);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = `${notoSansSC.className} placeholder:text-[#4b4b4b] bg-white px-3 py-3 min-[480px]:py-4 min-[480px]:px-4 text-black text-[14px] md:text-[16px] lg:text-[18px] font-semibold w-full rounded-sm outline-none`;

  return (
    <div className="bg-black/60 fixed top-0 left-0 w-screen z-40 h-screen flex px-5 lg:px-0 items-center justify-center">
      <div className="max-w-[500px] relative">
        <div className="relative pop-in">
          <Image
            onLoad={handleImageLoad}
            width={500}
            height={500}
            src="/images/modals/form-container.png"
            alt="form modal"
            className=""
          />
          <div className="absolute top-[40%] sm:top-[42%] xs:top-[41%] left-1/2 px-10 sm:px-12 -translate-x-1/2 w-full flex flex-col gap-8 xs:gap-10 justify-center">
            {submitted ? (
              <p
                className={`${notoSansSC.className} text-white text-center text-lg font-bold`}
              >
                🎉 Registration Successful!
              </p>
            ) : (
              <>
                <div className="w-full flex flex-col gap-3 sm:gap-4">
                  <div>
                    <input
                      type="text"
                      name="username"
                      placeholder="USERNAME"
                      value={formData.username}
                      onChange={handleChange}
                      className={`${inputClass} ${errors.username ? "ring-2 ring-inset ring-red-500" : ""}`}
                    />
                  </div>
                  <div>
                    <input
                      type="password"
                      name="password"
                      placeholder="PASSWORD"
                      value={formData.password}
                      onChange={handleChange}
                      className={`${inputClass} ${errors.password ? "ring-2 ring-inset ring-red-500" : ""}`}
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="PHONE NUMBER"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`${inputClass} ${errors.phone ? "ring-2 ring-inset ring-red-500" : ""}`}
                    />
                  </div>
                </div>
                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className={`h-auto cursor-pointer animate-bounce transition-all ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {loading ? (
                    <div className="flex justify-center py-4">
                      <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                    </div>
                  ) : (
                    <Image
                      onLoad={handleImageLoad}
                      alt="registration button"
                      width={500}
                      height={153}
                      src="/images/modals/registration-button.png"
                      className=""
                    />
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
