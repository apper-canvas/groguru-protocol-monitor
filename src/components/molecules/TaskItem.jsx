import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const TaskItem = ({ task, onComplete, onSkip }) => {
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
            {task.timeAgo && <p className="text-xs text-surface-500">{task.timeAgo}</p>}
            {task.notes && <p className="text-xs text-surface-500 mt-1">{task.notes}</p>}
          </div>
        </div>
        <div className="flex space-x-2">
          <Button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSkip(task.id)}
            className="p-2 rounded-lg bg-surface-100 text-surface-600 hover:bg-surface-200 transition-colors"
          >
            <ApperIcon name="Clock" size={16} />
          </Button>
          <Button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onComplete(task.id)}
            className="p-2 rounded-lg bg-secondary text-white hover:bg-secondary/90 transition-colors"
          >
            <ApperIcon name="Check" size={16} />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskItem;