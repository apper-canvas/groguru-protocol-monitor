import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import { plantService } from '../services';

const CameraCapture = ({ onCapture, onCancel }) => {
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onCapture({
          file,
          preview: e.target.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
    >
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
        <h3 className="font-heading text-lg font-semibold text-surface-800 mb-4 text-center">
          Capture Plant Photo
        </h3>
        
        <div className="space-y-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => fileInputRef.current?.click()}
            className="w-full bg-primary text-white py-4 px-6 rounded-xl font-medium hover:bg-primary/90 transition-colors flex items-center justify-center space-x-2"
          >
            <ApperIcon name="Camera" size={20} />
            <span>Take Photo</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => fileInputRef.current?.click()}
            className="w-full bg-surface-100 text-surface-700 py-4 px-6 rounded-xl font-medium hover:bg-surface-200 transition-colors flex items-center justify-center space-x-2"
          >
            <ApperIcon name="Image" size={20} />
            <span>Choose from Gallery</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onCancel}
            className="w-full text-surface-600 py-2 px-6 rounded-xl font-medium hover:bg-surface-100 transition-colors"
          >
            Cancel
          </motion.button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </motion.div>
  );
};

const SymptomSelector = ({ onSelect, onSkip }) => {
  const symptoms = [
    { id: 'yellowing', label: 'Yellowing leaves', icon: 'Leaf' },
    { id: 'browning', label: 'Brown spots/edges', icon: 'CircleDot' },
    { id: 'wilting', label: 'Wilting/drooping', icon: 'TrendingDown' },
    { id: 'holes', label: 'Holes in leaves', icon: 'Circle' },
    { id: 'white-spots', label: 'White powdery spots', icon: 'Snowflake' },
    { id: 'pests', label: 'Visible insects/pests', icon: 'Bug' },
    { id: 'stunted', label: 'Stunted growth', icon: 'Minus' },
    { id: 'dropping', label: 'Dropping leaves', icon: 'ArrowDown' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-sm"
    >
      <h3 className="font-heading text-lg font-semibold text-surface-800 mb-4">
        What symptoms do you see?
      </h3>
      <p className="text-sm text-surface-600 mb-6">
        Select all that apply to help improve diagnosis accuracy
      </p>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {symptoms.map(symptom => (
          <motion.button
            key={symptom.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect([symptom.id])}
            className="flex items-center space-x-3 p-3 bg-surface-50 rounded-xl text-left hover:bg-surface-100 transition-colors"
          >
            <ApperIcon name={symptom.icon} size={20} className="text-accent" />
            <span className="text-sm font-medium text-surface-700">{symptom.label}</span>
          </motion.button>
        ))}
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onSkip()}
        className="w-full text-surface-600 py-2 px-4 rounded-xl font-medium hover:bg-surface-100 transition-colors"
      >
        Skip this step
      </motion.button>
    </motion.div>
  );
};

const DiagnosisResult = ({ diagnosis, onNewDiagnosis }) => {
  if (!diagnosis) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Diagnosis Summary */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
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
      </div>

      {/* Causes */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
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
      </div>

      {/* Treatment Steps */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
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
      </div>

      {/* Actions */}
      <div className="flex space-x-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onNewDiagnosis}
          className="flex-1 bg-surface-100 text-surface-700 py-3 px-6 rounded-xl font-medium hover:bg-surface-200 transition-colors"
        >
          New Diagnosis
        </motion.button>
      </div>
    </motion.div>
  );
};

const Diagnose = () => {
  const [currentStep, setCurrentStep] = useState('initial'); // initial, camera, symptoms, analyzing, result
  const [capturedImage, setCapturedImage] = useState(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [diagnosis, setDiagnosis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleStartDiagnosis = () => {
    setCurrentStep('camera');
  };

  const handleImageCapture = (image) => {
    setCapturedImage(image);
    setCurrentStep('symptoms');
  };

  const handleSymptomsSelected = async (symptoms) => {
    setSelectedSymptoms(symptoms);
    setCurrentStep('analyzing');
    setLoading(true);

    try {
      const result = await plantService.diagnosePlant({
        image: capturedImage,
        symptoms: symptoms
      });
      setDiagnosis(result);
      setCurrentStep('result');
    } catch (err) {
      toast.error('Failed to analyze plant. Please try again.');
      setCurrentStep('initial');
    } finally {
      setLoading(false);
    }
  };

  const handleSkipSymptoms = () => {
    handleSymptomsSelected([]);
  };

  const handleNewDiagnosis = () => {
    setCurrentStep('initial');
    setCapturedImage(null);
    setSelectedSymptoms([]);
    setDiagnosis(null);
  };

  return (
    <div className="max-w-full overflow-hidden p-6">
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-bold text-surface-800">Plant Diagnosis</h1>
        <p className="text-surface-600">AI-powered plant health analysis</p>
      </div>

      <AnimatePresence mode="wait">
        {currentStep === 'initial' && (
          <motion.div
            key="initial"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center space-y-6"
          >
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <motion.div
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 3,
                  ease: "easeInOut"
                }}
                className="mb-6"
              >
                <ApperIcon name="Search" size={64} className="text-accent mx-auto" />
              </motion.div>
              
              <h2 className="font-heading text-xl font-semibold text-surface-800 mb-4">
                How can I help your plant?
              </h2>
              <p className="text-surface-600 mb-8">
                Take a photo of your plant and I'll analyze any issues and provide treatment recommendations
              </p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleStartDiagnosis}
                className="w-full bg-accent text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-sm hover:bg-accent/90 transition-colors"
              >
                Start Diagnosis
              </motion.button>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-medium text-surface-800 mb-4">Tips for better results:</h3>
              <div className="space-y-3 text-left">
                <div className="flex items-center space-x-3">
                  <ApperIcon name="Camera" size={16} className="text-primary" />
                  <span className="text-sm text-surface-600">Take clear, well-lit photos</span>
                </div>
                <div className="flex items-center space-x-3">
                  <ApperIcon name="Focus" size={16} className="text-primary" />
                  <span className="text-sm text-surface-600">Focus on affected areas</span>
                </div>
                <div className="flex items-center space-x-3">
                  <ApperIcon name="Leaf" size={16} className="text-primary" />
                  <span className="text-sm text-surface-600">Include both healthy and unhealthy parts</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {currentStep === 'camera' && (
          <CameraCapture
            onCapture={handleImageCapture}
            onCancel={() => setCurrentStep('initial')}
          />
        )}

        {currentStep === 'symptoms' && (
          <motion.div
            key="symptoms"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {capturedImage && (
              <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
                <img
                  src={capturedImage.preview}
                  alt="Captured plant"
                  className="w-full h-48 object-cover rounded-xl"
                />
              </div>
            )}
            <SymptomSelector
              onSelect={handleSymptomsSelected}
              onSkip={handleSkipSymptoms}
            />
          </motion.div>
        )}

        {currentStep === 'analyzing' && (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="mb-6"
            >
              <ApperIcon name="Loader2" size={48} className="text-accent mx-auto" />
            </motion.div>
            <h3 className="font-heading text-lg font-semibold text-surface-800 mb-2">
              Analyzing your plant...
            </h3>
            <p className="text-surface-600">This may take a few moments</p>
          </motion.div>
        )}

        {currentStep === 'result' && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <DiagnosisResult
              diagnosis={diagnosis}
              onNewDiagnosis={handleNewDiagnosis}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Diagnose;