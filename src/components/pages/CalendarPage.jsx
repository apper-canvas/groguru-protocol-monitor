import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addMonths, subMonths } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import CalendarDayCell from '@/components/molecules/CalendarDayCell';
import DailyTaskList from '@/components/organisms/DailyTaskList';
import Card from '@/components/molecules/Card';

import { plantService } from '@/services';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const [showReminderModal, setShowReminderModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [reminderTime, setReminderTime] = useState(new Date());

  const handleSetReminder = async (task) => {
    setSelectedTask(task);
    setReminderTime(task.reminderTime ? new Date(task.reminderTime) : new Date());
    setShowReminderModal(true);
  };

  const handleSaveReminder = async () => {
    if (!selectedTask) return;
    
    try {
      // Request notification permission if not granted
      if (Notification.permission === 'default') {
        await Notification.requestPermission();
      }
      
      if (Notification.permission === 'granted') {
        // Update task with reminder
        const updatedTask = {
          ...selectedTask,
          reminderTime: reminderTime.toISOString(),
          reminderEnabled: true,
          reminderSent: false
        };
        
        await plantService.updateTask(selectedTask.id, updatedTask);
        
        // Schedule notification
        const timeUntilReminder = reminderTime.getTime() - Date.now();
        if (timeUntilReminder > 0) {
          setTimeout(() => {
            new Notification(`Plant Care Reminder`, {
              body: `Time to ${selectedTask.title}`,
              icon: '/favicon.ico'
            });
          }, timeUntilReminder);
        }
        
        // Update local state
        setTasks(prev => prev.map(t => t.id === selectedTask.id ? updatedTask : t));
        toast.success('Reminder set successfully!');
      } else {
        toast.error('Please enable notifications to set reminders');
      }
      
      setShowReminderModal(false);
      setSelectedTask(null);
    } catch (err) {
      toast.error('Failed to set reminder');
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
          <div className="h-8 bg-surface-200 rounded w-32 animate-pulse"></div>
          <div className="flex space-x-2">
            <div className="h-8 w-8 bg-surface-200 rounded animate-pulse"></div>
            <div className="h-8 w-8 bg-surface-200 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-2 mb-6">
          {[...Array(35)].map((_, i) => (
            <div key={i} className="aspect-square bg-surface-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="h-20 bg-surface-200 rounded-xl animate-pulse"></Card>
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

  return (
<div className="max-w-full overflow-hidden p-6">
      {/* Header with Current Date */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-surface-800">Care Calendar</h1>
          <p className="text-surface-600 text-sm mt-1">
            Today: {format(new Date(), 'EEEE, MMMM d, yyyy')}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigateMonth('previous')}
            className="p-2 rounded-lg bg-surface-100 text-surface-600 hover:bg-surface-200 transition-colors"
          >
            <ApperIcon name="ChevronLeft" size={20} />
          </Button>
          <h2 className="font-semibold text-lg text-surface-800 min-w-[140px] text-center">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <Button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigateMonth('next')}
            className="p-2 rounded-lg bg-surface-100 text-surface-600 hover:bg-surface-200 transition-colors"
          >
            <ApperIcon name="ChevronRight" size={20} />
          </Button>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compact Calendar */}
        <Card className="p-3 shadow-sm">
          <h3 className="font-semibold text-surface-800 mb-3">Calendar</h3>
          
          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-xs font-medium text-surface-600 py-1">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days - more compact */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map(date => (
              <CalendarDayCell
                key={date.toISOString()}
                date={date}
                tasks={tasks}
                isSelected={isSameDay(date, selectedDate)}
                isCurrentMonth={true}
                onClick={setSelectedDate}
              />
            ))}
          </div>
        </Card>

        {/* Daily Tasks for Selected Date */}
        <Card className="p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-surface-800">
              Tasks for {format(selectedDate, 'MMMM d')}
              {isToday(selectedDate) && <span className="text-primary-600 ml-1">(Today)</span>}
            </h3>
            <Button
              onClick={() => toast.info('Add task feature coming soon')}
              className="text-sm bg-primary-600 text-white hover:bg-primary-700 px-3 py-1"
            >
              <ApperIcon name="Plus" size={16} className="mr-1" />
              Add Task
            </Button>
          </div>
          
<DailyTaskList
            tasks={selectedDayTasks}
            onCompleteTask={handleCompleteTask}
            onSkipTask={handleSkipTask}
            onSetReminder={handleSetReminder}
          />
        </Card>
      </div>

      {/* Reminder Modal */}
      <AnimatePresence>
        {showReminderModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowReminderModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 m-4 max-w-md w-full"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-surface-900">
                  Set Reminder
                </h3>
                <Button
                  onClick={() => setShowReminderModal(false)}
                  className="p-2 hover:bg-surface-100 rounded-lg transition-colors"
                >
                  <ApperIcon name="X" size={20} />
                </Button>
              </div>
              
              <div className="mb-4">
                <p className="text-surface-600 mb-2">Task: {selectedTask?.title}</p>
                <label className="block text-sm font-medium text-surface-700 mb-2">
                  Reminder Time
                </label>
                <DatePicker
                  selected={reminderTime}
                  onChange={setReminderTime}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="MMMM d, yyyy h:mm aa"
                  className="w-full p-3 border border-surface-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  minDate={new Date()}
                />
              </div>
              
              <div className="flex space-x-3">
                <Button
                  onClick={() => setShowReminderModal(false)}
                  className="flex-1 p-3 bg-surface-100 text-surface-700 rounded-lg hover:bg-surface-200 transition-colors"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveReminder}
                  className="flex-1 p-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Set Reminder
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
</div>
  );
};

export default CalendarPage;