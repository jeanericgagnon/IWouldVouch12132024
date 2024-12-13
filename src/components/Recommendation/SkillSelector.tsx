import { useState } from 'react';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import { X, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface SkillSelectorProps {
  skills: Array<{ name: string; type: 'soft' | 'hard' }>;
  onSkillsChange: (skills: Array<{ name: string; type: 'soft' | 'hard' }>) => void;
}

const softSkills = [
  "Communication", "Teamwork", "Adaptability", "Problem-solving", "Time management",
  "Leadership", "Creativity", "Work ethic", "Attention to detail", "Conflict resolution",
  "Emotional intelligence", "Decision-making", "Interpersonal skills", "Flexibility",
  "Critical thinking", "Collaboration", "Self-motivation", "Empathy", "Patience",
  "Listening skills"
];

export function SkillSelector({ skills, onSkillsChange }: SkillSelectorProps) {
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [skillType, setSkillType] = useState<'soft' | 'hard'>('soft');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredSkills, setFilteredSkills] = useState(softSkills);
  const [newHardSkill, setNewHardSkill] = useState('');

  const toggleSkill = (skill: string, type: 'soft' | 'hard') => {
    const maxSkills = type === 'soft' ? 3 : 5;
    const currentTypeSkills = skills.filter(s => s.type === type);
    
    if (currentTypeSkills.length >= maxSkills && !skills.some(s => s.name === skill && s.type === type)) {
      toast.error(`You can only add up to ${maxSkills} ${type} skills`);
      return;
    }

    const newSkills = skills.some(s => s.name === skill && s.type === type)
      ? skills.filter(s => !(s.name === skill && s.type === type))
      : [...skills, { name: skill, type }];
    
    onSkillsChange(newSkills);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label>Skills</Label>
        <div className="space-x-2">
          <Button
            type="button"
            onClick={() => {
              setSkillType('soft');
              setIsAddingSkill(true);
            }}
            className="bg-[#52789e] hover:bg-[#6b9cc3] text-white"
          >
            Add Soft Skill
          </Button>
          <Button
            type="button"
            onClick={() => {
              setSkillType('hard');
              setIsAddingSkill(true);
            }}
            className="bg-[#52789e] hover:bg-[#6b9cc3] text-white"
          >
            Add Hard Skill
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {skills.map((skill, index) => (
          <Badge
            key={index}
            variant="secondary"
            className={skill.type === 'soft' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}
          >
            {skill.name}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => toggleSkill(skill.name, skill.type)}
              className="ml-1 h-4 w-4 p-0 hover:bg-transparent"
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
      </div>

      <Dialog open={isAddingSkill} onOpenChange={setIsAddingSkill}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add {skillType === 'soft' ? 'Soft' : 'Hard'} Skill</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {skillType === 'soft' ? (
              <>
                <Input
                  placeholder="Search soft skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <ScrollArea className="h-[200px]">
                  <div className="space-y-2">
                    {filteredSkills.map((skill) => (
                      <div
                        key={skill}
                        className="flex items-center space-x-2 p-2 hover:bg-accent rounded-md cursor-pointer"
                        onClick={() => toggleSkill(skill, 'soft')}
                      >
                        <div className="flex-1">{skill}</div>
                        {skills.some(s => s.name === skill && s.type === 'soft') && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </>
            ) : (
              <div className="space-y-4">
                <Input
                  placeholder="Enter hard skill name..."
                  value={newHardSkill}
                  onChange={(e) => setNewHardSkill(e.target.value)}
                />
                <Button
                  className="w-full bg-[#52789e] hover:bg-[#6b9cc3] text-white"
                  onClick={() => {
                    if (newHardSkill.trim()) {
                      toggleSkill(newHardSkill.trim(), 'hard');
                      setNewHardSkill('');
                      setIsAddingSkill(false);
                    }
                  }}
                >
                  Add Skill
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}