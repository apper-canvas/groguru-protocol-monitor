import { motion } from 'framer-motion';

const Input = ({
  as = 'input', // 'input', 'textarea', 'select'
  value,
  onChange,
  className = '',
  placeholder,
  type = 'text', // Only for 'input'
  rows, // Only for 'textarea'
  required = false,
  children, // For 'select' options
  ...motionProps // For framer-motion animations
}) => {
  const commonProps = {
    value,
    onChange,
    className: `w-full p-3 border border-surface-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${className}`,
    placeholder,
    required,
    ...motionProps,
  };

  switch (as) {
    case 'textarea':
      return <motion.textarea {...commonProps} rows={rows} />;
    case 'select':
      return <motion.select {...commonProps}>{children}</motion.select>;
    case 'input':
    default:
      return <motion.input {...commonProps} type={type} />;
  }
};

export default Input;