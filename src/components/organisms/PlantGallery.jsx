import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import PlantDisplayCard from '@/components/molecules/PlantDisplayCard';

const PlantGallery = ({ plants, onViewDetails }) => {
  const [viewMode, setViewMode] = useState('grid');
  const [filterBy, setFilterBy] = useState('all');

  const filteredPlants = plants.filter(plant => {
    if (filterBy === 'all') return true;
    if (filterBy === 'healthy') return plant.healthScore >= 80;
    if (filterBy === 'needs-attention') return plant.healthScore < 60;
    return true;
  });

  return (
    <>
      {/* Filter Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex space-x-2">
          {[
            { id: 'all', label: 'All', count: plants.length },
            { id: 'healthy', label: 'Healthy', count: plants.filter(p => p.healthScore >= 80).length },
            { id: 'needs-attention', label: 'Needs Care', count: plants.filter(p => p.healthScore < 60).length }
          ].map(filter => (
            <Button
              key={filter.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilterBy(filter.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterBy === filter.id
                  ? 'bg-primary text-white'
                  : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
              }`}
            >
              {filter.label} ({filter.count})
            </Button>
          ))}
        </div>

        <div className="flex space-x-2">
          <Button
            whileTap={{ scale: 0.95 }}
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid'
                ? 'bg-primary text-white'
                : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
            }`}
          >
            <ApperIcon name="Grid3X3" size={16} />
          </Button>
          <Button
            whileTap={{ scale: 0.95 }}
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list'
                ? 'bg-primary text-white'
                : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
            }`}
          >
            <ApperIcon name="List" size={16} />
          </Button>
        </div>
      </div>

      {/* Plants Grid */}
      <AnimatePresence>
        {filteredPlants.length > 0 ? (
          <motion.div 
            layout
            className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-2' : 'grid-cols-1'}`}
          >
            {filteredPlants.map((plant, index) => (
              <motion.div
                key={plant.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <PlantDisplayCard plant={plant} onViewDetails={onViewDetails} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <ApperIcon name="Search" size={48} className="text-surface-400 mx-auto mb-3" />
            <p className="text-surface-600">No plants match your current filter</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PlantGallery;