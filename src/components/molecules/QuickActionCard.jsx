import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const QuickActionCard = ({ icon, title, description, onClick }) => {
  return (
    <Button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-white rounded-xl p-6 shadow-sm border border-surface-100 text-left"
    >
      <div className="p-3 bg-accent/10 rounded-lg inline-block mb-3">
        <ApperIcon name={icon} size={24} className="text-accent" />
      </div>
      <h3 className="font-medium text-surface-800 mb-1">{title}</h3>
      <p className="text-sm text-surface-600">{description}</p>
    </Button>
  );
};

export default QuickActionCard;