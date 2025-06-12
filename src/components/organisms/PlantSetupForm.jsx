import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';
import Card from '@/components/molecules/Card';

const PlantSetupForm = ({ species, onComplete, onBack }) => {
  const [plantData, setPlantData] = useState({
    nickname: '',
    location: '',
    plantedDate: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!plantData.nickname.trim()) {
      toast.error('Please give your plant a nickname');
      return;
    }
    onComplete({ ...plantData, species });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <Card className="p-6 shadow-sm">
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-3 bg-secondary/10 rounded-xl">
            <ApperIcon name="Leaf" size={24} className="text-secondary" />
          </div>
          <div>
            <h3 className="font-heading text-lg font-semibold text-surface-800">{species.commonName}</h3>
            <p className="text-sm text-surface-600 italic">{species.scientificName}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            label="Plant Nickname"
            type="text"
            value={plantData.nickname}
            onChange={(e) => setPlantData({ ...plantData, nickname: e.target.value })}
            placeholder="Give your plant a friendly name..."
            required
          />

          <FormField
            label="Location"
            type="text"
            value={plantData.location}
            onChange={(e) => setPlantData({ ...plantData, location: e.target.value })}
            placeholder="e.g., Living room window, Balcony, Garden bed..."
          />

          <FormField
            label="Planted Date"
            type="date"
            value={plantData.plantedDate}
            onChange={(e) => setPlantData({ ...plantData, plantedDate: e.target.value })}
          />

          <FormField
            label="Notes (optional)"
            as="textarea"
            value={plantData.notes}
            onChange={(e) => setPlantData({ ...plantData, notes: e.target.value })}
            rows={3}
            placeholder="Any special notes about your plant..."
            className="resize-none"
          />

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onBack}
              className="flex-1 py-3 px-4 bg-surface-100 text-surface-700 rounded-xl font-medium hover:bg-surface-200 transition-colors"
            >
              Back
            </Button>
            <Button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 py-3 px-4 bg-accent text-white rounded-xl font-medium hover:bg-accent/90 transition-colors"
            >
              Add Plant
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
};

export default PlantSetupForm;