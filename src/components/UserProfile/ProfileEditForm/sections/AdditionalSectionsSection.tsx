import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../ui/card";
import { Button } from "../../../ui/button";
import { Input } from "../../../ui/input";
import { Label } from "../../../ui/label";
import { Textarea } from "../../../ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../ui/dialog";
import { ScrollArea } from "../../../ui/scroll-area";
import { Badge } from "../../../ui/badge";
import { X } from 'lucide-react';
import { toast } from 'react-hot-toast';

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

interface AdditionalSection {
  title: string;
  content: string;
}

interface AdditionalSectionsSectionProps {
  sections: AdditionalSection[];
  onChange: (sections: AdditionalSection[]) => void;
}

export function AdditionalSectionsSection({ sections, onChange }: AdditionalSectionsSectionProps) {
  const [isAddingSection, setIsAddingSection] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [customTitle, setCustomTitle] = useState('');

  const filteredOptions = additionalSectionOptions.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !sections.some(section => section.title === option)
  );

  const addSection = (title: string) => {
    if (sections.length >= 3) {
      toast.error('You can only add up to 3 additional sections');
      return;
    }

    if (sections.some(section => section.title === title)) {
      toast.error('This section already exists');
      return;
    }

    onChange([...sections, { title, content: '' }]);
    setIsAddingSection(false);
    setSearchTerm('');
    setCustomTitle('');
    toast.success('Section added successfully!');
  };

  const removeSection = (title: string) => {
    onChange(sections.filter(section => section.title !== title));
    toast.success('Section removed successfully!');
  };

  const updateSectionContent = (title: string, content: string) => {
    onChange(sections.map(section =>
      section.title === title ? { ...section, content } : section
    ));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Additional Sections</CardTitle>
        <CardDescription>Add custom sections to your profile</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <Label>Sections ({sections.length}/3)</Label>
          <Button
            onClick={() => setIsAddingSection(true)}
            disabled={sections.length >= 3}
            className="bg-[#52789e] hover:bg-[#6b9cc3] text-white"
          >
            Add Section
          </Button>
        </div>

        {sections.map((section) => (
          <Card key={section.title}>
            <CardContent className="space-y-4 p-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">{section.title}</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSection(section.title)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <Textarea
                value={section.content}
                onChange={(e) => updateSectionContent(section.title, e.target.value)}
                placeholder={sectionDescriptions[section.title] || `Write about ${section.title.toLowerCase()}...`}
                className="min-h-[100px]"
              />
            </CardContent>
          </Card>
        ))}

        <Dialog open={isAddingSection} onOpenChange={setIsAddingSection}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Additional Section</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Search Sections</Label>
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search for a section..."
                />
              </div>

              <ScrollArea className="h-[200px]">
                <div className="space-y-4">
                  {filteredOptions.map((option) => (
                    <div key={option} className="space-y-2">
                      <Badge
                        variant="outline"
                        className="cursor-pointer hover:bg-accent px-3 py-1 text-sm font-medium rounded-full"
                        onClick={() => addSection(option)}
                      >
                        {option}
                      </Badge>
                      <p className="text-sm text-muted-foreground pl-2">
                        {sectionDescriptions[option]}
                      </p>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <div className="space-y-2">
                <Label>Custom Section Title</Label>
                <div className="flex space-x-2">
                  <Input
                    value={customTitle}
                    onChange={(e) => setCustomTitle(e.target.value)}
                    placeholder="Enter custom section title..."
                  />
                  <Button
                    onClick={() => {
                      if (customTitle.trim()) {
                        addSection(customTitle.trim());
                      }
                    }}
                    className="bg-[#52789e] hover:bg-[#6b9cc3] text-white"
                    disabled={!customTitle.trim()}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}