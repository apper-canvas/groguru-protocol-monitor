import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import StatCard from '@/components/molecules/StatCard';
import CareRequirementItem from '@/components/molecules/CareRequirementItem';
import CareLogItem from '@/components/molecules/CareLogItem';
import Card from '@/components/molecules/Card';

const PlantDetailInfo = ({ plant, onWaterPlant }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'Info' },
    { id: 'care', label: 'Care', icon: 'Heart' },
    { id: 'history', label: 'History', icon: 'Clock' },
    { id: 'stats', label: 'Stats', icon: 'TrendingUp' }
  ];

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
        
        <Button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/plants')}
          className="absolute top-4 left-4 p-2 bg-white/90 rounded-lg shadow-sm"
        >
          <ApperIcon name="ArrowLeft" size={20} className="text-surface-800" />
        </Button>

        <div className="absolute bottom-4 right-4">
          <Button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onWaterPlant}
            className="p-3 bg-blue-500 text-white rounded-xl shadow-lg hover:bg-blue-600 transition-colors"
          >
            <ApperIcon name="Droplets" size={20} />
          </Button>
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
          <StatCard value={`${plant.healthScore}%`} label="Health" colorClass="text-surface-800" />
          <StatCard value={`${plant.waterLevel}%`} label="Water" colorClass="text-blue-500" />
          <StatCard value={`${plant.lightLevel}%`} label="Light" colorClass="text-yellow-500" />
          <StatCard value={`${plant.temperature}°`} label="Temp" colorClass="text-green-500" />
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-surface-100 rounded-xl p-1">
          {tabs.map(tab => (
            <Button
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
            </Button>
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
                <Card>
                  <h3 className="font-semibold text-surface-800 mb-4">Care Requirements</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <CareRequirementItem
                      icon="Droplets"
                      color="text-blue-500"
                      label="Watering"
                      value={plant.species?.careProfile?.watering || 'Moderate'}
                    />
                    <CareRequirementItem
                      icon="Sun"
                      color="text-yellow-500"
                      label="Light"
                      value={plant.species?.careProfile?.light || 'Bright indirect'}
                    />
                    <CareRequirementItem
                      icon="Thermometer"
                      color="text-green-500"
                      label="Temperature"
                      value={plant.species?.careProfile?.temperature || '18-24°C'}
                    />
                    <CareRequirementItem
                      icon="Droplet"
                      color="text-blue-400"
                      label="Humidity"
                      value={plant.species?.careProfile?.humidity || '40-60%'}
                    />
                  </div>
                </Card>

                {plant.species?.companionPlants && plant.species.companionPlants.length > 0 && (
                  <Card>
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
                  </Card>
                )}
              </div>
            )}

            {activeTab === 'care' && (
              <div className="space-y-4">
                <Card>
                  <h3 className="font-semibold text-surface-800 mb-4">Recent Care</h3>
                  <div className="space-y-3">
                    <CareLogItem
                      icon="Droplets"
                      color="text-blue-500"
                      action="Last watered"
                      date={plant.lastWatered}
                    />
                    <CareLogItem
                      icon="Sprout"
                      color="text-green-500"
                      action="Last fertilized"
                      date={plant.lastFertilized}
                    />
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'history' && (
              <Card>
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
              </Card>
            )}

            {activeTab === 'stats' && (
              <Card>
                <h3 className="font-semibold text-surface-800 mb-4">Growth Statistics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <StatCard value={plant.stats?.totalWaterings || 0} label="Times watered" />
                  <StatCard value={`${plant.stats?.growthRate || 0}%`} label="Growth this month" />
                  <StatCard value={plant.stats?.healthTrend || '+5'} label="Health trend" />
                  <StatCard value={plant.stats?.journalEntries || 0} label="Journal entries" />
                </div>
              </Card>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PlantDetailInfo;