import { useState, useRef } from 'react';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import { Badge } from "../ui/badge";
import { Star, Upload, X } from 'lucide-react';
import { cn } from "@/lib/utils";
import { toast } from 'react-hot-toast';
import { additionalSectionOptions, sectionDescriptions } from './constants';

interface ReferenceFormProps {
  currentUser: {
    name: string;
    linkedin: string;
  };
  targetUser: {
    id: string;
    name: string;
  };
}

export function ReferenceForm({ currentUser, targetUser }: ReferenceFormProps) {
  // Basic info
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [countryCode, setCountryCode] = useState('1');

  // Relationship
  const [relationship, setRelationship] = useState('');
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [timeKnown, setTimeKnown] = useState('');

  // Reference content
  const [endorsement, setEndorsement] = useState('');
  const [characterCount, setCharacterCount] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [examplesText, setExamplesText] = useState('');
  const [exampleFile, setExampleFile] = useState<File | null>(null);
  const [recommendationRating, setRecommendationRating] = useState(0);

  // Additional sections
  const [additionalSections, setAdditionalSections] = useState<Array<{ title: string; content: string }>>([]);
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [customSectionTitle, setCustomSectionTitle] = useState('');
  const [sectionSearchTerm, setSectionSearchTerm] = useState('');
  const [filteredSectionOptions, setFilteredSectionOptions] = useState<string[]>([]);

  // File refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const exampleFileRef = useRef<HTMLInputElement>(null);

  const handleEndorsementChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEndorsement(e.target.value);
    updateCharacterCount(e.target.value, uploadedFile);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setUploadedFile(file);
    updateCharacterCount(endorsement, file);
  };

  const updateCharacterCount = (text: string, file: File | null) => {
    let count = text.length;
    if (file) {
      count += Math.round(file.size / 10);
    }
    setCharacterCount(count);
  };

  const removeUploadedFile = () => {
    setUploadedFile(null);
    updateCharacterCount(endorsement, null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatPhoneNumber = (value: string) => {
    const phoneNumber = value.replace(/\D/g, '');
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedNumber = formatPhoneNumber(e.target.value);
    setPhoneNumber(formattedNumber);
  };

  const addAdditionalSection = (title: string) => {
    if (additionalSections.length < 3 && !additionalSections.some(section => section.title === title)) {
      setAdditionalSections([...additionalSections, { title, content: '' }]);
      setIsAddingSection(false);
      setCustomSectionTitle('');
      setSectionSearchTerm('');
    }
  };

  const removeAdditionalSection = (title: string) => {
    setAdditionalSections(additionalSections.filter(section => section.title !== title));
  };

  const updateAdditionalSectionContent = (title: string, content: string) => {
    setAdditionalSections(additionalSections.map(section => 
      section.title === title ? { ...section, content } : section
    ));
  };

  const handleSubmit = async () => {
    if (characterCount < 750) {
      toast.error('Please provide a written reference of at least 750 characters.');
      return;
    }

    try {
      // Handle form submission logic here
      toast.success('Reference submitted successfully!');
    } catch (error) {
      toast.error('Failed to submit reference. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle>Write a Reference</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Information */}
            <section className="space-y-4">
              <div className="space-y-2">
                <Label>Your Name</Label>
                <Input value={currentUser.name} disabled />
              </div>
              <div className="space-y-2">
                <Label>Your LinkedIn</Label>
                <Input value={currentUser.linkedin} disabled />
              </div>
              <div className="space-y-2">
                <Label>Email (Optional)</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label>Phone Number (Optional)</Label>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center">
                    <span className="mr-1 text-sm font-medium">+</span>
                    <Input
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value.replace(/\D/g, '').slice(0, 3))}
                      className="w-16"
                      placeholder="Code"
                      maxLength={3}
                    />
                  </div>
                  <Input
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    placeholder="(555) 123-4567"
                    maxLength={14}
                  />
                </div>
              </div>
            </section>

            {/* Relationship */}
            <section className="space-y-4">
              <div className="space-y-2">
                <Label>{`Your relationship to ${targetUser.name}`}</Label>
                <Select value={relationship} onValueChange={setRelationship}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select relationship" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="colleague">Colleague</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="directReport">Direct Report</SelectItem>
                    <SelectItem value="client">Client</SelectItem>
                    <SelectItem value="vendor">Vendor</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {relationship && (
                <div className="space-y-2">
                  <Label>{`${targetUser.name} was a ${position || '[position]'} at`}</Label>
                  <Input
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Enter company name"
                  />
                </div>
              )}

              {company && (
                <div className="space-y-2">
                  <Label>Position</Label>
                  <Input
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    placeholder="Enter position"
                  />
                </div>
              )}
            </section>

            {/* Duration */}
            <section className="space-y-4">
              <div className="space-y-2">
                <Label>{`How long have you known ${targetUser.name}?`}</Label>
                <Select value={timeKnown} onValueChange={setTimeKnown}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="less-than-1">Less than 1 year</SelectItem>
                    <SelectItem value="1-2">1-2 years</SelectItem>
                    <SelectItem value="2-5">2-5 years</SelectItem>
                    <SelectItem value="5-10">5-10 years</SelectItem>
                    <SelectItem value="10+">10+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </section>

            {/* Written Reference */}
            <section className="space-y-4">
              <div className="space-y-2">
                <Label>Written Reference</Label>
                <Textarea
                  value={endorsement}
                  onChange={handleEndorsementChange}
                  placeholder="Write your reference here... (Minimum 750 characters)"
                  className="min-h-[200px]"
                />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {characterCount < 750 
                      ? `${750 - characterCount} more characters needed` 
                      : `${characterCount} characters (minimum met)`}
                  </span>
                  <div className="flex items-center space-x-2">
                    {uploadedFile && (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">{uploadedFile.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={removeUploadedFile}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </div>
            </section>

            {/* Rating */}
            <section className="space-y-4">
              <div className="space-y-2">
                <Label>
                  {`Your friend is hiring for a job that ${targetUser.name} has all prequalifications for. How likely are you to recommend ${targetUser.name} for this position?`}
                </Label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <Button
                      key={rating}
                      type="button"
                      variant="ghost"
                      size="lg"
                      className={cn(
                        "p-0 w-12 h-12",
                        rating <= recommendationRating ? "text-yellow-400" : "text-gray-300"
                      )}
                      onClick={() => setRecommendationRating(rating)}
                    >
                      <Star className="w-10 h-10 fill-current" />
                    </Button>
                  ))}
                </div>
              </div>
            </section>

            {/* Examples */}
            <section className="space-y-4">
              <div className="space-y-2">
                <Label>Examples of Work or Collaboration</Label>
                <Textarea
                  value={examplesText}
                  onChange={(e) => setExamplesText(e.target.value)}
                  placeholder="Describe specific projects, achievements, or instances of collaboration..."
                  className="min-h-[200px]"
                />
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    {exampleFile && (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">{exampleFile.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setExampleFile(null);
                            if (exampleFileRef.current) {
                              exampleFileRef.current.value = '';
                            }
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => exampleFileRef.current?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </Button>
                  </div>
                </div>
                <input
                  ref={exampleFileRef}
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setExampleFile(file);
                    }
                  }}
                />
              </div>
            </section>

            {/* Additional Sections */}
            <section className="space-y-4">
              <div className="space-y-2">
                <Label>Additional Sections (Optional, add up to 3)</Label>
                {additionalSections.map((section) => (
                  <Card key={section.title} className="transition-all duration-200 ease-in-out hover:shadow-md">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">{section.title}</CardTitle>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAdditionalSection(section.title)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Textarea
                        value={section.content}
                        onChange={(e) => updateAdditionalSectionContent(section.title, e.target.value)}
                        placeholder={sectionDescriptions[section.title] || `Provide details about ${section.title.toLowerCase()}...`}
                        className="min-h-[100px]"
                      />
                    </CardContent>
                  </Card>
                ))}
                {additionalSections.length < 3 && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setIsAddingSection(true)}
                  >
                    Add section
                  </Button>
                )}
              </div>
            </section>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={characterCount < 750}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Submit Reference
            </Button>
          </CardContent>
        </Card>
      </main>

      {/* Additional Section Dialog */}
      <Dialog open={isAddingSection} onOpenChange={setIsAddingSection}>
        <DialogContent className="sm:max-w-[600px] p-6">
          <DialogHeader>
            <DialogTitle>Add Additional Section</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="sectionSearch">Search Section Title</Label>
              <Input
                id="sectionSearch"
                value={sectionSearchTerm}
                onChange={(e) => setSectionSearchTerm(e.target.value)}
                placeholder="Search for a section title"
              />
            </div>
            <div className="mt-4">
              <Label className="text-sm font-medium">
                {sectionSearchTerm === '' ? 'All sections' : 'Matching sections'}
              </Label>
              <ScrollArea className="h-[200px] w-full rounded-md border p-4 mt-2">
                <div className="flex flex-wrap gap-2">
                  {filteredSectionOptions.map((option) => (
                    <Badge
                      key={option}
                      variant="outline"
                      className="px-3 py-1 text-sm font-medium rounded-full cursor-pointer"
                      onClick={() => {
                        addAdditionalSection(option);
                        setIsAddingSection(false);
                      }}
                    >
                      {option}
                    </Badge>
                  ))}
                </div>
              </ScrollArea>
            </div>
            <div className="space-y-2">
              <Label htmlFor="customSectionTitle">Custom Section Title</Label>
              <Input
                id="customSectionTitle"
                value={customSectionTitle}
                onChange={(e) => setCustomSectionTitle(e.target.value)}
                placeholder="Enter a custom section title"
              />
            </div>
          </div>
          <Button 
            onClick={() => {
              if (customSectionTitle) {
                addAdditionalSection(customSectionTitle);
              }
            }}
            className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Add Custom Section
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}