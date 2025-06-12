import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { format, parseISO } from 'date-fns';
import ApperIcon from '../components/ApperIcon';
import { plantService } from '../services';

const PlantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plant, setPlant] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPlant = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await plantService.getById(id);
        setPlant(data);
      } catch (err) {
        setError(err.message || 'Failed to load plant details');
        toast.error('Failed to load plant details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadPlant();
    }
  }, [id]);

  const handleWaterPlant = async () => {
    try {
      await plantService.waterPlant(id);
      setPlant(prev => ({
        ...prev,
        lastWatered: new Date().toISOString(),
        waterLevel: Math.min(100, prev.waterLevel + 30)
      }));
      toast.success('Plant watered!');
    } catch (err) {
      toast.error('Failed to water plant');
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'Info' },
    { id: 'care', label: 'Care', icon: 'Heart' },
    { id: 'history', label: 'History', icon: 'Clock' },
    { id: 'stats', label: 'Stats', icon: 'TrendingUp' }
  ];

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-48 bg-gray-200 rounded-2xl mb-6"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !plant) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
        <ApperIcon name="AlertCircle" size={48} className="text-semantic-error mb-4" />
        <h3 className="text-lg font-semibold text-surface-800 mb-2">Plant not found</h3>
        <p className="text-surface-600 text-center mb-4">{error || 'This plant does not exist'}</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/plants')}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Back to Plants
        </motion.button>
      </div>
    );
  }

  return (
    <div className="max-w-full overflow-hidden">
      {/* Header */}
      <div className="relative">
        <div className="h-48 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-b-2xl">
          {plant.photos && plant.photos.length > 0 ? (
            <img
              src={plant.photos[0].url}
              alt={plant.nickname}
              className="w-full h-full object-cover rounded-b-2xl"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ApperIcon name="Leaf" size={64} className="text-surface-400" />
            </div>
          )}
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/plants')}
          className="absolute top-4 left-4 p-2 bg-white/90 rounded-lg shadow-sm"
        >
          <ApperIcon name="ArrowLeft" size={20} className="text-surface-800" />
        </motion.button>

        <div className="absolute bottom-4 right-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleWaterPlant}
            className="p-3 bg-blue-500 text-white rounded-xl shadow-lg hover:bg-blue-600 transition-colors"
          >
            <ApperIcon name="Droplets" size={20} />
          </motion.button>
        </div>
      </div>

      <div className="p-6">
        {/* Plant Info */}
        <div className="mb-6">
          <h1 className="font-heading text-2xl font-bold text-surface-800 mb-2">{plant.nickname}</h1>
          <p className="text-lg text-surface-600 mb-1">{plant.species?.commonName}</p>
          <p className="text-sm text-surface-500 italic mb-3">{plant.species?.scientificName}</p>
          
          <div className="flex items-center space-x-4 text-sm text-surface-600">
            <div className="flex items-center space-x-1">
              <ApperIcon name="MapPin" size={16} />
              <span>{plant.location}</span>
            </div>
            <div className="flex items-center space-x-1">
              <ApperIcon name="Calendar" size={16} />
              <span>{plant.daysOld} days old</span>
            </div>
          </div>
        </div>

        {/* Health Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <div className="text-2xl font-bold text-surface-800 mb-1">{plant.healthScore}%</div>
            <div className="text-xs text-surface-600">Health</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <div className="text-2xl font-bold text-blue-500 mb-1">{plant.waterLevel}%</div>
            <div className="text-xs text-surface-600">Water</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <div className="text-2xl font-bold text-yellow-500 mb-1">{plant.lightLevel}%</div>
            <div className="text-xs text-surface-600">Light</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <div className="text-2xl font-bold text-green-500 mb-1">{plant.temperature}°</div>
            <div className="text-xs text-surface-600">Temp</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-surface-100 rounded-xl p-1">
          {tabs.map(tab => (
            <motion.button
              key={tab.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-surface-600 hover:text-surface-800'
              }`}
            >
              <ApperIcon name={tab.icon} size={16} />
              <span>{tab.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="font-semibold text-surface-800 mb-4">Care Requirements</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <ApperIcon name="Droplets" size={16} className="text-blue-500" />
                        <span className="text-sm font-medium text-surface-700">Watering</span>
                      </div>
                      <p className="text-sm text-surface-600">{plant.species?.careProfile?.watering || 'Moderate'}</p>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <ApperIcon name="Sun" size={16} className="text-yellow-500" />
                        <span className="text-sm font-medium text-surface-700">Light</span>
                      </div>
                      <p className="text-sm text-surface-600">{plant.species?.careProfile?.light || 'Bright indirect'}</p>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <ApperIcon name="Thermometer" size={16} className="text-green-500" />
                        <span className="text-sm font-medium text-surface-700">Temperature</span>
                      </div>
                      <p className="text-sm text-surface-600">{plant.species?.careProfile?.temperature || '18-24°C'}</p>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <ApperIcon name="Droplet" size={16} className="text-blue-400" />
                        <span className="text-sm font-medium text-surface-700">Humidity</span>
                      </div>
                      <p className="text-sm text-surface-600">{plant.species?.careProfile?.humidity || '40-60%'}</p>
                    </div>
                  </div>
                </div>

                {plant.species?.companionPlants && plant.species.companionPlants.length > 0 && (
                  <div className="bg-white rounded-2xl p-6 shadow-sm">
                    <h3 className="font-semibold text-surface-800 mb-4">Companion Plants</h3>
                    <div className="flex flex-wrap gap-2">
                      {plant.species.companionPlants.map((companion, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm font-medium"
                        >
                          {companion}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'care' && (
              <div className="space-y-4">
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="font-semibold text-surface-800 mb-4">Recent Care</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-surface-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <ApperIcon name="Droplets" size={20} className="text-blue-500" />
                        <span className="font-medium text-surface-800">Last watered</span>
                      </div>
                      <span className="text-sm text-surface-600">
                        {plant.lastWatered ? format(parseISO(plant.lastWatered), 'MMM d') : 'Never'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-surface-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <ApperIcon name="Sprout" size={20} className="text-green-500" />
                        <span className="font-medium text-surface-800">Last fertilized</span>
                      </div>
                      <span className="text-sm text-surface-600">
                        {plant.lastFertilized ? format(parseISO(plant.lastFertilized), 'MMM d') : 'Never'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-semibold text-surface-800 mb-4">Care History</h3>
                <div className="space-y-3">
                  {plant.careHistory && plant.careHistory.length > 0 ? (
                    plant.careHistory.map((event, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-surface-50 rounded-lg">
                        <ApperIcon name={event.icon} size={16} className={event.color} />
                        <div className="flex-1">
                          <p className="font-medium text-surface-800">{event.action}</p>
                          <p className="text-sm text-surface-600">{format(parseISO(event.date), 'PPP')}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-surface-600 text-center py-8">No care history yet</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'stats' && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="font-semibold text-surface-800 mb-4">Growth Statistics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-surface-50 rounded-lg">
                    <div className="text-2xl font-bold text-surface-800 mb-1">
                      {plant.stats?.totalWaterings || 0}
                    </div>
                    <div className="text-sm text-surface-600">Times watered</div>
                  </div>
                  <div className="text-center p-4 bg-surface-50 rounded-lg">
                    <div className="text-2xl font-bold text-surface-800 mb-1">
                      {plant.stats?.growthRate || 0}%
                    </div>
                    <div className="text-sm text-surface-600">Growth this month</div>
                  </div>
                  <div className="text-center p-4 bg-surface-50 rounded-lg">
                    <div className="text-2xl font-bold text-surface-800 mb-1">
                      {plant.stats?.healthTrend || '+5'}
                    </div>
                    <div className="text-sm text-surface-600">Health trend</div>
                  </div>
                  <div className="text-center p-4 bg-surface-50 rounded-lg">
                    <div className="text-2xl font-bold text-surface-800 mb-1">
                      {plant.stats?.journalEntries || 0}
                    </div>
                    <div className="text-sm text-surface-600">Journal entries</div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PlantDetail;