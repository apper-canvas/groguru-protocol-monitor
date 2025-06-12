const StatCard = ({ value, label, colorClass }) => {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm text-center">
      <div className={`text-2xl font-bold ${colorClass || 'text-surface-800'} mb-1`}>{value}</div>
      <div className="text-xs text-surface-600">{label}</div>
    </div>
  );
};

export default StatCard;