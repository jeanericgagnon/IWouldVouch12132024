import { useState, useEffect } from 'react';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Card, CardTitle } from "../ui/card";
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

  useEffect(() => {
    const filtered = softSkills.filter(skill => 
      skill.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSkills(filtered);
  }, [searchTerm]);

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
      <Label>Skills</Label>
      <div className="flex flex-col sm:flex-row gap-4">
        <Card className="flex-1 p-4">
          <CardTitle className="text-lg mb-2">Soft Skills ({skills.filter(s => s.type === 'soft').length}/3)</CardTitle>
          <div className="flex flex-wrap gap-2 mb-4">
            {skills.filter(s => s.type === 'soft').map((skill) => (
              <Badge
                key={skill.name}
                variant="secondary"
                className="bg-[#6b9cc3] text-white px-3 py-1 text-sm font-medium rounded-full"
              >
                {skill.name}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSkill(skill.name, 'soft')}
                  className="ml-1 h-4 w-4 p-0 hover:bg-transparent"
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
          <Button 
            type="button" 
            className="w-full bg-[#52789e] hover:bg-[#6b9cc3] text-white"
            onClick={() => {
              setSkillType('soft');
              setIsAddingSkill(true);
            }}
          >
            Add Soft Skill
          </Button>
        </Card>

        <Card className="flex-1 p-4">
          <CardTitle className="text-lg mb-2">Hard Skills ({skills.filter(s => s.type === 'hard').length}/5)</CardTitle>
          <div className="flex flex-wrap gap-2 mb-4">
            {skills.filter(s => s.type === 'hard').map((skill) => (
              <Badge
                key={skill.name}
                variant="secondary"
                className="bg-[#52789e] text-white px-3 py-1 text-sm font-medium rounded-full"
              >
                {skill.name}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleSkill(skill.name, 'hard')}
                  className="ml-1 h-4 w-4 p-0 hover:bg-transparent"
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
          <Button 
            type="button" 
            className="w-full bg-[#52789e] hover:bg-[#6b9cc3] text-white"
            onClick={() => {
              setSkillType('hard');
              setIsAddingSkill(true);
            }}
          >
            Add Hard Skill
          </Button>
        </Card>
      </div>

      <Dialog open={isAddingSkill} onOpenChange={setIsAddingSkill}>
        <DialogContent className="sm:max-w-[425px]">
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