import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import { plantService } from '../services';

const PlantIdentification = ({ photo, onIdentified, onRetake }) => {
  const [identifying, setIdentifying] = useState(false);
  const [results, setResults] = useState([]);

  const handleIdentify = async () => {
    setIdentifying(true);
    try {
      const identificationResults = await plantService.identifyPlant(photo);
      setResults(identificationResults);
    } catch (err) {
      toast.error('Failed to identify plant. Please try again.');
    } finally {
      setIdentifying(false);
    }
  };

  const handleSelectPlant = (species) => {
    onIdentified(species);
  };

  if (identifying) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
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
          Identifying your plant...
        </h3>
        <p className="text-surface-600">This may take a few moments</p>
      </motion.div>
    );
  }

  if (results.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <img
            src={photo.preview}
            alt="Plant to identify"
            className="w-full h-48 object-cover rounded-xl"
          />
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
          <ApperIcon name="Search" size={48} className="text-accent mx-auto mb-4" />
          <h3 className="font-heading text-lg font-semibold text-surface-800 mb-4">
            Ready to identify your plant?
          </h3>
          <p className="text-surface-600 mb-6">
            Our AI will analyze your photo and suggest possible plant species
          </p>
          
          <div className="flex space-x-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onRetake}
              className="flex-1 py-3 px-4 bg-surface-100 text-surface-700 rounded-xl font-medium hover:bg-surface-200 transition-colors"
            >
              Retake Photo
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleIdentify}
              className="flex-1 py-3 px-4 bg-accent text-white rounded-xl font-medium hover:bg-accent/90 transition-colors"
            >
              Identify Plant
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <img
          src={photo.preview}
          alt="Identified plant"
          className="w-full h-32 object-cover rounded-xl"
        />
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="font-heading text-lg font-semibold text-surface-800 mb-4">
          Identification Results
        </h3>
        <p className="text-surface-600 mb-6">Select the correct species:</p>
        
        <div className="space-y-3">
          {results.map((species, index) => (
            <motion.button
              key={species.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelectPlant(species)}
              className="w-full p-4 bg-surface-50 rounded-xl text-left hover:bg-surface-100 transition-colors border border-surface-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-surface-800">{species.commonName}</h4>
                  <p className="text-sm text-surface-600 italic">{species.scientificName}</p>
                  <p className="text-xs text-surface-500 mt-1">{species.family}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <div className="text-sm font-medium text-surface-800">{species.confidence}%</div>
                    <div className="text-xs text-surface-500">confidence</div>
                  </div>
                  <div className="w-2 h-2 bg-secondary rounded-full"></div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-surface-200">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onRetake}
            className="w-full py-3 px-4 text-surface-600 hover:bg-surface-100 rounded-xl transition-colors"
          >
            None of these? Take another photo
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const PlantSetup = ({ species, onComplete, onBack }) => {
  const [plantData, setPlantData] = useState({
    nickname: '',
    location: '',
    plantedDate: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!plantData.nickname.trim()) {
      toast.error('Please give your plant a nickname');
      return;
    }
    onComplete({ ...plantData, species });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center space-x-4 mb-6">
          <div className="p-3 bg-secondary/10 rounded-xl">
            <ApperIcon name="Leaf" size={24} className="text-secondary" />
          </div>
          <div>
            <h3 className="font-heading text-lg font-semibold text-surface-800">{species.commonName}</h3>
            <p className="text-sm text-surface-600 italic">{species.scientificName}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-2">
              Plant Nickname *
            </label>
            <input
              type="text"
              value={plantData.nickname}
              onChange={(e) => setPlantData({ ...plantData, nickname: e.target.value })}
              className="w-full p-3 border border-surface-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              placeholder="Give your plant a friendly name..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-700 mb-2">
              Location
            </label>
            <input
              type="text"
              value={plantData.location}
              onChange={(e) => setPlantData({ ...plantData, location: e.target.value })}
              className="w-full p-3 border border-surface-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
              placeholder="e.g., Living room window, Balcony, Garden bed..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-700 mb-2">
              Planted Date
            </label>
            <input
              type="date"
              value={plantData.plantedDate}
              onChange={(e) => setPlantData({ ...plantData, plantedDate: e.target.value })}
              className="w-full p-3 border border-surface-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-surface-700 mb-2">
              Notes (optional)
            </label>
            <textarea
              value={plantData.notes}
              onChange={(e) => setPlantData({ ...plantData, notes: e.target.value })}
              rows={3}
              className="w-full p-3 border border-surface-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
              placeholder="Any special notes about your plant..."
            />
          </div>

          <div className="flex space-x-3 pt-4">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onBack}
              className="flex-1 py-3 px-4 bg-surface-100 text-surface-700 rounded-xl font-medium hover:bg-surface-200 transition-colors"
            >
              Back
            </motion.button>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 py-3 px-4 bg-accent text-white rounded-xl font-medium hover:bg-accent/90 transition-colors"
            >
              Add Plant
            </motion.button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

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
          <ApperIcon name="Camera" size={64} className="text-accent mx-auto" />
        </motion.div>
        
        <h2 className="font-heading text-xl font-semibold text-surface-800 mb-4">
          Take a Photo of Your Plant
        </h2>
        <p className="text-surface-600 mb-8">
          For best results, take a clear photo showing the whole plant or distinctive features
        </p>

        <div className="space-y-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => fileInputRef.current?.click()}
            className="w-full bg-accent text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-sm hover:bg-accent/90 transition-colors flex items-center justify-center space-x-2"
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

      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="font-medium text-surface-800 mb-4">Photo Tips:</h3>
        <div className="space-y-3 text-left">
          <div className="flex items-center space-x-3">
            <ApperIcon name="Sun" size={16} className="text-yellow-500" />
            <span className="text-sm text-surface-600">Use natural lighting when possible</span>
          </div>
          <div className="flex items-center space-x-3">
            <ApperIcon name="Focus" size={16} className="text-primary" />
            <span className="text-sm text-surface-600">Keep the plant in focus</span>
          </div>
          <div className="flex items-center space-x-3">
            <ApperIcon name="Leaf" size={16} className="text-secondary" />
            <span className="text-sm text-surface-600">Include leaves, flowers, or distinctive features</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const AddPlant = () => {
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
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/plants')}
          className="p-2 text-surface-600 hover:text-surface-800 transition-colors"
        >
          <ApperIcon name="X" size={20} />
        </motion.button>
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
            <CameraCapture
              onCapture={handlePhotoCapture}
              onCancel={() => navigate('/plants')}
            />
          </motion.div>
        )}

        {currentStep === 'identify' && capturedPhoto && (
          <motion.div key="identify">
            <PlantIdentification
              photo={capturedPhoto}
              onIdentified={handleSpeciesIdentified}
              onRetake={handleRetakePhoto}
            />
          </motion.div>
        )}

        {currentStep === 'setup' && selectedSpecies && (
          <motion.div key="setup">
            <PlantSetup
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

export default AddPlant;