import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addMonths, subMonths } from 'date-fns';
import ApperIcon from '../components/ApperIcon';
import { plantService } from '../services';

const TaskDot = ({ type, count }) => {
  const getColor = (type) => {
    switch (type) {
      case 'water': return 'bg-blue-500';
      case 'fertilize': return 'bg-green-500';
      case 'prune': return 'bg-orange-500';
      case 'repot': return 'bg-purple-500';
      default: return 'bg-surface-400';
    }
  };

  return (
    <div className={`w-2 h-2 rounded-full ${getColor(type)} ${count > 1 ? 'ring-1 ring-white' : ''}`} />
  );
};

const CalendarDay = ({ date, tasks, isSelected, isCurrentMonth, onClick }) => {
  const dayTasks = tasks.filter(task => isSameDay(new Date(task.scheduledDate), date));
  const tasksByType = dayTasks.reduce((acc, task) => {
    acc[task.type] = (acc[task.type] || 0) + 1;
    return acc;
  }, {});

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onClick(date)}
      className={`
        aspect-square p-2 rounded-lg text-sm font-medium transition-colors relative
        ${isSelected ? 'bg-primary text-white' : ''}
        ${isToday(date) && !isSelected ? 'bg-accent/20 text-accent' : ''}
        ${!isCurrentMonth ? 'text-surface-400' : 'text-surface-800'}
        ${dayTasks.length > 0 && !isSelected ? 'bg-surface-100' : ''}
        hover:bg-primary/10
      `}
    >
      {format(date, 'd')}
      {dayTasks.length > 0 && (
        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-1">
          {Object.entries(tasksByType).slice(0, 3).map(([type, count]) => (
            <TaskDot key={type} type={type} count={count} />
          ))}
        </div>
      )}
    </motion.button>
  );
};

const TaskList = ({ tasks, onCompleteTask, onSkipTask }) => {
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

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8">
        <ApperIcon name="Calendar" size={48} className="text-surface-400 mx-auto mb-3" />
        <p className="text-surface-600">No tasks for this day</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map(task => (
        <motion.div
          key={task.id}
          layout
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
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
                {task.notes && (
                  <p className="text-xs text-surface-500 mt-1">{task.notes}</p>
                )}
              </div>
            </div>
            <div className="flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onSkipTask(task.id)}
                className="p-2 rounded-lg bg-surface-100 text-surface-600 hover:bg-surface-200 transition-colors"
              >
                <ApperIcon name="Clock" size={16} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onCompleteTask(task.id)}
                className="p-2 rounded-lg bg-secondary text-white hover:bg-secondary/90 transition-colors"
              >
                <ApperIcon name="Check" size={16} />
              </motion.button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('month');

  useEffect(() => {
    const loadTasks = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await plantService.getCalendarTasks(currentDate);
        setTasks(data);
      } catch (err) {
        setError(err.message || 'Failed to load calendar data');
        toast.error('Failed to load calendar data');
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, [currentDate]);

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

  const navigateMonth = (direction) => {
    setCurrentDate(prev => direction === 'next' ? addMonths(prev, 1) : subMonths(prev, 1));
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const selectedDayTasks = tasks.filter(task => isSameDay(new Date(task.scheduledDate), selectedDate));

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
          <div className="flex space-x-2">
            <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-2 mb-6">
          {[...Array(35)].map((_, i) => (
            <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
        <ApperIcon name="AlertCircle" size={48} className="text-semantic-error mb-4" />
        <h3 className="text-lg font-semibold text-surface-800 mb-2">Failed to load calendar</h3>
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

  return (
    <div className="max-w-full overflow-hidden p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-surface-800">Care Calendar</h1>
        <div className="flex items-center space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigateMonth('previous')}
            className="p-2 rounded-lg bg-surface-100 text-surface-600 hover:bg-surface-200 transition-colors"
          >
            <ApperIcon name="ChevronLeft" size={20} />
          </motion.button>
          <h2 className="font-semibold text-lg text-surface-800 min-w-[140px] text-center">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigateMonth('next')}
            className="p-2 rounded-lg bg-surface-100 text-surface-600 hover:bg-surface-200 transition-colors"
          >
            <ApperIcon name="ChevronRight" size={20} />
          </motion.button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-sm font-medium text-surface-600 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map(date => (
            <CalendarDay
              key={date.toISOString()}
              date={date}
              tasks={tasks}
              isSelected={isSameDay(date, selectedDate)}
              isCurrentMonth={true}
              onClick={setSelectedDate}
            />
          ))}
        </div>
      </div>

      {/* Selected Day Tasks */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading text-lg font-semibold text-surface-800">
            {isToday(selectedDate) ? 'Today' : format(selectedDate, 'EEEE, MMMM d')}
          </h3>
          <span className="text-sm text-surface-600">
            {selectedDayTasks.length} task{selectedDayTasks.length !== 1 ? 's' : ''}
          </span>
        </div>

        <AnimatePresence>
          <TaskList
            tasks={selectedDayTasks}
            onCompleteTask={handleCompleteTask}
            onSkipTask={handleSkipTask}
          />
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Calendar;