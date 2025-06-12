import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Card from '@/components/molecules/Card';

const InitialDiagnosisPrompt = ({ onStartDiagnosis }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="text-center space-y-6"
    >
      <Card className="p-8 shadow-sm">
        <motion.div
          animate={{ 
            rotate: [0, 5, -5, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 3,
            ease: "easeInOut"
          }}
          className="mb-6"
        >
          <ApperIcon name="Search" size={64} className="text-accent mx-auto" />
        </motion.div>
        
        <h2 className="font-heading text-xl font-semibold text-surface-800 mb-4">
          How can I help your plant?
        </h2>
        <p className="text-surface-600 mb-8">
          Take a photo of your plant and I'll analyze any issues and provide treatment recommendations
        </p>

        <Button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStartDiagnosis}
          className="w-full bg-accent text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-sm hover:bg-accent/90 transition-colors"
        >
          Start Diagnosis
        </Button>
      </Card>

      <Card className="p-6 shadow-sm">
        <h3 className="font-medium text-surface-800 mb-4">Tips for better results:</h3>
        <div className="space-y-3 text-left">
          <div className="flex items-center space-x-3">
            <ApperIcon name="Camera" size={16} className="text-primary" />
            <span className="text-sm text-surface-600">Take clear, well-lit photos</span>
          </div>
          <div className="flex items-center space-x-3">
            <ApperIcon name="Focus" size={16} className="text-primary" />
            <span className="text-sm text-surface-600">Focus on affected areas</span>
          </div>
          <div className="flex items-center space-x-3">
            <ApperIcon name="Leaf" size={16} className="text-primary" />
            <span className="text-sm text-surface-600">Include both healthy and unhealthy parts</span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default InitialDiagnosisPrompt;