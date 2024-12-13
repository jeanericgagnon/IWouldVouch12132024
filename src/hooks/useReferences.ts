import { useState, useEffect } from 'react';
import { recommendationApi } from '../services/api';
import { toast } from 'react-hot-toast';
import type { Reference } from '../types/reference';

export function useReferences(userId: string) {
  const [references, setReferences] = useState<Reference[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('approved');

  useEffect(() => {
    fetchReferences();
  }, [userId]);

  const fetchReferences = async () => {
    try {
      setLoading(true);
      const data = await recommendationApi.getUserRecommendations(userId);
      setReferences(data.recommendations);
    } catch (error) {
      console.error('Error fetching references:', error);
      setError('Failed to load references');
      toast.error('Failed to load references');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptReference = async (referenceId: string) => {
    try {
      await recommendationApi.updateRecommendationStatus(referenceId, 'approved');
      toast.success('Reference approved successfully');
      await fetchReferences(); // Refresh the list
    } catch (error) {
      console.error('Error accepting reference:', error);
      toast.error('Failed to approve reference');
    }
  };

  const handleDenyReference = async (referenceId: string) => {
    try {
      await recommendationApi.updateRecommendationStatus(referenceId, 'rejected');
      toast.success('Reference denied successfully');
      await fetchReferences(); // Refresh the list
    } catch (error) {
      console.error('Error denying reference:', error);
      toast.error('Failed to deny reference');
    }
  };

  return {
    references,
    loading,
    error,
    activeTab,
    setActiveTab,
    handleAcceptReference,
    handleDenyReference,
    refreshReferences: fetchReferences
  };
}