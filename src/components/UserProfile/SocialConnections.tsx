import { useState } from 'react';
import { User } from '../../types/user';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Linkedin, Github, Facebook, Instagram } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface SocialConnectionsProps {
  user: User;
  setHasUnsavedChanges: (value: boolean) => void;
}

export function SocialConnections({ user, setHasUnsavedChanges }: SocialConnectionsProps) {
  const [connectedSocials, setConnectedSocials] = useState({
    linkedin: !!user.linkedin,
    github: false,
    facebook: false,
    instagram: false
  });

  const handleSocialConnection = async (platform: keyof typeof connectedSocials, isConnecting: boolean) => {
    try {
      // In a real app, this would connect to the social platform's OAuth
      setConnectedSocials(prev => ({ ...prev, [platform]: isConnecting }));
      setHasUnsavedChanges(true);
      toast.success(`Successfully ${isConnecting ? 'connected to' : 'disconnected from'} ${platform}`);
    } catch (error) {
      toast.error(`Failed to ${isConnecting ? 'connect to' : 'disconnect from'} ${platform}`);
    }
  };

  const socialPlatforms = [
    { key: 'linkedin', name: 'LinkedIn', Icon: Linkedin },
    { key: 'github', name: 'GitHub', Icon: Github },
    { key: 'facebook', name: 'Facebook', Icon: Facebook },
    { key: 'instagram', name: 'Instagram', Icon: Instagram }
  ] as const;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connected Accounts</CardTitle>
        <CardDescription>Manage your connected social media accounts</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {socialPlatforms.map(({ key, name, Icon }) => (
          <div key={key} className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Icon className="h-5 w-5" />
              <span>{name}</span>
            </div>
            <Button
              variant={connectedSocials[key] ? "outline" : "default"}
              className={connectedSocials[key] 
                ? 'bg-white text-[#52789e] hover:bg-gray-100' 
                : 'bg-[#52789e] hover:bg-[#6b9cc3] text-white'
              }
              onClick={() => handleSocialConnection(key, !connectedSocials[key])}
            >
              {connectedSocials[key] ? "Disconnect" : "Connect"}
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}