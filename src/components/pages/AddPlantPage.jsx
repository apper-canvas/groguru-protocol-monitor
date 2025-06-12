import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import CameraInput from '@/components/organisms/CameraInput';
import PlantIdentificationFlow from '@/components/organisms/PlantIdentificationFlow';
import PlantSetupForm from '@/components/organisms/PlantSetupForm';

import { plantService } from '@/services';

const AddPlantPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState('capture'); // capture, identify, setup
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [selectedSpecies, setSelectedSpecies] = useState(null);
  const [loading, setLoading] = useState(false);

  const handlePhotoCapture = (photo) => {
    setCapturedPhoto(photo);
    setCurrentStep('identify');
  };

  const handleSpeciesIdentified = (species) => {
    setSelectedSpecies(species);
    setCurrentStep('setup');
  };

  const handlePlantComplete = async (plantData) => {
    setLoading(true);
    try {
      const newPlant = await plantService.create({
        ...plantData,
        photo: capturedPhoto
      });
      toast.success(`${plantData.nickname} has been added to your garden!`);
      navigate(`/plants/${newPlant.id}`);
    } catch (err) {
      toast.error('Failed to add plant. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRetakePhoto = () => {
    setCapturedPhoto(null);
    setSelectedSpecies(null);
    setCurrentStep('capture');
  };

  const handleBackToIdentify = () => {
    setSelectedSpecies(null);
    setCurrentStep('identify');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="mb-6"
        >
          <ApperIcon name="Loader2" size={48} className="text-accent" />
        </motion.div>
        <h3 className="font-heading text-lg font-semibold text-surface-800 mb-2">
          Adding your plant...
        </h3>
        <p className="text-surface-600">Setting up care schedule and profile</p>
      </div>
    );
  }

  return (
    <div className="max-w-full overflow-hidden p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-surface-800">Add New Plant</h1>
          <p className="text-surface-600">Let's identify and set up your plant</p>
        </div>
        <Button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/plants')}
          className="p-2 text-surface-600 hover:text-surface-800 transition-colors"
        >
          <ApperIcon name="X" size={20} />
        </Button>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center space-x-4">
          {['capture', 'identify', 'setup'].map((step, index) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                currentStep === step
                  ? 'bg-accent text-white'
                  : index < ['capture', 'identify', 'setup'].indexOf(currentStep)
                  ? 'bg-secondary text-white'
                  : 'bg-surface-200 text-surface-600'
              }`}>
                {index + 1}
              </div>
              {index < 2 && (
                <div className={`w-8 h-0.5 mx-2 transition-colors ${
                  index < ['capture', 'identify', 'setup'].indexOf(currentStep)
                    ? 'bg-secondary'
                    : 'bg-surface-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        {currentStep === 'capture' && (
          <motion.div key="capture">
            <CameraInput
              onCapture={handlePhotoCapture}
              onCancel={() => navigate('/plants')}
            />
          </motion.div>
        )}

        {currentStep === 'identify' && capturedPhoto && (
          <motion.div key="identify">
            <PlantIdentificationFlow
              photo={capturedPhoto}
              onIdentified={handleSpeciesIdentified}
              onRetake={handleRetakePhoto}
            />
          </motion.div>
        )}

        {currentStep === 'setup' && selectedSpecies && (
          <motion.div key="setup">
            <PlantSetupForm
              species={selectedSpecies}
              onComplete={handlePlantComplete}
              onBack={handleBackToIdentify}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AddPlantPage;