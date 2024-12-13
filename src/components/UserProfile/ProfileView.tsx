import { User } from '../../types/user';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { FileText, MapPin, Mail, Phone, Building2, ExternalLink, Briefcase } from 'lucide-react';

interface ProfileViewProps {
  user: User;
}

export function ProfileView({ user }: ProfileViewProps) {
  const buttonStyles = "bg-[#52789e] hover:bg-[#6b9cc3] text-white";

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center sm:text-left space-y-4">
              <div>
                <h1 className="text-2xl font-bold">{user.name}</h1>
                {user.title && <p className="text-lg text-muted-foreground">{user.title}</p>}
              </div>
              
              <div className="flex flex-wrap gap-4">
                {user.showCompany && user.currentCompany && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Building2 className="h-4 w-4" />
                    <span>{user.currentCompany}</span>
                  </div>
                )}
                {user.showLocation && user.location && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{user.location}</span>
                  </div>
                )}
                {user.showEmail && user.email && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{user.email}</span>
                  </div>
                )}
                {user.showPhone && user.phoneNumber && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{user.phoneNumber}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bio Section */}
      {user.bio && (
        <Card>
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{user.bio}</p>
          </CardContent>
        </Card>
      )}

      {/* Resume & Portfolio Section */}
      {(user.resumeUrl || (user.portfolioItems && user.portfolioItems.length > 0)) && (
        <Card>
          <CardHeader>
            <CardTitle>Portfolio & Resume</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {user.resumeUrl && (
              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Resume</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(user.resumeUrl, '_blank')}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View
                </Button>
              </div>
            )}
            
            {user.portfolioItems && user.portfolioItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{item.type}</p>
                    <p className="text-sm text-muted-foreground">{item.name}</p>
                  </div>
                </div>
                {item.url && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(item.url, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Skills Section */}
      {user.skills && user.skills.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Soft Skills */}
              {user.skills.some(skill => skill.type === 'soft') && (
                <div>
                  <h3 className="text-sm font-medium mb-2">Soft Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {user.skills
                      .filter(skill => skill.type === 'soft')
                      .map((skill, index) => (
                        <Badge 
                          key={index}
                          className="bg-[#6b9cc3] text-white"
                        >
                          {skill.name}
                        </Badge>
                      ))
                    }
                  </div>
                </div>
              )}

              {/* Technical Skills */}
              {user.skills.some(skill => skill.type === 'technical') && (
                <div>
                  <h3 className="text-sm font-medium mb-2">Technical Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {user.skills
                      .filter(skill => skill.type === 'technical')
                      .map((skill, index) => (
                        <Badge 
                          key={index}
                          className="bg-[#52789e] text-white"
                        >
                          {skill.name}
                        </Badge>
                      ))
                    }
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Professional Interests */}
      {user.professionalInterests && user.professionalInterests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Professional Interests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {user.professionalInterests.map((interest, index) => (
                <Badge key={index} variant="outline">
                  {interest}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Availability Section */}
      {user.availability && user.availability.status !== 'not-looking' && (
        <Card>
          <CardHeader>
            <CardTitle>Availability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Badge className={`
              ${user.availability.status === 'actively-looking' ? 'bg-green-500' :
                user.availability.status === 'open' ? 'bg-blue-500' :
                'bg-yellow-500'} text-white
            `}>
              {user.availability.status === 'actively-looking' ? 'Actively Looking' :
               user.availability.status === 'open' ? 'Open to Opportunities' :
               'Casually Looking'}
            </Badge>

            {user.availability.positionsInterestedIn && user.availability.positionsInterestedIn.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2">Interested In</h3>
                <div className="flex flex-wrap gap-2">
                  {user.availability.positionsInterestedIn.map((position, index) => (
                    <Badge key={index} variant="outline">
                      <Briefcase className="h-3 w-3 mr-1" />
                      {position}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {user.availability.workStyles && user.availability.workStyles.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2">Work Style Preferences</h3>
                <div className="flex flex-wrap gap-2">
                  {user.availability.workStyles.map((style, index) => (
                    <Badge key={index} variant="outline">
                      {style === 'inPerson' ? 'In Person' :
                       style === 'hybrid' ? 'Hybrid' : 'Remote'}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}