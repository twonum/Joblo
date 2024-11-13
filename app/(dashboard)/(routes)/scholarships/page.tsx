"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function ScholarshipsPage() {
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Add dynamic background color animation for this page
    document.body.classList.add(
      "bg-gradient-to-r",
      "from-purple-700",
      "via-emerald-600",
      "to-stone-500",
      "text-white"
    );
    return () => {
      document.body.classList.remove(
        "bg-gradient-to-r",
        "from-purple-700",
        "via-emerald-600",
        "to-stone-500",
        "text-white"
      );
    };
  }, []);

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden">
      {/* Dynamic Background Animation */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full bg-opacity-20 bg-gradient-to-r from-purple-500 via-emerald-400 to-stone-500"
        animate={{
          rotate: 360,
          opacity: [0.1, 1, 0.1],
        }}
        transition={{
          duration: 6,
          ease: "linear",
          repeat: Infinity,
        }}
      />

      {/* Floating Elements */}
      <motion.div
        className="absolute w-60 h-60 bg-emerald-500 rounded-full opacity-20"
        animate={{
          x: [-100, 300],
          y: [200, -150],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute w-72 h-72 bg-purple-600 rounded-full opacity-30"
        animate={{
          x: [150, -250],
          y: [-250, 100],
          scale: [1, 1.4, 1],
        }}
        transition={{
          duration: 7,
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
          className="text-5xl sm:text-6xl md:text-7xl font-bold text-white"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 80, damping: 25 }}
        >
          Scholarships Coming Soon
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-2xl sm:text-3xl text-neutral-300"
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 70, damping: 30 }}
        >
          We're preparing some exciting scholarship opportunities. Stay tuned
          for updates!
        </motion.p>

        {/* Interactive Hover Area */}
        <motion.button
          className={cn(
            "px-6 py-3 mt-6 bg-gradient-to-r from-purple-600 via-emerald-500 to-stone-500 text-white rounded-lg shadow-lg",
            "hover:scale-105 transition-all duration-200",
            isHovered ? "bg-purple-700" : "bg-gradient-to-r"
          )}
          onHoverStart={() => setIsHovered(true)}
          onHoverEnd={() => setIsHovered(false)}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        >
          Explore More
        </motion.button>

        {/* Decorative Elements */}
        <motion.div
          className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center"
          animate={{
            rotate: [0, 360, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 6,
            ease: "easeInOut",
          }}
        >
          <div className="w-32 h-32 bg-emerald-400 rounded-full opacity-30" />
        </motion.div>
      </motion.div>
    </div>
  );
}
