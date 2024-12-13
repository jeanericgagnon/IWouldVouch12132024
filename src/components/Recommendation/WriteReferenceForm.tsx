import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { userApi, recommendationApi } from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { RecommendationForm } from './RecommendationForm';
import { toast } from 'react-hot-toast';

export function WriteReferenceForm() {
  const { userId } = useParams();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [targetUser, setTargetUser] = useState<{ id: string; name: string; } | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    relationship: '',
    company: '',
    duration: '',
    endorsement: '',
    rating: 0,
    skills: [],
    documents: [],
    portfolioItems: []
  });

  useEffect(() => {
    const fetchTargetUser = async () => {
      try {
        if (!userId) {
          throw new Error('User ID is required');
        }
        const userData = await userApi.getUserById(userId);
        setTargetUser({
          id: userData.id,
          name: userData.name
        });
      } catch (err) {
        console.error('Error fetching user:', err);
        toast.error('Failed to load user profile');
        navigate('/write-recommendation');
      } finally {
        setLoading(false);
      }
    };

    fetchTargetUser();
  }, [userId, navigate]);

  const handleSubmit = async () => {
    if (!currentUser || !targetUser) return;

    try {
      setSubmitting(true);
      await recommendationApi.createRecommendation({
        ...formData,
        recipientId: targetUser.id
      });
      toast.success('Recommendation submitted successfully!');
      navigate(`/profile/${targetUser.id}`);
    } catch (error) {
      console.error('Error submitting recommendation:', error);
      toast.error('Failed to submit recommendation');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!currentUser || !targetUser) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-red-500">
          Unable to load recommendation form
        </h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Write a Recommendation for {targetUser.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <RecommendationForm
            currentUser={{
              name: currentUser.name,
              linkedin: currentUser.linkedin
            }}
            targetUser={targetUser}
            formData={formData}
            onFormDataChange={setFormData}
            onSubmit={handleSubmit}
            submitting={submitting}
          />
        </CardContent>
      </Card>
    </div>
  );
}