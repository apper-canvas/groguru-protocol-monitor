import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format, parseISO } from 'date-fns';
import ApperIcon from '../components/ApperIcon';
import { journalService } from '../services';

const JournalEntry = ({ entry, onEdit, onDelete }) => {
  const getTypeIcon = (type) => {
    switch (type) {
      case 'milestone': return 'Star';
      case 'problem': return 'AlertTriangle';
      case 'harvest': return 'Scissors';
      case 'note': return 'FileText';
      case 'photo': return 'Camera';
      default: return 'Circle';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'milestone': return 'text-yellow-500 bg-yellow-500/10';
      case 'problem': return 'text-red-500 bg-red-500/10';
      case 'harvest': return 'text-green-500 bg-green-500/10';
      case 'note': return 'text-blue-500 bg-blue-500/10';
      case 'photo': return 'text-purple-500 bg-purple-500/10';
      default: return 'text-surface-500 bg-surface-100';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-surface-100"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${getTypeColor(entry.type)}`}>
            <ApperIcon name={getTypeIcon(entry.type)} size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-surface-800">{entry.title}</h3>
            <p className="text-sm text-surface-600">{entry.plantName}</p>
            <p className="text-xs text-surface-500">{format(parseISO(entry.date), 'PPP')}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onEdit(entry.id)}
            className="p-2 text-surface-400 hover:text-surface-600 transition-colors"
          >
            <ApperIcon name="Edit2" size={16} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onDelete(entry.id)}
            className="p-2 text-surface-400 hover:text-semantic-error transition-colors"
          >
            <ApperIcon name="Trash2" size={16} />
          </motion.button>
        </div>
      </div>

      {entry.photos && entry.photos.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mb-4">
          {entry.photos.slice(0, 4).map((photo, index) => (
            <div key={index} className="aspect-square rounded-lg overflow-hidden bg-surface-100">
              <img
                src={photo.url}
                alt={`Entry photo ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {entry.notes && (
        <p className="text-surface-700 break-words">{entry.notes}</p>
      )}

      {entry.measurements && (
        <div className="mt-4 grid grid-cols-3 gap-4 p-3 bg-surface-50 rounded-lg">
          {entry.measurements.height && (
            <div className="text-center">
              <p className="text-sm font-medium text-surface-800">{entry.measurements.height}cm</p>
              <p className="text-xs text-surface-600">Height</p>
            </div>
          )}
          {entry.measurements.width && (
            <div className="text-center">
              <p className="text-sm font-medium text-surface-800">{entry.measurements.width}cm</p>
              <p className="text-xs text-surface-600">Width</p>
            </div>
          )}
          {entry.measurements.leaves && (
            <div className="text-center">
              <p className="text-sm font-medium text-surface-800">{entry.measurements.leaves}</p>
              <p className="text-xs text-surface-600">Leaves</p>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

const AddEntryModal = ({ isOpen, onClose, onSave, plants }) => {
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
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="p-2 text-surface-400 hover:text-surface-600 transition-colors"
            >
              <ApperIcon name="X" size={20} />
            </motion.button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">Plant</label>
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
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">Entry Type</label>
              <div className="grid grid-cols-2 gap-2">
                {entryTypes.map(type => (
                  <motion.button
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
                  </motion.button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-3 border border-surface-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                placeholder="Enter title..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={4}
                className="w-full p-3 border border-surface-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
                placeholder="Add your observations..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-2">Measurements (optional)</label>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="number"
                  value={formData.measurements.height}
                  onChange={(e) => setFormData({
                    ...formData,
                    measurements: { ...formData.measurements, height: e.target.value }
                  })}
                  className="p-2 border border-surface-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-sm"
                  placeholder="Height (cm)"
                />
                <input
                  type="number"
                  value={formData.measurements.width}
                  onChange={(e) => setFormData({
                    ...formData,
                    measurements: { ...formData.measurements, width: e.target.value }
                  })}
                  className="p-2 border border-surface-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-sm"
                  placeholder="Width (cm)"
                />
                <input
                  type="number"
                  value={formData.measurements.leaves}
                  onChange={(e) => setFormData({
                    ...formData,
                    measurements: { ...formData.measurements, leaves: e.target.value }
                  })}
                  className="p-2 border border-surface-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors text-sm"
                  placeholder="Leaves"
                />
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="flex-1 py-3 px-4 bg-surface-100 text-surface-700 rounded-lg font-medium hover:bg-surface-200 transition-colors"
              >
                Cancel
              </motion.button>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-3 px-4 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 transition-colors"
              >
                Save Entry
              </motion.button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const Journal = () => {
  const [entries, setEntries] = useState([]);
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterPlant, setFilterPlant] = useState('all');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [entriesData, plantsData] = await Promise.all([
          journalService.getAll(),
          journalService.getPlants()
        ]);
        setEntries(entriesData);
        setPlants(plantsData);
      } catch (err) {
        setError(err.message || 'Failed to load journal data');
        toast.error('Failed to load journal data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleAddEntry = async (entryData) => {
    try {
      const newEntry = await journalService.create(entryData);
      setEntries(prev => [newEntry, ...prev]);
      setShowAddModal(false);
      toast.success('Journal entry added!');
    } catch (err) {
      toast.error('Failed to add journal entry');
    }
  };

  const handleDeleteEntry = async (entryId) => {
    if (!confirm('Are you sure you want to delete this entry?')) return;
    
    try {
      await journalService.delete(entryId);
      setEntries(prev => prev.filter(entry => entry.id !== entryId));
      toast.success('Entry deleted');
    } catch (err) {
      toast.error('Failed to delete entry');
    }
  };

  const filteredEntries = entries.filter(entry => 
    filterPlant === 'all' || entry.plantId === filterPlant
  );

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
          <div className="h-10 w-10 bg-gray-200 rounded-xl animate-pulse"></div>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
        <ApperIcon name="AlertCircle" size={48} className="text-semantic-error mb-4" />
        <h3 className="text-lg font-semibold text-surface-800 mb-2">Failed to load journal</h3>
        <p className="text-surface-600 text-center mb-4">{error}</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Try again
        </motion.button>
      </div>
    );
  }

  return (
    <div className="max-w-full overflow-hidden p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-surface-800">Garden Journal</h1>
          <p className="text-surface-600">{entries.length} entries recorded</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddModal(true)}
          className="p-3 bg-accent text-white rounded-xl shadow-sm hover:bg-accent/90 transition-colors"
        >
          <ApperIcon name="Plus" size={20} />
        </motion.button>
      </div>

      {/* Filter */}
      {plants.length > 0 && (
        <div className="mb-6">
          <select
            value={filterPlant}
            onChange={(e) => setFilterPlant(e.target.value)}
            className="p-3 border border-surface-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-white"
          >
            <option value="all">All plants ({entries.length})</option>
            {plants.map(plant => (
              <option key={plant.id} value={plant.id}>
                {plant.nickname} ({entries.filter(e => e.plantId === plant.id).length})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Entries */}
      <AnimatePresence>
        {filteredEntries.length > 0 ? (
          <div className="space-y-4">
            {filteredEntries.map(entry => (
              <JournalEntry
                key={entry.id}
                entry={entry}
                onEdit={() => {}} // TODO: Implement edit functionality
                onDelete={handleDeleteEntry}
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <ApperIcon name="BookOpen" size={64} className="text-surface-400 mx-auto mb-4" />
            <h3 className="text-xl font-heading font-semibold text-surface-800 mb-2">
              {entries.length === 0 ? 'Start Your Journal' : 'No entries found'}
            </h3>
            <p className="text-surface-600 mb-6">
              {entries.length === 0 
                ? 'Document your plants\' growth journey with photos and notes'
                : 'Try adjusting your filter or add a new entry'
              }
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-accent text-white rounded-xl font-medium hover:bg-accent/90 transition-colors"
            >
              Add First Entry
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Entry Modal */}
      <AddEntryModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddEntry}
        plants={plants}
      />
    </div>
  );
};

export default Journal;