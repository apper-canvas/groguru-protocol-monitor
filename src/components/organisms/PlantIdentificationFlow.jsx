import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Card from '@/components/molecules/Card';

import { plantService } from '@/services'; // Ensure this path is correct

const PlantIdentificationFlow = ({ photo, onIdentified, onRetake }) => {
  const [identifying, setIdentifying] = useState(false);
  const [results, setResults] = useState([]);

  const handleIdentify = async () => {
    setIdentifying(true);
    try {
      const identificationResults = await plantService.identifyPlant(photo);
      setResults(identificationResults);
    } catch (err) {
      toast.error('Failed to identify plant. Please try again.');
    } finally {
      setIdentifying(false);
    }
  };

  const handleSelectPlant = (species) => {
    onIdentified(species);
  };

  if (identifying) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="mb-6"
        >
          <ApperIcon name="Loader2" size={48} className="text-accent mx-auto" />
        </motion.div>
        <h3 className="font-heading text-lg font-semibold text-surface-800 mb-2">
          Identifying your plant...
        </h3>
        <p className="text-surface-600">This may take a few moments</p>
      </motion.div>
    );
  }

  if (results.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <Card className="p-4 shadow-sm">
          <img
            src={photo.preview}
            alt="Plant to identify"
            className="w-full h-48 object-cover rounded-xl"
          />
        </Card>

        <Card className="p-6 shadow-sm text-center">
          <ApperIcon name="Search" size={48} className="text-accent mx-auto mb-4" />
          <h3 className="font-heading text-lg font-semibold text-surface-800 mb-4">
            Ready to identify your plant?
          </h3>
          <p className="text-surface-600 mb-6">
            Our AI will analyze your photo and suggest possible plant species
          </p>
          
          <div className="flex space-x-3">
            <Button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onRetake}
              className="flex-1 py-3 px-4 bg-surface-100 text-surface-700 rounded-xl font-medium hover:bg-surface-200 transition-colors"
            >
              Retake Photo
            </Button>
            <Button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleIdentify}
              className="flex-1 py-3 px-4 bg-accent text-white rounded-xl font-medium hover:bg-accent/90 transition-colors"
            >
              Identify Plant
            </Button>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card className="p-4 shadow-sm">
        <img
          src={photo.preview}
          alt="Identified plant"
          className="w-full h-32 object-cover rounded-xl"
        />
      </Card>

      <Card className="p-6 shadow-sm">
        <h3 className="font-heading text-lg font-semibold text-surface-800 mb-4">
          Identification Results
        </h3>
        <p className="text-surface-600 mb-6">Select the correct species:</p>
        
        <div className="space-y-3">
          {results.map((species, index) => (
            <Button
              key={species.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelectPlant(species)}
              className="w-full p-4 bg-surface-50 rounded-xl text-left hover:bg-surface-100 transition-colors border border-surface-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-surface-800">{species.commonName}</h4>
                  <p className="text-sm text-surface-600 italic">{species.scientificName}</p>
                  <p className="text-xs text-surface-500 mt-1">{species.family}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <div className="text-sm font-medium text-surface-800">{species.confidence}%</div>
                    <div className="text-xs text-surface-500">confidence</div>
                  </div>
                  <div className="w-2 h-2 bg-secondary rounded-full"></div>
                </div>
              </div>
            </Button>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-surface-200">
          <Button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onRetake}
            className="w-full py-3 px-4 text-surface-600 hover:bg-surface-100 rounded-xl transition-colors"
          >
            None of these? Take another photo
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default PlantIdentificationFlow;