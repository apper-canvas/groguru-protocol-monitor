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

export default TaskDot;