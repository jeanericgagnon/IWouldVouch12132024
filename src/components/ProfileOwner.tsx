import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Linkedin, X, Facebook, Github, Instagram, ChevronRight, Check, Sun, Moon, Globe, Lock } from 'lucide-react';
import { cn } from "@/lib/utils";

interface Reference {
  id: number;
  name: string;
  title: string;
  relationship: string;
  avatar: string;
  endorsement: string;
  link: string;
}

interface PendingVouch extends Reference {
  skills: string[];
}

export function ProfileOwner() {
  const [activeTab, setActiveTab] = useState('profile');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState('john@example.com');
  const [activeReferenceTab, setActiveReferenceTab] = useState('your-references');
  const [acceptedReference, setAcceptedReference] = useState<Reference | null>(null);
  const [name, setName] = useState('John Doe');
  const [bio, setBio] = useState("I'm a passionate software engineer...");
  const [theme, setTheme] = useState('light');
  const [privacy, setPrivacy] = useState('public');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [pendingTabChange, setPendingTabChange] = useState<string | null>(null);
  const [showShareLinkedInDialog, setShowShareLinkedInDialog] = useState(false);

  const [references, setReferences] = useState<Reference[]>([
    {
      id: 1,
      name: 'Jane Smith',
      title: 'CEO at TechCorp',
      relationship: 'Former Manager',
      avatar: '/placeholder.svg',
      endorsement: "John is an exceptional software engineer...",
      link: "/reference/1"
    }
  ]);

  const [pendingVouches, setPendingVouches] = useState<PendingVouch[]>([
    {
      id: 2,
      name: "Alice Johnson",
      title: "Senior Developer",
      relationship: "Colleague",
      endorsement: "John is an outstanding team player...",
      skills: ["JavaScript", "React", "Leadership"],
      avatar: '/placeholder.svg',
      link: "/reference/2"
    }
  ]);

  const handleSaveSettings = async () => {
    try {
      // Save settings logic would go here
      setHasUnsavedChanges(false);
      if (pendingTabChange) {
        setActiveTab(pendingTabChange);
        setPendingTabChange(null);
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  const handleAcceptVouch = (vouch: PendingVouch) => {
    setPendingVouches(prev => prev.filter(v => v.id !== vouch.id));
    const newReference: Reference = {
      id: vouch.id,
      name: vouch.name,
      title: vouch.title,
      relationship: vouch.relationship,
      avatar: vouch.avatar,
      endorsement: vouch.endorsement,
      link: vouch.link
    };
    setReferences(prev => [...prev, newReference]);
    setAcceptedReference(newReference);
    setShowShareLinkedInDialog(true);
  };

  const handleDenyVouch = (id: number) => {
    setPendingVouches(prev => prev.filter(vouch => vouch.id !== id));
  };

  const handleShareOnLinkedIn = (reference: Reference) => {
    const referenceUrl = `${window.location.origin}/reference/${reference.id}`;
    const text = `Check out this great reference from ${reference.name}`;
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referenceUrl)}&title=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="references">References</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
              <CardDescription>Manage your public profile information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-2xl font-bold">{name}</h2>
                    <p className="text-muted-foreground">{email}</p>
                  </div>
                </div>
                <Textarea 
                  value={bio} 
                  onChange={(e) => {
                    setBio(e.target.value);
                    setHasUnsavedChanges(true);
                  }}
                  placeholder="Tell us about yourself..."
                  className="min-h-[150px]"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="references">
          <div className="space-y-4">
            <Button 
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto bg-primary text-primary-foreground"
            >
              Request New Reference
            </Button>
            
            <Tabs value={activeReferenceTab} onValueChange={setActiveReferenceTab}>
              <TabsList>
                <TabsTrigger value="your-references">Your References</TabsTrigger>
                <TabsTrigger value="pending">Pending ({pendingVouches.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="your-references">
                <div className="space-y-4">
                  {references.map((reference) => (
                    <Card key={reference.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <Avatar>
                              <AvatarImage src={reference.avatar} />
                              <AvatarFallback>{reference.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-lg">{reference.name}</CardTitle>
                              <CardDescription>{reference.title}</CardDescription>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleShareOnLinkedIn(reference)}
                          >
                            <Linkedin className="h-4 w-4 mr-2" />
                            Share
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{reference.endorsement}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="pending">
                <div className="space-y-4">
                  {pendingVouches.map((vouch) => (
                    <Card key={vouch.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <Avatar>
                              <AvatarImage src={vouch.avatar} />
                              <AvatarFallback>{vouch.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-lg">{vouch.name}</CardTitle>
                              <CardDescription>{vouch.title}</CardDescription>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{vouch.endorsement}</p>
                        <div className="flex flex-wrap gap-2 mt-4">
                          {vouch.skills.map((skill, index) => (
                            <Badge key={index} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => handleDenyVouch(vouch.id)}
                        >
                          Deny
                        </Button>
                        <Button
                          onClick={() => handleAcceptVouch(vouch)}
                        >
                          Accept
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
              <CardDescription>Manage your account preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Theme</Label>
                <div className="flex space-x-2">
                  <Button
                    variant={theme === 'light' ? 'default' : 'outline'}
                    onClick={() => {
                      setTheme('light');
                      setHasUnsavedChanges(true);
                    }}
                  >
                    <Sun className="h-4 w-4 mr-2" />
                    Light
                  </Button>
                  <Button
                    variant={theme === 'dark' ? 'default' : 'outline'}
                    onClick={() => {
                      setTheme('dark');
                      setHasUnsavedChanges(true);
                    }}
                  >
                    <Moon className="h-4 w-4 mr-2" />
                    Dark
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Privacy</Label>
                <div className="flex space-x-2">
                  <Button
                    variant={privacy === 'public' ? 'default' : 'outline'}
                    onClick={() => {
                      setPrivacy('public');
                      setHasUnsavedChanges(true);
                    }}
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    Public
                  </Button>
                  <Button
                    variant={privacy === 'private' ? 'default' : 'outline'}
                    onClick={() => {
                      setPrivacy('private');
                      setHasUnsavedChanges(true);
                    }}
                  >
                    <Lock className="h-4 w-4 mr-2" />
                    Private
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={handleSaveSettings}
                disabled={!hasUnsavedChanges}
                className="w-full"
              >
                Save Changes
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Request a Reference</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsModalOpen(false)}>Send Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showShareLinkedInDialog} onOpenChange={setShowShareLinkedInDialog}>
        <AlertDialogContent>
          <AlertDialogTitle>Share Your New Reference</AlertDialogTitle>
          <AlertDialogDescription>
            Would you like to share your new reference on LinkedIn?
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>No, thanks</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (acceptedReference) {
                  handleShareOnLinkedIn(acceptedReference);
                }
                setShowShareLinkedInDialog(false);
              }}
            >
              Share on LinkedIn
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}