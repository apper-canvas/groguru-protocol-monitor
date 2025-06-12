import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import { plantService } from '../services';

const PlantCard = ({ plant, onViewDetails }) => {
  const getHealthColor = (score) => {
    if (score >= 80) return 'text-semantic-success';
    if (score >= 60) return 'text-semantic-warning';
    return 'text-semantic-error';
  };

  const getHealthBgColor = (score) => {
    if (score >= 80) return 'bg-semantic-success/10';
    if (score >= 60) return 'bg-semantic-warning/10';
    return 'bg-semantic-error/10';
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      onClick={() => onViewDetails(plant.id)}
      className="bg-white rounded-2xl p-4 shadow-sm border border-surface-100 cursor-pointer"
    >
      <div className="aspect-square rounded-xl overflow-hidden mb-3 bg-surface-100">
        {plant.photos && plant.photos.length > 0 ? (
          <img 
            src={plant.photos[0].url} 
            alt={plant.nickname}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ApperIcon name="Leaf" size={32} className="text-surface-400" />
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-surface-800 truncate">{plant.nickname}</h3>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${getHealthBgColor(plant.healthScore)} ${getHealthColor(plant.healthScore)}`}>
            {plant.healthScore}%
          </div>
        </div>
        
        <p className="text-sm text-surface-600 truncate">{plant.species?.commonName}</p>
        
        <div className="flex items-center justify-between text-xs text-surface-500">
          <span>{plant.location}</span>
          <span>{plant.daysOld} days old</span>
        </div>

        <div className="flex items-center space-x-4 pt-2">
          <div className="flex items-center space-x-1">
            <ApperIcon name="Droplets" size={14} className="text-blue-500" />
            <span className="text-xs text-surface-600">{plant.waterLevel}%</span>
          </div>
          <div className="flex items-center space-x-1">
            <ApperIcon name="Sun" size={14} className="text-yellow-500" />
            <span className="text-xs text-surface-600">{plant.lightLevel}%</span>
          </div>
          <div className="flex items-center space-x-1">
            <ApperIcon name="Thermometer" size={14} className="text-green-500" />
            <span className="text-xs text-surface-600">{plant.temperature}°</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Plants = () => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [filterBy, setFilterBy] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const loadPlants = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await plantService.getAll();
        setPlants(data);
      } catch (err) {
        setError(err.message || 'Failed to load plants');
        toast.error('Failed to load plants');
      } finally {
        setLoading(false);
      }
    };

    loadPlants();
  }, []);

  const handleViewDetails = (plantId) => {
    navigate(`/plants/${plantId}`);
  };

  const filteredPlants = plants.filter(plant => {
    if (filterBy === 'all') return true;
    if (filterBy === 'healthy') return plant.healthScore >= 80;
    if (filterBy === 'needs-attention') return plant.healthScore < 60;
    return true;
  });

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
          <div className="h-8 bg-gray-200 rounded w-24 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse bg-white rounded-2xl p-4 shadow-sm">
              <div className="aspect-square bg-gray-200 rounded-xl mb-3"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
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
        <h3 className="text-lg font-semibold text-surface-800 mb-2">Failed to load plants</h3>
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

  if (plants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          <ApperIcon name="Leaf" size={64} className="text-secondary mb-4" />
        </motion.div>
        <h3 className="text-xl font-heading font-semibold text-surface-800 mb-2">No Plants Yet</h3>
        <p className="text-surface-600 text-center mb-6">Start building your garden by adding your first plant</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/add-plant')}
          className="px-6 py-3 bg-accent text-white rounded-xl font-medium hover:bg-accent/90 transition-colors"
        >
          Add Your First Plant
        </motion.button>
      </div>
    );
  }

  return (
    <div className="max-w-full overflow-hidden p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-surface-800">My Plants</h1>
          <p className="text-surface-600">{plants.length} plant{plants.length !== 1 ? 's' : ''} in your garden</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/add-plant')}
          className="p-3 bg-accent text-white rounded-xl shadow-sm hover:bg-accent/90 transition-colors"
        >
          <ApperIcon name="Plus" size={20} />
        </motion.button>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex space-x-2">
          {[
            { id: 'all', label: 'All', count: plants.length },
            { id: 'healthy', label: 'Healthy', count: plants.filter(p => p.healthScore >= 80).length },
            { id: 'needs-attention', label: 'Needs Care', count: plants.filter(p => p.healthScore < 60).length }
          ].map(filter => (
            <motion.button
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
            </motion.button>
          ))}
        </div>

        <div className="flex space-x-2">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid'
                ? 'bg-primary text-white'
                : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
            }`}
          >
            <ApperIcon name="Grid3X3" size={16} />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list'
                ? 'bg-primary text-white'
                : 'bg-surface-100 text-surface-600 hover:bg-surface-200'
            }`}
          >
            <ApperIcon name="List" size={16} />
          </motion.button>
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
                <PlantCard plant={plant} onViewDetails={handleViewDetails} />
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
    </div>
  );
};

export default Plants;