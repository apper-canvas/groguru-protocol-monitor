import { useRef } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Card from '@/components/molecules/Card';

const CameraInput = ({ onCapture, onCancel }) => {
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onCapture({
          file,
          preview: e.target.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
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
          <ApperIcon name="Camera" size={64} className="text-accent mx-auto" />
        </motion.div>
        
        <h2 className="font-heading text-xl font-semibold text-surface-800 mb-4">
          Take a Photo of Your Plant
        </h2>
        <p className="text-surface-600 mb-8">
          For best results, take a clear photo showing the whole plant or distinctive features
        </p>

        <div className="space-y-4">
          <Button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => fileInputRef.current?.click()}
            className="w-full bg-accent text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-sm hover:bg-accent/90 transition-colors flex items-center justify-center space-x-2"
          >
            <ApperIcon name="Camera" size={20} />
            <span>Take Photo</span>
          </Button>

          <Button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => fileInputRef.current?.click()}
            className="w-full bg-surface-100 text-surface-700 py-4 px-6 rounded-xl font-medium hover:bg-surface-200 transition-colors flex items-center justify-center space-x-2"
          >
            <ApperIcon name="Image" size={20} />
            <span>Choose from Gallery</span>
          </Button>

          <Button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onCancel}
            className="w-full text-surface-600 py-2 px-6 rounded-xl font-medium hover:bg-surface-100 transition-colors"
          >
            Cancel
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileSelect}
          className="hidden"
        />
      </Card>

      <Card className="p-6 shadow-sm">
        <h3 className="font-medium text-surface-800 mb-4">Photo Tips:</h3>
        <div className="space-y-3 text-left">
          <div className="flex items-center space-x-3">
            <ApperIcon name="Sun" size={16} className="text-yellow-500" />
            <span className="text-sm text-surface-600">Use natural lighting when possible</span>
          </div>
          <div className="flex items-center space-x-3">
            <ApperIcon name="Focus" size={16} className="text-primary" />
            <span className="text-sm text-surface-600">Keep the plant in focus</span>
          </div>
          <div className="flex items-center space-x-3">
            <ApperIcon name="Leaf" size={16} className="text-secondary" />
            <span className="text-sm text-surface-600">Include leaves, flowers, or distinctive features</span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default CameraInput;