import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import JournalEntryCard from '@/components/molecules/JournalEntryCard';
import AddJournalEntryModal from '@/components/organisms/AddJournalEntryModal';
import Card from '@/components/molecules/Card';

import { journalService } from '@/services';

const JournalPage = () => {
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
          <div className="h-8 bg-surface-200 rounded w-32 animate-pulse"></div>
          <div className="h-10 w-10 bg-surface-200 rounded-xl animate-pulse"></div>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="animate-pulse bg-surface-50 p-6 shadow-sm">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-surface-200 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-surface-200 rounded w-3/4"></div>
                  <div className="h-3 bg-surface-200 rounded w-1/2"></div>
                </div>
              </div>
              <div className="h-20 bg-surface-200 rounded"></div>
            </Card>
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
        <Button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Try again
        </Button>
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
        <Button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddModal(true)}
          className="p-3 bg-accent text-white rounded-xl shadow-sm hover:bg-accent/90 transition-colors"
        >
          <ApperIcon name="Plus" size={20} />
        </Button>
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
              <JournalEntryCard
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
            <Button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-accent text-white rounded-xl font-medium hover:bg-accent/90 transition-colors"
            >
              Add First Entry
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Entry Modal */}
      <AddJournalEntryModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddEntry}
        plants={plants}
      />
    </div>
  );
};

export default JournalPage;