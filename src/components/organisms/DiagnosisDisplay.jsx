import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Card from '@/components/molecules/Card';

const DiagnosisDisplay = ({ diagnosis, onNewDiagnosis }) => {
  if (!diagnosis) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Diagnosis Summary */}
      <Card className="p-6 shadow-sm">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-accent/10 rounded-xl">
            <ApperIcon name="Stethoscope" size={24} className="text-accent" />
          </div>
          <div className="flex-1">
            <h3 className="font-heading text-lg font-semibold text-surface-800 mb-2">
              Diagnosis
            </h3>
            <p className="text-surface-700 mb-4">{diagnosis.issue}</p>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-surface-600">Confidence:</span>
              <div className="flex-1 bg-surface-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${diagnosis.confidence}%` }}
                  transition={{ delay: 0.5, duration: 1 }}
                  className="bg-secondary h-2 rounded-full"
                />
              </div>
              <span className="text-sm font-medium text-surface-800">{diagnosis.confidence}%</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Causes */}
      <Card className="p-6 shadow-sm">
        <h4 className="font-heading text-lg font-semibold text-surface-800 mb-4">Possible Causes</h4>
        <div className="space-y-3">
          {diagnosis.causes.map((cause, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-start space-x-3 p-3 bg-surface-50 rounded-xl"
            >
              <ApperIcon name="Info" size={16} className="text-semantic-info mt-0.5" />
              <span className="text-sm text-surface-700">{cause}</span>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Treatment Steps */}
      <Card className="p-6 shadow-sm">
        <h4 className="font-heading text-lg font-semibold text-surface-800 mb-4">Treatment Steps</h4>
        <div className="space-y-4">
          {diagnosis.treatments.map((treatment, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="flex items-start space-x-4 p-4 border border-surface-200 rounded-xl"
            >
              <div className="flex items-center justify-center w-8 h-8 bg-primary text-white rounded-full text-sm font-semibold">
                {index + 1}
              </div>
              <div className="flex-1">
                <h5 className="font-medium text-surface-800 mb-1">{treatment.title}</h5>
                <p className="text-sm text-surface-600 mb-2">{treatment.description}</p>
                {treatment.urgency && (
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    treatment.urgency === 'high' 
                      ? 'bg-semantic-error/10 text-semantic-error'
                      : treatment.urgency === 'medium'
                      ? 'bg-semantic-warning/10 text-semantic-warning'
                      : 'bg-semantic-info/10 text-semantic-info'
                  }`}>
                    {treatment.urgency} priority
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Actions */}
      <div className="flex space-x-4">
        <Button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNewDiagnosis}
          className="flex-1 bg-surface-100 text-surface-700 py-3 px-6 rounded-xl font-medium hover:bg-surface-200 transition-colors"
        >
          New Diagnosis
        </Button>
      </div>
    </motion.div>
  );
};

export default DiagnosisDisplay;