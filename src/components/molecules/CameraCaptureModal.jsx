import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const CameraCaptureModal = ({ isOpen, onCapture, onCancel }) => {
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

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      >
        <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
          <h3 className="font-heading text-lg font-semibold text-surface-800 mb-4 text-center">
            Capture Plant Photo
          </h3>
          
          <div className="space-y-4">
            <Button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-primary text-white py-4 px-6 rounded-xl font-medium hover:bg-primary/90 transition-colors flex items-center justify-center space-x-2"
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
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CameraCaptureModal;