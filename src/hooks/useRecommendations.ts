import { useState, useEffect } from 'react';
import { api } from '../services/api';
import type { FirestoreRecommendation } from '../lib/firebase/collections';
import { DocumentSnapshot } from 'firebase/firestore';

interface UseRecommendationsProps {
  userId: string;
  status?: 'pending' | 'approved' | 'rejected';
}

export function useRecommendations({ userId, status }: UseRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<FirestoreRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null);

  const loadRecommendations = async (reset = false) => {
    try {
      setLoading(true);
      setError(null);

      const result = await api.recommendations.getUserRecommendations(
        userId,
        status,
        reset ? undefined : lastDoc
      );

      setRecommendations(prev => reset ? result.recommendations : [...prev, ...result.recommendations]);
      setLastDoc(result.lastDoc);
      setHasMore(result.hasMore);
    } catch (err) {
      console.error('Error loading recommendations:', err);
      setError('Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => loadRecommendations(true);

  const loadMore = () => {
    if (hasMore && !loading) {
      loadRecommendations();
    }
  };

  const updateRecommendationStatus = async (recommendationId: string, newStatus: 'approved' | 'rejected') => {
    try {
      await api.recommendations.updateRecommendationStatus(recommendationId, newStatus);
      refresh(); // Reload recommendations after status update
    } catch (err) {
      console.error('Error updating recommendation status:', err);
      throw new Error('Failed to update recommendation status');
    }
  };

  useEffect(() => {
    refresh();
  }, [userId, status]);

  return {
    recommendations,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
    updateRecommendationStatus
  };
}