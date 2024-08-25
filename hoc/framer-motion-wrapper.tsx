import { motion } from 'framer-motion';
import React from 'react';

import { staggerContainer } from '@/lib/motion';

const FramerMotionSectionWrapper = (Component: any, idName: any) =>
  function HOC() {
    return (
      <motion.section
        variants={staggerContainer()}
        initial="hidden"
        whileInView={'show'}
        viewport={{ once: true, amount: 0.25 }}
        className={`relative z-0`}
      >
        <span id={idName}></span>
        <Component />
      </motion.section>
    );
  };

export default FramerMotionSectionWrapper;
