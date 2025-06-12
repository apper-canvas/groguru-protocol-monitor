import ApperIcon from '@/components/ApperIcon';

const CareRequirementItem = ({ icon, color, label, value }) => {
  return (
    <div>
      <div className="flex items-center space-x-2 mb-2">
        <ApperIcon name={icon} size={16} className={color} />
        <span className="text-sm font-medium text-surface-700">{label}</span>
      </div>
      <p className="text-sm text-surface-600">{value}</p>
    </div>
  );
};

export default CareRequirementItem;