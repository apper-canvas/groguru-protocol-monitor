import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Card from '@/components/molecules/Card';

const SymptomSelection = ({ onSelect, onSkip }) => {
  const symptoms = [
    { id: 'yellowing', label: 'Yellowing leaves', icon: 'Leaf' },
    { id: 'browning', label: 'Brown spots/edges', icon: 'CircleDot' },
    { id: 'wilting', label: 'Wilting/drooping', icon: 'TrendingDown' },
    { id: 'holes', label: 'Holes in leaves', icon: 'Circle' },
    { id: 'white-spots', label: 'White powdery spots', icon: 'Snowflake' },
    { id: 'pests', label: 'Visible insects/pests', icon: 'Bug' },
    { id: 'stunted', label: 'Stunted growth', icon: 'Minus' },
    { id: 'dropping', label: 'Dropping leaves', icon: 'ArrowDown' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-sm"
    >
      <h3 className="font-heading text-lg font-semibold text-surface-800 mb-4">
        What symptoms do you see?
      </h3>
      <p className="text-sm text-surface-600 mb-6">
        Select all that apply to help improve diagnosis accuracy
      </p>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {symptoms.map(symptom => (
          <Button
            key={symptom.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect([symptom.id])} // Passing selected symptoms as an array
            className="flex items-center space-x-3 p-3 bg-surface-50 rounded-xl text-left hover:bg-surface-100 transition-colors"
          >
            <ApperIcon name={symptom.icon} size={20} className="text-accent" />
            <span className="text-sm font-medium text-surface-700">{symptom.label}</span>
          </Button>
        ))}
      </div>

      <Button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onSkip()}
        className="w-full text-surface-600 py-2 px-4 rounded-xl font-medium hover:bg-surface-100 transition-colors"
      >
        Skip this step
      </Button>
    </motion.div>
  );
};

export default SymptomSelection;