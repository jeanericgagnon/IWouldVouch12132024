import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { userApi, recommendationApi } from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ReferenceForm } from './ReferenceForm';
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
    portfolioItems: [],
    additionalSections: []
  });

  useEffect(() => {
    const fetchTargetUser = async () => {
      try {
        if (!userId) {
          throw new Error('User ID is required');
        }
        const userData = await userApi.getUserById(userId);
        console.log('Target user data:', userData); // Debug log
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
      console.log('Submitting recommendation with data:', {
        recipientId: targetUser.id,
        relationship: formData.relationship,
        company: formData.company,
        duration: formData.duration,
        endorsement: formData.endorsement,
        rating: formData.rating,
        skills: formData.skills,
        author: {
          id: currentUser.id,
          name: currentUser.name,
          avatar: currentUser.avatar || '',
          title: currentUser.title || '',
          linkedin: currentUser.linkedin
        },
        recipient: {
          id: targetUser.id,
          name: targetUser.name
        }
      });

      const recommendationId = await recommendationApi.createRecommendation({
        recipientId: targetUser.id,
        relationship: {
          type: formData.relationship,
          company: formData.company,
          duration: formData.duration
        },
        endorsement: formData.endorsement,
        rating: formData.rating,
        skills: formData.skills,
        status: 'pending',
        author: {
          id: currentUser.id,
          name: currentUser.name,
          avatar: currentUser.avatar || '',
          title: currentUser.title || '',
          linkedin: currentUser.linkedin
        },
        recipient: {
          id: targetUser.id,
          name: targetUser.name
        }
      });

      console.log('Created recommendation with ID:', recommendationId); // Debug log
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
          <ReferenceForm
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