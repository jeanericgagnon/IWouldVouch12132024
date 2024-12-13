import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Star, Linkedin, FileText, ExternalLink } from 'lucide-react';
import { cn } from "@/lib/utils";
import { toast } from 'react-hot-toast';
import type { FirestoreRecommendation } from '../lib/firebase/collections';

export function RecommendationPage() {
  const { recommendationId } = useParams();
  const [recommendation, setRecommendation] = useState<FirestoreRecommendation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendation = async () => {
      try {
        if (!recommendationId) {
          throw new Error('Recommendation ID is required');
        }
        const data = await api.recommendations.getRecommendation(recommendationId);
        setRecommendation(data);
      } catch (err) {
        console.error('Error fetching recommendation:', err);
        setError('Failed to load recommendation');
        toast.error('Failed to load recommendation');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendation();
  }, [recommendationId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !recommendation) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-red-500">
          {error || 'Recommendation not found'}
        </h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={recommendation.author.avatar} alt={recommendation.author.name} />
                <AvatarFallback>{recommendation.author.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{recommendation.author.name}</CardTitle>
                <CardDescription>{recommendation.author.title}</CardDescription>
              </div>
            </div>
            {recommendation.author.linkedin && (
              <Button
                className="bg-[#0077b5] hover:bg-[#0077b5]/90"
                onClick={() => window.open(recommendation.author.linkedin, '_blank')}
              >
                <Linkedin className="h-4 w-4 mr-2" />
                View LinkedIn
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-2">Relationship</h3>
              <p className="text-sm text-muted-foreground">
                {recommendation.relationship.type} at {recommendation.relationship.company} for {recommendation.relationship.duration}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Rating</h3>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      "w-5 h-5",
                      star <= recommendation.rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    )}
                  />
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Endorsement</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-line">
                {recommendation.endorsement}
              </p>
            </div>

            {recommendation.skills.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {recommendation.skills.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className={cn(
                        skill.type === 'soft'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
                          : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                      )}
                    >
                      {skill.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {recommendation.additionalSections && recommendation.additionalSections.length > 0 && (
              <div className="space-y-4">
                {recommendation.additionalSections.map((section, index) => (
                  <div key={index}>
                    <h3 className="text-sm font-medium mb-2">{section.title}</h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">
                      {section.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}