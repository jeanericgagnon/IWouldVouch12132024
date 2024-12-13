import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { ChevronRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Reference } from '../types/reference';

interface ReferenceListProps {
  references?: Reference[];
  title: string;
  emptyMessage: string;
  showRating?: boolean;
}

export function ReferenceList({ 
  references = [], 
  title, 
  emptyMessage, 
  showRating = true 
}: ReferenceListProps) {
  if (!references || references.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">{emptyMessage}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      {references.map((reference) => (
        <Link key={reference.id} to={`/reference/${reference.id}`}>
          <Card className="transition-all duration-200 hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <Avatar>
                    <AvatarImage src={reference.fromUser.avatar} alt={reference.fromUser.name} />
                    <AvatarFallback>
                      {reference.fromUser.name ? reference.fromUser.name.split(' ').map(n => n[0]).join('') : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{reference.fromUser.name}</h3>
                    <p className="text-sm text-muted-foreground">{reference.fromUser.title}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {reference.relationship.type} at {reference.relationship.company}
                    </p>
                    {showRating && (
                      <div className="flex items-center mt-2">
                        {Array.from({ length: reference.rating }).map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </div>
              <p className="mt-4 text-sm text-muted-foreground line-clamp-3">
                "{reference.endorsement}"
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}