import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';

const AddJournalEntryModal = ({ isOpen, onClose, onSave, plants }) => {
  const [formData, setFormData] = useState({
    plantId: '',
    type: 'note',
    title: '',
    notes: '',
    photos: [],
    measurements: {
      height: '',
      width: '',
      leaves: ''
    }
  });

  const entryTypes = [
    { id: 'note', label: 'General Note', icon: 'FileText' },
    { id: 'milestone', label: 'Milestone', icon: 'Star' },
    { id: 'problem', label: 'Problem', icon: 'AlertTriangle' },
    { id: 'harvest', label: 'Harvest', icon: 'Scissors' },
    { id: 'photo', label: 'Photo Update', icon: 'Camera' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.plantId || !formData.title) {
      toast.error('Please fill in all required fields');
      return;
    }
    onSave(formData);
    setFormData({
      plantId: '',
      type: 'note',
      title: '',
      notes: '',
      photos: [],
      measurements: { height: '', width: '', leaves: '' }
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-heading text-lg font-semibold text-surface-800">New Journal Entry</h3>
            <Button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="p-2 text-surface-400 hover:text-surface-600 transition-colors"
            >
              <ApperIcon name="X" size={20} />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField label="Plant" required>
              <select
                value={formData.plantId}
                onChange={(e) => setFormData({ ...formData, plantId: e.target.value })}
                className="w-full p-3 border border-surface-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                required
              >
                <option value="">Select a plant</option>
                {plants.map(plant => (
                  <option key={plant.id} value={plant.id}>{plant.nickname}</option>
                ))}
              </select>
            </FormField>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">Entry Type</label>
              <div className="grid grid-cols-2 gap-2">
                {entryTypes.map(type => (
                  <Button
                    key={type.id}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setFormData({ ...formData, type: type.id })}
                    className={`p-3 rounded-lg border transition-colors flex items-center space-x-2 ${
                      formData.type === type.id
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-surface-200 text-surface-600 hover:bg-surface-50'
                    }`}
                  >
                    <ApperIcon name={type.icon} size={16} />
                    <span className="text-sm font-medium">{type.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            <FormField
              label="Title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter title..."
              required
            />

            <FormField
              label="Notes"
              as="textarea"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={4}
              placeholder="Add your observations..."
              className="resize-none"
            />

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">Measurements (optional)</label>
              <div className="grid grid-cols-3 gap-2">
                <FormField
                  as="input"
                  type="number"
                  value={formData.measurements.height}
                  onChange={(e) => setFormData({
                    ...formData,
                    measurements: { ...formData.measurements, height: e.target.value }
                  })}
                  className="p-2 text-sm"
                  placeholder="Height (cm)"
                />
                <FormField
                  as="input"
                  type="number"
                  value={formData.measurements.width}
                  onChange={(e) => setFormData({
                    ...formData,
                    measurements: { ...formData.measurements, width: e.target.value }
                  })}
                  className="p-2 text-sm"
                  placeholder="Width (cm)"
                />
                <FormField
                  as="input"
                  type="number"
                  value={formData.measurements.leaves}
                  onChange={(e) => setFormData({
                    ...formData,
                    measurements: { ...formData.measurements, leaves: e.target.value }
                  })}
                  className="p-2 text-sm"
                  placeholder="Leaves"
                />
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="flex-1 py-3 px-4 bg-surface-100 text-surface-700 rounded-lg font-medium hover:bg-surface-200 transition-colors"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-3 px-4 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 transition-colors"
              >
                Save Entry
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddJournalEntryModal;