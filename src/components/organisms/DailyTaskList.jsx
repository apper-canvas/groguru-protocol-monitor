import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import TaskItem from '@/components/molecules/TaskItem';

const DailyTaskList = ({ tasks, onCompleteTask, onSkipTask }) => {
  if (tasks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-8"
      >
        <ApperIcon name="Calendar" size={48} className="text-surface-400 mx-auto mb-3" />
        <p className="text-surface-600">No tasks for this day</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence>
        {tasks.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            onComplete={onCompleteTask}
            onSkip={onSkipTask}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default DailyTaskList;