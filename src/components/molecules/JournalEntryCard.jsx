import { motion } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Card from '@/components/molecules/Card';

const JournalEntryCard = ({ entry, onEdit, onDelete }) => {
  const getTypeIcon = (type) => {
    switch (type) {
      case 'milestone': return 'Star';
      case 'problem': return 'AlertTriangle';
      case 'harvest': return 'Scissors';
      case 'note': return 'FileText';
      case 'photo': return 'Camera';
      default: return 'Circle';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'milestone': return 'text-yellow-500 bg-yellow-500/10';
      case 'problem': return 'text-red-500 bg-red-500/10';
      case 'harvest': return 'text-green-500 bg-green-500/10';
      case 'note': return 'text-blue-500 bg-blue-500/10';
      case 'photo': return 'text-purple-500 bg-purple-500/10';
      default: return 'text-surface-500 bg-surface-100';
    }
  };

  return (
    <Card
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-6 shadow-sm border border-surface-100"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${getTypeColor(entry.type)}`}>
            <ApperIcon name={getTypeIcon(entry.type)} size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-surface-800">{entry.title}</h3>
            <p className="text-sm text-surface-600">{entry.plantName}</p>
            <p className="text-xs text-surface-500">{format(parseISO(entry.date), 'PPP')}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onEdit(entry.id)}
            className="p-2 text-surface-400 hover:text-surface-600 transition-colors"
          >
            <ApperIcon name="Edit2" size={16} />
          </Button>
          <Button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onDelete(entry.id)}
            className="p-2 text-surface-400 hover:text-semantic-error transition-colors"
          >
            <ApperIcon name="Trash2" size={16} />
          </Button>
        </div>
      </div>

      {entry.photos && entry.photos.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mb-4">
          {entry.photos.slice(0, 4).map((photo, index) => (
            <div key={index} className="aspect-square rounded-lg overflow-hidden bg-surface-100">
              <img
                src={photo.url}
                alt={`Entry photo ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {entry.notes && (
        <p className="text-surface-700 break-words">{entry.notes}</p>
      )}

      {entry.measurements && (
        <div className="mt-4 grid grid-cols-3 gap-4 p-3 bg-surface-50 rounded-lg">
          {entry.measurements.height && (
            <div className="text-center">
              <p className="text-sm font-medium text-surface-800">{entry.measurements.height}cm</p>
              <p className="text-xs text-surface-600">Height</p>
            </div>
          )}
          {entry.measurements.width && (
            <div className="text-center">
              <p className="text-sm font-medium text-surface-800">{entry.measurements.width}cm</p>
              <p className="text-xs text-surface-600">Width</p>
            </div>
          )}
          {entry.measurements.leaves && (
            <div className="text-center">
              <p className="text-sm font-medium text-surface-800">{entry.measurements.leaves}</p>
              <p className="text-xs text-surface-600">Leaves</p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

export default JournalEntryCard;