"use client";

import { motion, Variants } from "framer-motion";
import Image from "next/image";

const backdropVariants: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.5,
      ease: "easeIn" as const,
    },
  },
};

const imageVariants: Variants = {
  initial: {
    scale: 1.1,
    opacity: 0,
  },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 1,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    scale: 0.80,
    opacity: 0,
    transition: {
      duration: 0.8,
      ease: "easeInOut" as const,
    },
  },
};

const Loader = () => {
  return (
    <motion.div
      variants={backdropVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="fixed inset-0 z-99 bg-transparent overflow-hidden"
    >
      <motion.div
        variants={imageVariants}
        className="relative w-full h-screen"
      >
        <Image
          src="/bannira_logo.png"
          alt="Loading"
          fill
          className="object-fill md:object-cover"
          priority
        />
      </motion.div>

      <motion.div
        className="absolute inset-0 bg-black"
        initial={{ opacity: 0.6 }}
        animate={{ opacity: 0.2 }}
        exit={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      />
    </motion.div>
  );
};

export default Loader;