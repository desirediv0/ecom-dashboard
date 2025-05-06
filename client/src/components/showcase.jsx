import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function GymSupplementBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="w-full bg-black text-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="flex flex-col md:flex-row"
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          {/* Left Side - Text Content */}
          <motion.div
            className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center"
            initial={{ opacity: 0, x: -30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-lg font-bold text-gray-400 tracking-widest uppercase">
                Premium Collection
              </h2>
              <h1 className="text-4xl md:text-5xl font-extrabold mt-2 tracking-tight">
                MAX <span className="text-gray-400">POWER</span>
              </h1>
              <div className="h-1 w-16 bg-white mt-4 mb-6"></div>
            </motion.div>

            <motion.p
              className="text-gray-300 leading-relaxed max-w-lg mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6 }}
            >
              Advanced protein formula with 25g protein per serving. Engineered
              for maximum performance and rapid recovery. Fuel your ambition
              with our scientifically formulated supplement.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.7 }}
            >
              {["25g Protein", "5g BCAAs", "Zero Sugar", "Fast Absorption"].map(
                (feature, index) => (
                  <div
                    key={index}
                    className="border border-gray-700 bg-gray-900 px-4 py-2 rounded-full text-sm font-medium"
                  >
                    {feature}
                  </div>
                )
              )}
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 mt-2"
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.8 }}
            >
              <motion.button
                className="bg-white text-black hover:bg-gray-200 font-bold py-3 px-8 rounded-none shadow-lg"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                SHOP NOW
              </motion.button>

              <motion.button
                className="bg-transparent border border-white hover:bg-white/10 text-white font-bold py-3 px-8 rounded-none shadow-lg"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                LEARN MORE
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right Side - Product Image with Effects */}
          <motion.div
            className="w-full md:w-1/2 relative"
            initial={{ opacity: 0, x: 30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="h-full min-h-[400px] relative overflow-hidden bg-gradient-to-b from-gray-900 to-black">
              {/* Geometric Shapes */}
              <motion.div
                className="absolute top-1/4 left-1/4 w-32 h-32 border border-gray-700 rotate-45"
                animate={{
                  rotate: [45, 90, 45],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 8,
                  ease: "easeInOut",
                }}
              />

              <motion.div
                className="absolute bottom-1/3 right-1/3 w-40 h-40 border border-gray-800 rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 6,
                  ease: "easeInOut",
                }}
              />

              {/* Product Image */}
              <motion.div
                className="absolute inset-0 flex items-center justify-center z-10"
                initial={{ y: 30, opacity: 0 }}
                animate={isVisible ? { y: 0, opacity: 1 } : {}}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <Image
                  src="/c3.jpg"
                  alt="Protein Supplement"
                  width={400}
                    height={400}
                  className="max-h-full max-w-full object-contain"
                />
              </motion.div>

              {/* Light Beam Effect */}
              <motion.div
                className="absolute -top-20 -left-20 w-40 h-[150%] bg-white/5 rotate-45 blur-md"
                animate={{
                  x: [0, 200, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 10,
                  ease: "easeInOut",
                }}
              />
            </div>

            {/* Bottom Product Info Bar */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm p-4 flex justify-between items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.9 }}
            >
              <div className="flex items-center">
                <div className="text-xl font-bold">₹1,999</div>
                <div className="text-gray-400 text-sm line-through ml-2">
                  ₹2,499
                </div>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="text-xs ml-1">(426)</span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
