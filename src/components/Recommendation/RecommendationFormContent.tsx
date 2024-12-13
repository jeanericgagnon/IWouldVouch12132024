import { useState } from 'react';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Star, X } from 'lucide-react';
import { cn } from "@/lib/utils";
import { SkillSelector } from './SkillSelector';
import { SupportingDocuments } from './SupportingDocuments';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader } from "../ui/card";

const additionalSectionOptions = [
  "Values Alignment", "Long-Term Impact", "Areas for Development", "Client/Customer Feedback",
  "Collaboration with Leadership", "Contribution to Diversity & Inclusion", "Initiative and Innovation",
  "Contribution to Training/Onboarding", "Stakeholder Management", "Adaptability to Change"
];

const sectionDescriptions: { [key: string]: string } = {
  "Values Alignment": "How do they embody company values? Examples of integrity, teamwork, or innovation.",
  "Long-Term Impact": "What lasting contributions have they made? Projects or initiatives with enduring effects.",
  "Areas for Development": "Growth opportunities they're actively working on. Skills or areas they're improving.",
  "Client/Customer Feedback": "Direct feedback or testimonials from clients/customers about their work.",
  "Collaboration with Leadership": "How they interact with and influence leadership decisions.",
  "Contribution to Diversity & Inclusion": "Their role in creating an inclusive environment and supporting diversity.",
  "Initiative and Innovation": "Examples of proactive problem-solving and innovative solutions.",
  "Contribution to Training/Onboarding": "Their role in helping new team members and improving processes.",
  "Stakeholder Management": "How they handle relationships and balance different needs.",
  "Adaptability to Change": "Examples of adapting to new situations or leading through change."
};

interface RecommendationFormContentProps {
  currentUser: {
    name: string;
    linkedin?: string;
  };
  targetUser: {
    id: string;
    name: string;
  };
  formData: {
    relationship: string;
    company: string;
    duration: string;
    endorsement: string;
    rating: number;
    skills: Array<{ name: string; type: 'soft' | 'hard' }>;
    documents: File[];
    portfolioItems: Array<{ type: string; name: string; url?: string }>;
    additionalSections: Array<{ title: string; content: string }>;
  };
  onFormDataChange: (data: any) => void;
  onSubmit: () => void;
  submitting: boolean;
}

