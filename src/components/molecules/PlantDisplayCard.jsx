import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const PlantDisplayCard = ({ plant, onViewDetails }) => {
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

export default PlantDisplayCard;