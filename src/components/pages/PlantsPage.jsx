import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import PlantGallery from '@/components/organisms/PlantGallery';
import Card from '@/components/molecules/Card';

import { plantService } from '@/services';

const PlantsPage = () => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadPlants = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await plantService.getAll();
        setPlants(data);
      } catch (err) {
        setError(err.message || 'Failed to load plants');
        toast.error('Failed to load plants');
      } finally {
        setLoading(false);
      }
    };

    loadPlants();
  }, []);

  const handleViewDetails = (plantId) => {
    navigate(`/plants/${plantId}`);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="h-8 bg-surface-200 rounded w-32 animate-pulse"></div>
          <div className="h-8 bg-surface-200 rounded w-24 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse bg-surface-50 p-4 shadow-sm">
              <div className="aspect-square bg-surface-200 rounded-xl mb-3"></div>
              <div className="space-y-2">
                <div className="h-4 bg-surface-200 rounded w-3/4"></div>
                <div className="h-3 bg-surface-200 rounded w-1/2"></div>
                <div className="h-3 bg-surface-200 rounded w-2/3"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
        <ApperIcon name="AlertCircle" size={48} className="text-semantic-error mb-4" />
        <h3 className="text-lg font-semibold text-surface-800 mb-2">Failed to load plants</h3>
        <p className="text-surface-600 text-center mb-4">{error}</p>
        <Button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Try again
        </Button>
      </div>
    );
  }

  if (plants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          <ApperIcon name="Leaf" size={64} className="text-secondary mb-4" />
        </motion.div>
        <h3 className="text-xl font-heading font-semibold text-surface-800 mb-2">No Plants Yet</h3>
        <p className="text-surface-600 text-center mb-6">Start building your garden by adding your first plant</p>
        <Button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/add-plant')}
          className="px-6 py-3 bg-accent text-white rounded-xl font-medium hover:bg-accent/90 transition-colors"
        >
          Add Your First Plant
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-full overflow-hidden p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-surface-800">My Plants</h1>
          <p className="text-surface-600">{plants.length} plant{plants.length !== 1 ? 's' : ''} in your garden</p>
        </div>
        <Button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/add-plant')}
          className="p-3 bg-accent text-white rounded-xl shadow-sm hover:bg-accent/90 transition-colors"
        >
          <ApperIcon name="Plus" size={20} />
        </Button>
      </div>

      <PlantGallery plants={plants} onViewDetails={handleViewDetails} />
    </div>
  );
};

export default PlantsPage;