import { motion } from 'framer-motion';

const Button = ({
  children,
  onClick,
  className = '',
  type = 'button',
  ...motionProps // All other props are passed to motion.button
}) => {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      className={className}
      {...motionProps}
    >
      {children}
    </motion.button>
  );
};

export default Button;