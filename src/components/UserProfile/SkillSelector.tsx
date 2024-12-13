import { useState, useEffect } from 'react';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import { X } from 'lucide-react';
import { Skill } from '../../types/user';

const softSkills = [
  "Communication", "Teamwork", "Adaptability", "Problem-solving", "Time management",
  "Leadership", "Creativity", "Work ethic", "Attention to detail", "Conflict resolution",
  "Emotional intelligence", "Decision-making", "Interpersonal skills", "Flexibility",
  "Critical thinking", "Collaboration", "Self-motivation", "Empathy", "Patience",
  "Listening skills", "Negotiation", "Stress management", "Persuasion", "Cultural awareness",
  "Mentorship", "Resilience", "Integrity", "Accountability", "Delegation", "Public speaking"
];

interface SkillSelectorProps {
  selectedSkills: Skill[];
  onSkillsChange: (skills: Skill[]) => void;
  skillType: 'soft' | 'hard';
  isOpen: boolean;
  onClose: () => void;
}

export function SkillSelector({
  selectedSkills = [],
  onSkillsChange,
  skillType,
  isOpen,
  onClose,
}: SkillSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [newHardSkill, setNewHardSkill] = useState('');
  const [filteredSkills, setFilteredSkills] = useState<string[]>(softSkills);

  useEffect(() => {
    if (skillType === 'soft') {
      const filtered = softSkills.filter(skill => 
        skill.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSkills(filtered);
    }
  }, [searchTerm, skillType]);

  const toggleSoftSkill = (skill: string) => {
    const maxSoftSkills = 3;
    onSkillsChange(prevSkills => {
      const currentSkills = prevSkills || [];
      const isSelected = currentSkills.some(s => s.name === skill && s.type === 'soft');
      
      if (isSelected) {
        return currentSkills.filter(s => s.name !== skill || s.type !== 'soft');
      } else {
        const currentSoftSkills = currentSkills.filter(s => s.type === 'soft');
        if (currentSoftSkills.length < maxSoftSkills) {
          return [...currentSkills, { name: skill, type: 'soft' }];
        }
      }
      return currentSkills;
    });
  };

  const addHardSkill = (skill: string) => {
    const maxHardSkills = 5;
    const currentHardSkills = selectedSkills.filter(s => s.type === 'hard');
    
    if (currentHardSkills.length < maxHardSkills &&
        !selectedSkills.some(s => s.name.toLowerCase() === skill.toLowerCase() && s.type === 'hard')) {
      onSkillsChange([...selectedSkills, { name: skill, type: 'hard' }]);
      setNewHardSkill('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-6">
        <DialogHeader>
          <DialogTitle>Add {skillType} skill</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="skill">Skill</Label>
            {skillType === 'soft' ? (
              <Input
                id="skill"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
                placeholder="Search Soft Skill"
              />
            ) : (
              <Input
                id="skill"
                value={newHardSkill}
                onChange={(e) => setNewHardSkill(e.target.value)}
                className="w-full"
                placeholder="Enter Hard Skill (ex: JavaScript)"
              />
            )}
          </div>
          {skillType === 'soft' && (
            <ScrollArea className="h-[300px] w-full rounded-md border p-4">
              <div className="flex flex-wrap gap-2">
                {filteredSkills.map((skill) => (
                  <Badge
                    key={skill}
                    variant={selectedSkills.some(s => s.name === skill && s.type === 'soft') ? "secondary" : "outline"}
                    className="px-3 py-1 text-sm font-medium rounded-full cursor-pointer"
                    onClick={() => toggleSoftSkill(skill)}
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
        <Button 
          onClick={() => {
            if (skillType === 'hard' && newHardSkill) {
              addHardSkill(newHardSkill);
              onClose();
            } else if (skillType === 'soft') {
              onClose();
            }
          }}
          className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {skillType === 'soft' ? 'Close' : 'Save'}
        </Button>
      </DialogContent>
    </Dialog>
  );
}