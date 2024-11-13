"use client"; // Enable client-side rendering

import React, { useState } from "react";
import Link from "next/link";
import styles from "../../styles/Logo.module.css"; // Importing the CSS module

const randomContent = [
  {
    title: "Impressive Animation #1",
    description: "This is a cool animation that changes with every click!",
  },
  {
    title: "Surprise #2",
    description: "Watch out for a new surprise every time you click Taha!",
  },
  {
    title: "Interactive Fun #3",
    description:
      "Interact with this awesome popup and see something unique each time!",
  },
  {
    title: "Amazing Effect #4",
    description:
      "The effect you see here is randomly selected. Amazing, right?",
  },
];

const randomEffects = ["scale-110", "rotate-3", "opacity-80", "scale-90"];

export const Logo = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContentIndex, setModalContentIndex] = useState(0);
  const [randomEffectIndex, setRandomEffectIndex] = useState(0);
  const [isFireworksVisible, setIsFireworksVisible] = useState(false);

  const handleTahaClick = () => {
    setModalContentIndex((prevIndex) => (prevIndex + 1) % randomContent.length);
    setRandomEffectIndex((prevIndex) => (prevIndex + 1) % randomEffects.length);

    setIsModalOpen(true);
    setIsFireworksVisible(true);

    setTimeout(() => {
      setIsFireworksVisible(false);
    }, 4000);

    setTimeout(() => {
      setIsModalOpen(false);
    }, 4000);
  };

  return (
    <>
      <div className="flex justify-center items-center space-x-4 relative">
        <div className="flex items-center space-x-1 sm:space-x-2 relative z-10">
          <Link href="/" passHref>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold italic text-[#00f798] tracking-tight relative overflow-hidden group cursor-pointer">
              <span className="relative inline-block transform rotate-12 origin-center text-[#676968]">
                J
              </span>
              <span className="relative inline-block transform rotate-8 origin-center">
                L
              </span>
              <span className="text-2xl sm:text-3xl md:text-4xl text-[#00f798]">
                Planet
              </span>
              <div className="absolute bottom-0 left-0 w-0 bg-[#00f798] transition-all duration-500 group-hover:w-full h-1" />
            </h1>
          </Link>
        </div>
        <div
          onClick={handleTahaClick}
          className="absolute top-[-0.4rem] right-[-0.4rem] sm:top-[-0.6rem] sm:right-[-0.6rem] md:top-[-0.75rem] md:right-[-0.75rem] text-[#676968] text-xs sm:text-sm md:text-base italic group cursor-pointer"
        >
          <span className="relative inline-block transform rotate-12 group-hover:underline">
            Taha
            <div className="absolute bottom-0 right-0 w-0 bg-[#00f798] transition-all duration-500 group-hover:w-full h-1" />
          </span>
        </div>
      </div>

      {isFireworksVisible && (
        <div
          className={`${styles.fireworks} absolute top-[-1rem] left-[-1rem] w-10 h-10 rounded-full bg-transparent`}
        ></div>
      )}

      {isFireworksVisible && (
        <div
          className={`${styles.fireworks} absolute top-[-1rem] right-[-1rem] w-10 h-10 rounded-full bg-transparent`}
        ></div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <div className="absolute inset-0 bg-transparent bg-opacity-50"></div>
          <div
            className={`bg-[#1c2821] p-12 rounded-3xl shadow-lg transform transition-all duration-700 ease-in-out scale-100 animate-fade flex items-center justify-center text-center relative`}
            style={{
              animationDuration: "4s",
              animationName: "fadeInOut",
            }}
          >
            <div className="relative z-10 p-6">
              <p className="text-5xl font-bold text-[#F5F7F1]">
                You tickled TAHA!
              </p>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeInOut {
          0% {
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }

        .fireworks {
          animation: fireworksAnimation 4s ease-out;
        }

        @keyframes fireworksAnimation {
          0% {
            transform: scale(1);
            opacity: 0.6;
          }
          25% {
            transform: scale(1.5);
            opacity: 1;
          }
          75% {
            transform: scale(1);
            opacity: 0.6;
          }
          100% {
            transform: scale(1);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
};

export default Logo;
