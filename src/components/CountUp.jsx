import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform, useInView } from 'framer-motion';
import { useRef } from 'react';

const CountUp = ({ value, duration = 2, decimals = 1, prefix = '', suffix = '', className = '' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  
  const springValue = useSpring(0, {
    duration: duration * 1000,
    bounce: 0,
  });

  useEffect(() => {
    if (isInView) {
      springValue.set(value);
    }
  }, [isInView, value, springValue]);

  const displayValue = useTransform(springValue, (current) => {
    return current.toFixed(decimals);
  });

  return (
    <motion.span ref={ref} className={className}>
      {prefix}
      <motion.span>{displayValue}</motion.span>
      {suffix}
    </motion.span>
  );
};

export default CountUp;
