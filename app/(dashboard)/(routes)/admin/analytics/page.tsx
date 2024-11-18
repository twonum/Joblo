"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function AnalyticsPage() {
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Add dynamic background color animation for Analytics page
    document.body.classList.add(
      "bg-gradient-to-r",
      "from-blue-900",
      "via-cyan-600",
      "to-purple-800",
      "text-white"
    );
    return () => {
      document.body.classList.remove(
        "bg-gradient-to-r",
        "from-blue-900",
        "via-cyan-600",
        "to-purple-800",
        "text-white"
      );
    };
  }, []);

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden">
      {/* Dynamic Background Animation */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full bg-opacity-15 bg-gradient-to-r from-blue-800 via-cyan-500 to-purple-700"
        animate={{
          rotate: 360,
          opacity: [0.2, 0.8, 0.2],
        }}
        transition={{
          duration: 12,
          ease: "linear",
          repeat: Infinity,
        }}
      />

      {/* Floating Elements */}
      <motion.div
        className="absolute w-64 h-64 bg-cyan-500 rounded-full opacity-25"
        animate={{
          x: [0, 250],
          y: [200, -150],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute w-56 h-56 bg-blue-900 rounded-full opacity-20"
        animate={{
          x: [-250, 200],
          y: [-250, 150],
          scale: [1, 1.4, 1],
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute w-96 h-96 bg-purple-700 rounded-full opacity-10"
        animate={{
          x: [300, -100],
          y: [100, -200],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Main Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center text-center space-y-6 sm:space-y-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        {/* Heading */}
        <motion.h1
          className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white drop-shadow-lg"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        >
          Analytics Dashboard
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-lg sm:text-xl md:text-2xl text-gray-300 max-w-lg"
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 70, damping: 30 }}
        >
          Dive into your data with our powerful and intuitive analytics tools.
          Visualize insights and make data-driven decisions.
        </motion.p>

        {/* Interactive Button */}
        <motion.button
          className={cn(
            "px-8 py-3 mt-6 bg-gradient-to-r from-cyan-600 via-blue-500 to-purple-500 text-white rounded-full shadow-lg transform hover:scale-105 transition-all duration-200",
            isHovered ? "bg-cyan-700" : "bg-gradient-to-r"
          )}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.3 }}
        >
          View Analytics
        </motion.button>

        {/* Decorative Elements */}
        <motion.div
          className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center"
          animate={{
            rotate: [0, 180, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 8,
            ease: "easeInOut",
          }}
        >
          <div className="w-48 h-48 bg-purple-600 rounded-full opacity-25" />
        </motion.div>
      </motion.div>
    </div>
  );
}