export function RecommendationFormContent({
  currentUser,
  targetUser,
  formData,
  onFormDataChange,
  onSubmit,
  submitting
}: RecommendationFormContentProps) {
  const [characterCount, setCharacterCount] = useState(0);
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [customSectionTitle, setCustomSectionTitle] = useState('');

  const filteredSections = additionalSectionOptions.filter(section => 
    section.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !formData.additionalSections.some(s => s.title === section)
  );

  const handleEndorsementChange = (value: string) => {
    onFormDataChange({ ...formData, endorsement: value });
    setCharacterCount(value.length);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (characterCount < 750) {
      return;
    }
    onSubmit();
  };

  const addSection = (title: string) => {
    if (formData.additionalSections.length >= 3) {
      return;
    }
    onFormDataChange({
      ...formData,
      additionalSections: [
        ...formData.additionalSections,
        { title, content: '' }
      ]
    });
    setIsAddingSection(false);
    setSearchTerm('');
    setCustomSectionTitle('');
  };

  const removeSection = (title: string) => {
    onFormDataChange({
      ...formData,
      additionalSections: formData.additionalSections.filter(s => s.title !== title)
    });
  };

  const updateSectionContent = (title: string, content: string) => {
    onFormDataChange({
      ...formData,
      additionalSections: formData.additionalSections.map(s =>
        s.title === title ? { ...s, content } : s
      )
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Previous sections remain the same */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Your Name</Label>
          <Input value={currentUser.name} disabled />
        </div>
        {currentUser.linkedin && (
          <div className="space-y-2">
            <Label>Your LinkedIn</Label>
            <Input value={currentUser.linkedin} disabled />
          </div>
        )}
      </div>

      {/* Relationship section */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Your Relationship to {targetUser.name}</Label>
          <Select 
            value={formData.relationship}
            onValueChange={(value) => onFormDataChange({ ...formData, relationship: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select relationship type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="colleague">Colleague</SelectItem>
              <SelectItem value="direct-report">Direct Report</SelectItem>
              <SelectItem value="client">Client</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Company/Organization</Label>
          <Input
            value={formData.company}
            onChange={(e) => onFormDataChange({ ...formData, company: e.target.value })}
            placeholder="Where did you work together?"
          />
        </div>

        <div className="space-y-2">
          <Label>Duration</Label>
          <Select
            value={formData.duration}
            onValueChange={(value) => onFormDataChange({ ...formData, duration: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="How long have you known them?" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="less-than-1">Less than 1 year</SelectItem>
              <SelectItem value="1-2">1-2 years</SelectItem>
              <SelectItem value="2-5">2-5 years</SelectItem>
              <SelectItem value="5+">5+ years</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Endorsement section */}
      <div className="space-y-2">
        <Label>Endorsement</Label>
        <Textarea
          value={formData.endorsement}
          onChange={(e) => handleEndorsementChange(e.target.value)}
          placeholder="Write your endorsement here... (minimum 750 characters)"
          className="min-h-[200px]"
        />
        <p className="text-sm text-muted-foreground">
          {characterCount < 750 
            ? `${750 - characterCount} more characters needed` 
            : `${characterCount} characters (minimum met)`}
        </p>
      </div>

      {/* Rating section */}
      <div className="space-y-2">
        <Label>Rating</Label>
        <div className="flex items-center space-x-2">
          {[1, 2, 3, 4, 5].map((rating) => (
            <Button
              key={rating}
              type="button"
              variant="ghost"
              size="lg"
              className={cn(
                "p-0 w-12 h-12",
                rating <= formData.rating ? "text-yellow-400" : "text-gray-300"
              )}
              onClick={() => onFormDataChange({ ...formData, rating })}
            >
              <Star className="w-8 h-8 fill-current" />
            </Button>
          ))}
        </div>
      </div>

      {/* Additional Sections */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label>Additional Sections (Optional)</Label>
          <Button
            type="button"
            onClick={() => setIsAddingSection(true)}
            disabled={formData.additionalSections.length >= 3}
            className="bg-[#52789e] hover:bg-[#6b9cc3] text-white"
          >
            Add Section
          </Button>
        </div>

        {formData.additionalSections.map((section) => (
          <Card key={section.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h4 className="text-sm font-semibold">{section.title}</h4>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeSection(section.title)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <Textarea
                value={section.content}
                onChange={(e) => updateSectionContent(section.title, e.target.value)}
                placeholder={sectionDescriptions[section.title] || `Write about ${section.title.toLowerCase()}...`}
                className="min-h-[100px]"
              />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Skills section */}
      <SkillSelector
        skills={formData.skills}
        onSkillsChange={(skills) => onFormDataChange({ ...formData, skills })}
      />

      {/* Supporting Documents */}
      <SupportingDocuments
        documents={formData.documents}
        onDocumentsChange={(documents) => onFormDataChange({ ...formData, documents })}
      />

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={submitting || characterCount < 750}
        className="w-full bg-[#52789e] hover:bg-[#6b9cc3] text-white"
      >
        {submitting ? 'Submitting...' : 'Submit Recommendation'}
      </Button>

      {/* Add Section Dialog */}
      <Dialog open={isAddingSection} onOpenChange={setIsAddingSection}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Additional Section</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Search Sections</Label>
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for a section..."
              />
            </div>

            <ScrollArea className="h-[200px]">
              <div className="space-y-2">
                {filteredSections.map((section) => (
                  <div key={section} className="space-y-2">
                    <Badge
                      variant="outline"
                      className="cursor-pointer hover:bg-accent px-3 py-1 text-sm font-medium rounded-full"
                      onClick={() => addSection(section)}
                    >
                      {section}
                    </Badge>
                    <p className="text-sm text-muted-foreground pl-2">
                      {sectionDescriptions[section]}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="space-y-2">
              <Label>Custom Section Title</Label>
              <div className="flex space-x-2">
                <Input
                  value={customSectionTitle}
                  onChange={(e) => setCustomSectionTitle(e.target.value)}
                  placeholder="Enter custom section title..."
                />
                <Button
                  onClick={() => {
                    if (customSectionTitle.trim()) {
                      addSection(customSectionTitle.trim());
                    }
                  }}
                  className="bg-[#52789e] hover:bg-[#6b9cc3] text-white"
                  disabled={!customSectionTitle.trim()}
                >
                  Add
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </form>
  );
}