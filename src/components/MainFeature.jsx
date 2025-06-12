import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from './ApperIcon';
import { plantService } from '../services';

const PlantHealthRing = ({ value, label, color, size = 80 }) => {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth="4"
            fill="transparent"
            className="text-surface-200"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth="4"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="health-ring"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-semibold text-surface-800">{value}%</span>
        </div>
      </div>
      <span className="text-sm text-surface-600 mt-2">{label}</span>
    </div>
  );
};

const WeatherWidget = ({ weather }) => {
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

const TaskCard = ({ task, onComplete, onSkip }) => {
  const getTaskIcon = (type) => {
    switch (type) {
      case 'water': return 'Droplets';
      case 'fertilize': return 'Sprout';
      case 'prune': return 'Scissors';
      case 'repot': return 'Package';
      default: return 'CheckCircle';
    }
  };

  const getTaskColor = (type) => {
    switch (type) {
      case 'water': return 'text-blue-500';
      case 'fertilize': return 'text-green-500';
      case 'prune': return 'text-orange-500';
      case 'repot': return 'text-purple-500';
      default: return 'text-surface-600';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl p-4 shadow-sm border border-surface-100"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg bg-surface-100 ${getTaskColor(task.type)}`}>
            <ApperIcon name={getTaskIcon(task.type)} size={20} />
          </div>
          <div>
            <h4 className="font-medium text-surface-800">{task.title}</h4>
            <p className="text-sm text-surface-600">{task.plantName}</p>
            <p className="text-xs text-surface-500">{task.timeAgo}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSkip(task.id)}
            className="p-2 rounded-lg bg-surface-100 text-surface-600 hover:bg-surface-200 transition-colors"
          >
            <ApperIcon name="Clock" size={16} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onComplete(task.id)}
            className="p-2 rounded-lg bg-secondary text-white hover:bg-secondary/90 transition-colors"
          >
            <ApperIcon name="Check" size={16} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const MainFeature = () => {
  const [plants, setPlants] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [plantsData, tasksData, weatherData] = await Promise.all([
          plantService.getAll(),
          plantService.getTodaysTasks(),
          plantService.getWeatherData()
        ]);
        setPlants(plantsData);
        setTasks(tasksData);
        setWeather(weatherData);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data');
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const handleCompleteTask = async (taskId) => {
    try {
      await plantService.completeTask(taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));
      toast.success('Task completed!');
    } catch (err) {
      toast.error('Failed to complete task');
    }
  };

  const handleSkipTask = async (taskId) => {
    try {
      await plantService.skipTask(taskId);
      setTasks(prev => prev.filter(task => task.id !== taskId));
      toast.success('Task skipped');
    } catch (err) {
      toast.error('Failed to skip task');
    }
  };

  const getOverallHealth = () => {
    if (plants.length === 0) return 0;
    const totalHealth = plants.reduce((sum, plant) => sum + plant.healthScore, 0);
    return Math.round(totalHealth / plants.length);
  };

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        {/* Weather skeleton */}
        <div className="animate-pulse bg-gradient-to-r from-gray-200 to-gray-300 h-32 rounded-2xl"></div>
        
        {/* Health rings skeleton */}
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse bg-white rounded-xl p-4 shadow-sm">
              <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
            </div>
          ))}
        </div>

        {/* Tasks skeleton */}
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
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
        <h3 className="text-lg font-semibold text-surface-800 mb-2">Something went wrong</h3>
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
        <h3 className="text-xl font-heading font-semibold text-surface-800 mb-2">Start Your Garden</h3>
        <p className="text-surface-600 text-center mb-6">Add your first plant to begin your gardening journey</p>
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
    <div className="max-w-full overflow-hidden p-6 space-y-6">
      {/* Weather Widget */}
      <WeatherWidget weather={weather} />

      {/* Health Overview */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h2 className="font-heading text-xl font-semibold text-surface-800 mb-4">Garden Health</h2>
        <div className="grid grid-cols-3 gap-4">
          <PlantHealthRing 
            value={getOverallHealth()} 
            label="Overall Health" 
            color="#4CAF50" 
          />
          <PlantHealthRing 
            value={85} 
            label="Water Level" 
            color="#29B6F6" 
          />
          <PlantHealthRing 
            value={92} 
            label="Light Exposure" 
            color="#FFA726" 
          />
        </div>
      </div>

      {/* Today's Tasks */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-xl font-semibold text-surface-800">Today's Tasks</h2>
          <span className="text-sm text-surface-600">{tasks.length} pending</span>
        </div>
        
        <AnimatePresence>
          {tasks.length > 0 ? (
            <div className="space-y-3">
              {tasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onComplete={handleCompleteTask}
                  onSkip={handleSkipTask}
                />
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <ApperIcon name="CheckCircle" size={48} className="text-secondary mx-auto mb-3" />
              <p className="text-surface-600">All caught up! No tasks for today.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/diagnose')}
          className="bg-white rounded-xl p-6 shadow-sm border border-surface-100 text-left"
        >
          <div className="p-3 bg-accent/10 rounded-lg inline-block mb-3">
            <ApperIcon name="Search" size={24} className="text-accent" />
          </div>
          <h3 className="font-medium text-surface-800 mb-1">Quick Diagnose</h3>
          <p className="text-sm text-surface-600">Identify plant issues</p>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/add-plant')}
          className="bg-white rounded-xl p-6 shadow-sm border border-surface-100 text-left"
        >
          <div className="p-3 bg-secondary/10 rounded-lg inline-block mb-3">
            <ApperIcon name="Plus" size={24} className="text-secondary" />
          </div>
          <h3 className="font-medium text-surface-800 mb-1">Add Plant</h3>
          <p className="text-sm text-surface-600">Expand your garden</p>
        </motion.button>
      </div>
    </div>
  );
};

export default MainFeature;