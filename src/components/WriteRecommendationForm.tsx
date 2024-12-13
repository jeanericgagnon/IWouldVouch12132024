import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { api } from '../services/api';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { RecommendationFormContent } from './RecommendationFormContent';
import { toast } from 'react-hot-toast';
import { z } from 'zod';

// Validation schema
const formSchema = z.object({
  relationship: z.string().min(1, "Relationship is required"),
  company: z.string().optional(),
  duration: z.string().optional(),
  endorsement: z.string().min(750, "Endorsement must be at least 750 characters"),
  rating: z.number().optional(),
  skills: z.array(z.object({
    name: z.string(),
    type: z.enum(['soft', 'hard'])
  })).optional(),
  documents: z.array(z.any()).optional(),
  portfolioItems: z.array(z.object({
    type: z.string(),
    name: z.string(),
    url: z.string().optional()
  })).optional(),
  additionalSections: z.array(z.object({
    title: z.string(),
    content: z.string()
  })).optional()
});

export function WriteRecommendationForm() {
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

        // Check if user is trying to recommend themselves
        if (currentUser?.id === userId) {
          toast.error("You cannot write a recommendation for yourself");
          navigate('/write-recommendation');
          return;
        }

        const userData = await api.users.getUser(userId);
        if (!userData) {
          throw new Error('User not found');
        }
        
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
  }, [userId, navigate, currentUser?.id]);

  const handleSubmit = async () => {
    if (!currentUser || !targetUser) {
      toast.error('You must be logged in to submit a recommendation');
      return;
    }

    // Double-check to prevent self-recommendations
    if (currentUser.id === targetUser.id) {
      toast.error("You cannot write a recommendation for yourself");
      navigate('/write-recommendation');
      return;
    }

    try {
      setSubmitting(true);

      // Validate form data
      const validatedData = formSchema.parse(formData);

      const recommendationData = {
        recipientId: targetUser.id,
        relationship: {
          type: validatedData.relationship,
          company: validatedData.company || '',
          duration: validatedData.duration || ''
        },
        endorsement: validatedData.endorsement,
        rating: validatedData.rating || 0,
        skills: validatedData.skills || [],
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
      };

      await api.recommendations.createRecommendation(recommendationData);
      toast.success('Recommendation submitted successfully!');
      navigate(`/profile/${targetUser.id}`);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const firstError = error.errors[0];
        toast.error(firstError.message);
      } else {
        console.error('Error submitting recommendation:', error);
        toast.error('Failed to submit recommendation. Please try again.');
      }
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
          <RecommendationFormContent
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