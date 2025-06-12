import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import PlantDetailInfo from '@/components/organisms/PlantDetailInfo';
import Card from '@/components/molecules/Card';

import { plantService } from '@/services';

const PlantDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plant, setPlant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPlant = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await plantService.getById(id);
        setPlant(data);
      } catch (err) {
        setError(err.message || 'Failed to load plant details');
        toast.error('Failed to load plant details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadPlant();
    }
  }, [id]);

  const handleWaterPlant = async () => {
    try {
      await plantService.waterPlant(id);
      setPlant(prev => ({
        ...prev,
        lastWatered: new Date().toISOString(),
        waterLevel: Math.min(100, prev.waterLevel + 30)
      }));
      toast.success('Plant watered!');
    } catch (err) {
      toast.error('Failed to water plant');
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-48 bg-surface-200 rounded-2xl mb-6"></div>
          <div className="h-8 bg-surface-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-surface-200 rounded w-1/2 mb-6"></div>
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="h-16 bg-surface-200 rounded-xl"></Card>
            ))}
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="h-20 bg-surface-200 rounded-xl"></Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !plant) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
        <ApperIcon name="AlertCircle" size={48} className="text-semantic-error mb-4" />
        <h3 className="text-lg font-semibold text-surface-800 mb-2">Plant not found</h3>
        <p className="text-surface-600 text-center mb-4">{error || 'This plant does not exist'}</p>
        <Button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/plants')}
          className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          Back to Plants
        </Button>
      </div>
    );
  }

  return (
    <PlantDetailInfo plant={plant} onWaterPlant={handleWaterPlant} />
  );
};

export default PlantDetailPage;