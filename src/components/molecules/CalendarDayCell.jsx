import { motion } from 'framer-motion';
import { format, isSameDay, isToday } from 'date-fns';
import TaskDot from '@/components/atoms/TaskDot';

const CalendarDayCell = ({ date, tasks, isSelected, isCurrentMonth, onClick }) => {
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

export default CalendarDayCell;