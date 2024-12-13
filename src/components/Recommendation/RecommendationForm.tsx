import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { mockStore } from '../../data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { AuthorInfo } from './sections/AuthorInfo';
import { RelationshipInfo } from './sections/RelationshipInfo';
import { EndorsementInput } from './sections/EndorsementInput';
import { RatingInput } from './sections/RatingInput';
import { SkillSelector } from './SkillSelector';
import { SupportingDocuments } from './SupportingDocuments';
import { toast } from 'react-hot-toast';

export function RecommendationForm() {
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
  const [characterCount, setCharacterCount] = useState(0);

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

        const user = mockStore.getUser(userId);
        if (!user) {
          throw new Error('User not found');
        }

        setTargetUser({
          id: user.id,
          name: user.name
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
  }, [userId, currentUser?.id, navigate]);

  const handleEndorsementChange = (value: string) => {
    setFormData(prev => ({ ...prev, endorsement: value }));
    setCharacterCount(value.length);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !targetUser) return;

    try {
      setSubmitting(true);

      // Create recommendation
      await mockStore.createReference({
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
        },
        relationship: {
          type: formData.relationship,
          company: formData.company,
          duration: formData.duration
        },
        endorsement: formData.endorsement,
        rating: formData.rating,
        skills: formData.skills,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
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
    <form onSubmit={handleSubmit} className="container mx-auto px-4 py-8 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Write a Recommendation for {targetUser.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <AuthorInfo 
            name={currentUser.name} 
            linkedin={currentUser.linkedin} 
          />

          <RelationshipInfo
            relationship={formData.relationship}
            company={formData.company}
            duration={formData.duration}
            onRelationshipChange={(value) => setFormData(prev => ({ ...prev, relationship: value }))}
            onCompanyChange={(value) => setFormData(prev => ({ ...prev, company: value }))}
            onDurationChange={(value) => setFormData(prev => ({ ...prev, duration: value }))}
            targetUserName={targetUser.name}
          />

          <EndorsementInput
            value={formData.endorsement}
            onChange={handleEndorsementChange}
            characterCount={characterCount}
          />

          <RatingInput
            rating={formData.rating}
            onRatingChange={(value) => setFormData(prev => ({ ...prev, rating: value }))}
            targetUserName={targetUser.name}
          />

          <SkillSelector
            skills={formData.skills}
            onSkillsChange={(skills) => setFormData(prev => ({ ...prev, skills }))}
          />

          <SupportingDocuments
            documents={formData.documents}
            onDocumentsChange={(documents) => setFormData(prev => ({ ...prev, documents }))}
          />

          <Button
            type="submit"
            disabled={submitting || characterCount < 750}
            className="w-full bg-[#52789e] hover:bg-[#6b9cc3] text-white"
          >
            {submitting ? 'Submitting...' : 'Submit Recommendation'}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}