import ApperIcon from '@/components/ApperIcon';
import { format, parseISO } from 'date-fns';

const CareLogItem = ({ icon, color, action, date }) => {
  return (
    <div className="flex items-center justify-between p-3 bg-surface-50 rounded-lg">
      <div className="flex items-center space-x-3">
        <ApperIcon name={icon} size={20} className={color} />
        <span className="font-medium text-surface-800">{action}</span>
      </div>
      <span className="text-sm text-surface-600">
        {date ? format(parseISO(date), 'MMM d') : 'Never'}
      </span>
    </div>
  );
};

export default CareLogItem;