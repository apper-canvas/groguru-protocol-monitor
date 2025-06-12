import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const WeatherDisplay = ({ weather }) => {
  if (!weather) return null;

  const getWeatherIcon = (condition) => {
    switch (condition?.toLowerCase()) {
      case 'sunny': return 'Sun';
      case 'cloudy': return 'Cloud';
      case 'rainy': return 'CloudRain';
      case 'stormy': return 'CloudLightning';
      default: return 'Sun';
    }
  };

  const getWeatherGradient = (condition) => {
    switch (condition?.toLowerCase()) {
      case 'sunny': return 'from-yellow-400 to-orange-400';
      case 'cloudy': return 'from-gray-400 to-gray-500';
      case 'rainy': return 'from-blue-400 to-blue-600';
      case 'stormy': return 'from-purple-500 to-indigo-600';
      default: return 'from-yellow-400 to-orange-400';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-r ${getWeatherGradient(weather.condition)} p-4 rounded-2xl text-white`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-heading text-lg font-semibold">Today's Weather</h3>
          <p className="text-sm opacity-90">{weather.location}</p>
        </div>
        <ApperIcon name={getWeatherIcon(weather.condition)} size={32} />
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div>
          <span className="text-2xl font-bold">{weather.temperature}°</span>
          <span className="text-sm ml-2 opacity-90">{weather.condition}</span>
        </div>
        <div className="text-right text-sm">
          <div>Humidity: {weather.humidity}%</div>
          <div>Sun: {weather.sunlightHours}h</div>
        </div>
      </div>
      {weather.frostRisk && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="mt-2 bg-white/20 rounded-lg p-2 flex items-center"
        >
          <ApperIcon name="AlertTriangle" size={16} className="mr-2" />
          <span className="text-sm">Frost risk tonight</span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default WeatherDisplay;