import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import HealthRing from '@/components/molecules/HealthRing';
import WeatherDisplay from '@/components/organisms/WeatherDisplay';
import TaskItem from '@/components/molecules/TaskItem';
import QuickActionCard from '@/components/molecules/QuickActionCard';
import Card from '@/components/molecules/Card';

import { plantService } from '@/services'; // Ensure this path is correct

const DashboardContent = () => {
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
            <Card key={i} className="animate-pulse bg-surface-50 p-4 shadow-sm">
              <div className="w-20 h-20 bg-surface-200 rounded-full mx-auto mb-2"></div>
              <div className="h-4 bg-surface-200 rounded w-3/4 mx-auto"></div>
            </Card>
          ))}
        </div>

        {/* Tasks skeleton */}
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse bg-surface-50 p-4 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-surface-200 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-surface-200 rounded w-3/4"></div>
                  <div className="h-3 bg-surface-200 rounded w-1/2"></div>
                </div>
              </div>
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
        <h3 className="text-lg font-semibold text-surface-800 mb-2">Something went wrong</h3>
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
        <Button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/add-plant')}
          className="px-6 py-3 bg-accent text-white rounded-xl font-medium hover:bg-accent/90 transition-colors"
        >
          Add Your First Plant
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-full overflow-hidden p-6 space-y-6">
      {/* Weather Widget */}
      <WeatherDisplay weather={weather} />

      {/* Health Overview */}
      <Card>
        <h2 className="font-heading text-xl font-semibold text-surface-800 mb-4">Garden Health</h2>
        <div className="grid grid-cols-3 gap-4">
          <HealthRing 
            value={getOverallHealth()} 
            label="Overall Health" 
            color="#4CAF50" 
          />
          <HealthRing 
            value={85} 
            label="Water Level" 
            color="#29B6F6" 
          />
          <HealthRing 
            value={92} 
            label="Light Exposure" 
            color="#FFA726" 
          />
        </div>
      </Card>

      {/* Today's Tasks */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-xl font-semibold text-surface-800">Today's Tasks</h2>
          <span className="text-sm text-surface-600">{tasks.length} pending</span>
        </div>
        
        <AnimatePresence>
          {tasks.length > 0 ? (
            <div className="space-y-3">
              {tasks.map(task => (
                <TaskItem
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
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <QuickActionCard
          icon="Search"
          title="Quick Diagnose"
          description="Identify plant issues"
          onClick={() => navigate('/diagnose')}
        />

        <QuickActionCard
          icon="Plus"
          title="Add Plant"
          description="Expand your garden"
          onClick={() => navigate('/add-plant')}
        />
      </div>
    </div>
  );
};

export default DashboardContent;