import { motion } from 'framer-motion';

const Card = ({ children, className = '', ...motionProps }) => {
  return (
    <motion.div
      className={`bg-white rounded-2xl p-6 shadow-sm ${className}`}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
};

export default Card;