"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function SavedJobsPage() {
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Add custom background color animation for Saved Jobs page
    document.body.classList.add(
      "bg-gradient-to-r",
      "from-blue-700",
      "via-indigo-600",
      "to-teal-500",
      "text-white"
    );
    return () => {
      document.body.classList.remove(
        "bg-gradient-to-r",
        "from-blue-700",
        "via-indigo-600",
        "to-teal-500",
        "text-white"
      );
    };
  }, []);

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden">
      {/* Dynamic Background Animation */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full bg-opacity-20 bg-gradient-to-r from-blue-500 via-indigo-400 to-teal-500"
        animate={{
          rotate: 180,
          opacity: [0.15, 0.6, 0.15],
        }}
        transition={{
          duration: 10,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      />

      {/* Floating Elements */}
      <motion.div
        className="absolute w-48 h-48 bg-indigo-500 rounded-full opacity-25"
        animate={{
          x: [-200, 200],
          y: [250, -200],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute w-80 h-80 bg-teal-600 rounded-full opacity-20"
        animate={{
          x: [200, -250],
          y: [-300, 150],
          scale: [1, 1.5, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute w-96 h-96 bg-blue-400 rounded-full opacity-10"
        animate={{
          x: [100, -300],
          y: [-150, 300],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Main Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center text-center space-y-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        {/* Heading */}
        <motion.h1
          className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white drop-shadow-lg"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 90, damping: 20 }}
        >
          Your Saved Jobs
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-xl"
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 70, damping: 30 }}
        >
          Keep track of the jobs you love. We&apos;re organizing your saved
          opportunities just for you!
        </motion.p>

        {/* Interactive Hover Button */}
        <motion.button
          className={cn(
            "px-8 py-3 mt-6 bg-gradient-to-r from-indigo-600 via-blue-500 to-teal-500 text-white rounded-full shadow-lg transform hover:scale-110 transition-all duration-200",
            isHovered ? "bg-indigo-700" : "bg-gradient-to-r"
          )}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.3 }}
        >
          View All Jobs
        </motion.button>

        {/* Decorative Elements */}
        <motion.div
          className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center"
          animate={{
            rotate: [0, 180, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 6,
            ease: "easeInOut",
          }}
        >
          <div className="w-40 h-40 bg-teal-400 rounded-full opacity-20" />
        </motion.div>
      </motion.div>
    </div>
  );
}
