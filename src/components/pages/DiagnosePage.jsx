import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import InitialDiagnosisPrompt from '@/components/organisms/InitialDiagnosisPrompt';
import CameraCaptureModal from '@/components/molecules/CameraCaptureModal';
import SymptomSelection from '@/components/organisms/SymptomSelection';
import DiagnosisDisplay from '@/components/organisms/DiagnosisDisplay';
import ApperIcon from '@/components/ApperIcon';

import { plantService } from '@/services';

const DiagnosePage = () => {
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
          <InitialDiagnosisPrompt key="initial" onStartDiagnosis={handleStartDiagnosis} />
        )}

        {currentStep === 'camera' && (
          <CameraCaptureModal
            key="camera"
            isOpen={true}
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
            <SymptomSelection
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
          <DiagnosisDisplay
            key="result"
            diagnosis={diagnosis}
            onNewDiagnosis={handleNewDiagnosis}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default DiagnosePage;