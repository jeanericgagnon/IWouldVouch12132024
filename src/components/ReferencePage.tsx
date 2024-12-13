import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { referenceApi } from '../services/api';
import { Reference } from '../types/reference';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Star, Linkedin } from 'lucide-react';

export function ReferencePage() {
  const { referenceId } = useParams();
  const [reference, setReference] = useState<Reference | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReference = async () => {
      try {
        if (!referenceId) return;
        const data = await referenceApi.getReferenceById(referenceId);
        setReference(data);
      } catch (err) {
        setError('Failed to load reference');
        console.error('Error fetching reference:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReference();
  }, [referenceId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !reference) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-red-500">
          {error || 'Reference not found'}
        </h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card className="mb-8">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={reference.fromUser.avatar} alt={reference.fromUser.name} />
                <AvatarFallback>{reference.fromUser.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{reference.fromUser.name}</CardTitle>
                <CardDescription>{reference.fromUser.title}</CardDescription>
              </div>
            </div>
            {reference.fromUser.linkedin && (
              <Button
                className="bg-[#0077b5] hover:bg-[#0077b5]/90"
                onClick={() => window.open(reference.fromUser.linkedin, '_blank')}
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
                {reference.relationship.type} at {reference.relationship.company} for {reference.relationship.duration}
              </p>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Rating</h3>
              <div className="flex space-x-1">
                {Array.from({ length: reference.rating }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Endorsement</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-line">
                {reference.endorsement}
              </p>
            </div>

            {reference.skills.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {reference.skills.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className={skill.type === 'soft' ? 'bg-blue-100' : 'bg-green-100'}
                    >
                      {skill.name}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {reference.examples && (
              <div>
                <h3 className="text-sm font-medium mb-2">Examples</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-line mb-4">
                  {reference.examples.description}
                </p>
                {reference.examples.attachments && reference.examples.attachments.length > 0 && (
                  <div className="space-y-2">
                    {reference.examples.attachments.map((attachment, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="w-full justify-start text-left"
                        onClick={() => window.open(attachment.url, '_blank')}
                      >
                        {attachment.name}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {reference.additionalSections && reference.additionalSections.length > 0 && (
              <div className="space-y-4">
                {reference.additionalSections.map((section, index) => (
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