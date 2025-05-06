import { useState } from "react";
import { motion } from "framer-motion";

const BenefitsSec = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const benefits = [
    {
      title: "Premium Quality",
      description:
        "Lab-tested supplements made with high-quality ingredients for maximum effectiveness.",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
          />
        </svg>
      ),
    },
    {
      title: "Fast Delivery",
      description:
        "Get your supplements delivered to your doorstep within 2-3 business days.",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
          />
        </svg>
      ),
    },
    {
      title: "Expert Support",
      description:
        "Our team of fitness experts is available to help you choose the right supplements.",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    },
    {
      title: "Secure Payments",
      description: "Shop with confidence with our 100% secure payment gateway.",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      ),
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <section className="py-20 bg-gradient-to-b from-gray-100 to-gray-200 text-gray-800 overflow-hidden">
      <div className="container mx-auto px-4 relative">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-white opacity-3 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-white opacity-3 rounded-full blur-3xl"></div>

        <motion.div
          className="text-center mb-16 relative z-10"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            <span className="relative inline-block">
              WHY CHOOSE US
              <motion.span
                className="absolute -bottom-3 left-0 h-1 bg-black w-0"
                animate={{ width: "100%" }}
                transition={{ delay: 0.8, duration: 0.8 }}
              ></motion.span>
            </span>
          </h2>
          <p className="text-gray-800 mt-6 max-w-2xl mx-auto text-lg">
            We're committed to providing you with the best fitness supplements
            that deliver real results for your training goals
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className="group"
            >
              <motion.div
                className="bg-gray-900 p-6 rounded-lg h-full border-2 border-gray-800 flex flex-col relative overflow-hidden"
                whileHover={{
                  y: -10,
                  transition: { duration: 0.3 },
                }}
              >
                <motion.div
                  className="absolute -right-16 -top-16 w-32 h-32 bg-white/5 rounded-full"
                  animate={
                    hoveredIndex === index
                      ? { scale: [1, 1.5], x: [0, 10], y: [0, 10] }
                      : { scale: 1, x: 0, y: 0 }
                  }
                  transition={{ duration: 0.5 }}
                ></motion.div>

                <motion.div
                  className="mb-6 text-white bg-black p-4 rounded-full w-16 h-16 flex items-center justify-center relative z-10"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {benefit.icon}
                </motion.div>

                <h3 className="text-2xl font-bold mb-3 relative z-10">
                  {benefit.title}
                </h3>
                <p className="text-gray-300 relative z-10 flex-grow">
                  {benefit.description}
                </p>

                <motion.div
                  className="mt-6 pt-4 border-t border-gray-800 flex justify-between items-center relative z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredIndex === index ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="text-sm font-medium text-white">
                    Learn more
                  </span>
                  <motion.svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    animate={
                      hoveredIndex === index ? { x: [0, 5, 0] } : { x: 0 }
                    }
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </motion.svg>
                </motion.div>

                {/* Hover Spotlight Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-tr from-white to-transparent opacity-0 group-hover:opacity-5 transition-opacity duration-300"
                  style={{
                    clipPath:
                      "polygon(0% 0%, 100% 0%, 100% 75%, 75% 100%, 0% 100%)",
                  }}
                ></motion.div>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          {/* <motion.button
            className="bg-white text-black px-8 py-3 rounded-full font-semibold text-lg hover:shadow-lg transition-all duration-300 relative overflow-hidden group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10">SHOP NOW</span>
            <motion.span
              className="absolute inset-0 bg-gray-200 rounded-full"
              initial={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              style={{ originX: 0.5, originY: 0.5 }}
            ></motion.span>
          </motion.button> */}
        </motion.div>
      </div>
    </section>
  );
};

export default BenefitsSec;
