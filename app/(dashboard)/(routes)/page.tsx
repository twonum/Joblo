"use client";

import { useEffect } from "react";
import { motion } from "framer-motion"; // For seamless animations

const DashboardHomePage = () => {
  useEffect(() => {
    // Set body background with aesthetic gradient
    document.body.classList.add(
      "bg-gradient-to-r",
      "from-purple-700",
      "via-emerald-600",
      "to-stone-600",
      "text-white"
    );
    return () => {
      document.body.classList.remove(
        "bg-gradient-to-r",
        "from-purple-700",
        "via-emerald-600",
        "to-stone-600",
        "text-white"
      );
    };
  }, []);

  return (
    <div className="w-full h-screen overflow-hidden flex justify-center items-center">
      {/* Main Container */}
      <motion.div
        className="relative w-full h-full flex flex-col justify-center items-center p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <motion.div
          className="absolute top-0 left-0 right-0 bottom-0 bg-opacity-20 bg-gradient-to-r from-purple-500 via-emerald-400 to-stone-500"
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
        {/* Main Title */}
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl font-bold text-center tracking-wider"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        >
          Welcome to JobLo Planet
        </motion.h1>
        <motion.p
          className="mt-4 text-xl sm:text-2xl text-center max-w-3xl"
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
        >
          Your dashboard is ready to be filled with your exciting content.
          Experience seamless, smooth animations all around.
        </motion.p>

        {/* Placeholder for future content */}
        <motion.div
          className="mt-10 w-full h-[300px] md:h-[500px] bg-gray-800 rounded-lg shadow-lg flex justify-center items-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            duration: 1,
            ease: "easeInOut",
          }}
        >
          <motion.div
            className="text-2xl font-semibold text-white"
            animate={{
              x: [-100, 100, -100],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            MUHAMMAD TAHA SALEEM
          </motion.div>
        </motion.div>

        {/* Animated Background Shapes */}
        <motion.div
          className="absolute top-0 left-0 w-80 h-80 bg-emerald-500 rounded-full opacity-30"
          animate={{
            x: [-100, 200],
            y: [100, -150],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-72 h-72 bg-purple-600 rounded-full opacity-40"
          animate={{
            x: [200, -100],
            y: [-200, 100],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.div>
    </div>
  );
};

export default DashboardHomePage;
