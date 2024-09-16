"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tooltip } from '@nextui-org/tooltip';

export default function Partners() {
  // State to hold the dynamic number
  const [dynamicNumber, setDynamicNumber] = useState(420);

  // Function to calculate the new number based on the current time
  const calculateNewNumber = () => {
    const startDate = new Date('2024-09-04T00:00:00Z'); // Start date at midnight UTC
    const now = new Date(); // Current date and time
    const diffInDays = Math.floor((now - startDate) / (1000 * 60 * 60 * 24)); // Difference in days
    const newNumber = 420 + (diffInDays * 10); // Calculate new number (48 = 2 * 24 hours)
    setDynamicNumber(newNumber);
  };

  // Effect to run the calculation initially and then every hour
  useEffect(() => {
    calculateNewNumber();
    const intervalId = setInterval(calculateNewNumber, 60 * 60 * 1000); // Update every hour
    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, []);

  return (
    <section className="max-w-screen-md w-full mx-auto px-1 py-1 md:px-0 flex flex-col justify-center items-center">
      <motion.h2
        initial={{ y: 5, opacity: 0 }}
        whileInView={{
          y: 0,
          opacity: 1,
        }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-2xl font-light tracking-tighter sm:text-3xl bg-gradient-to-b from-foreground to-foreground/70 text-transparent bg-clip-text text-pretty"
      >
        Total Reports Generated till date:
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px', // Add some padding
        }}>
          <p style={{
            margin: '0', // Remove default margin
            padding: '10px 20px', // Add some padding around the text
            border: '2px solid #0070f3', // Border color
            borderRadius: '10px', // Rounded corners
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' // Subtle shadow
          }}>
            {Math.round(dynamicNumber)}+
          </p>
        </div>
      </motion.h2>
    </section>
  );
}