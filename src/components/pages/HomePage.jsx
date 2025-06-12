import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-surface-50 to-surface-100 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full text-center"
      >
        <motion.div
          animate={{ 
            rotate: [0, 5, -5, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 4,
            ease: "easeInOut"
          }}
          className="mb-8"
        >
          <ApperIcon name="Leaf" size={80} className="text-secondary mx-auto" />
        </motion.div>

        <h1 className="font-heading text-4xl font-bold text-primary mb-4">
          GroGuru
        </h1>
        
        <p className="text-lg text-surface-700 mb-8">
          Your AI-powered gardening companion for healthier, happier plants
        </p>

        <Button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/dashboard')}
          className="w-full bg-accent text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:bg-accent/90 transition-colors"
        >
          Start Gardening
        </Button>

        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div>
            <ApperIcon name="Camera" size={24} className="text-primary mx-auto mb-2" />
            <p className="text-sm text-surface-600">Plant ID</p>
          </div>
          <div>
            <ApperIcon name="Calendar" size={24} className="text-primary mx-auto mb-2" />
            <p className="text-sm text-surface-600">Care Schedule</p>
          </div>
          <div>
            <ApperIcon name="Cloud" size={24} className="text-primary mx-auto mb-2" />
            <p className="text-sm text-surface-600">Weather Alerts</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HomePage;