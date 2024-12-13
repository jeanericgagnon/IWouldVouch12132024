import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../ui/card";
import { Button } from "../../../ui/button";
import { Badge } from "../../../ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../ui/dialog";
import { Input } from "../../../ui/input";
import { ScrollArea } from "../../../ui/scroll-area";
import { X, Check } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Skill {
  name: string;
  type: 'soft' | 'hard';
}

interface SkillsSectionProps {
  skills: Skill[];
  onChange: (skills: Skill[]) => void;
}

const softSkills = [
  "Communication", "Teamwork", "Adaptability", "Problem-solving", "Time management",
  "Leadership", "Creativity", "Work ethic", "Attention to detail", "Conflict resolution",
  "Emotional intelligence", "Decision-making", "Interpersonal skills", "Flexibility",
  "Critical thinking", "Collaboration", "Self-motivation", "Empathy", "Patience",
  "Listening skills"
];

export function SkillsSection({ skills, onChange }: SkillsSectionProps) {
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [skillType, setSkillType] = useState<'soft' | 'hard'>('soft');
  const [searchTerm, setSearchTerm] = useState('');
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
    
    onChange(newSkills);
  };

  const filteredSoftSkills = softSkills.filter(skill =>
    skill.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills</CardTitle>
        <CardDescription>Add your professional skills</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={() => {
              setSkillType('soft');
              setIsAddingSkill(true);
            }}
            className="bg-[#52789e] hover:bg-[#6b9cc3] text-white"
          >
            Add Soft Skill ({skills.filter(s => s.type === 'soft').length}/3)
          </Button>
          <Button
            onClick={() => {
              setSkillType('hard');
              setIsAddingSkill(true);
            }}
            className="bg-[#52789e] hover:bg-[#6b9cc3] text-white"
          >
            Add Hard Skill ({skills.filter(s => s.type === 'hard').length}/5)
          </Button>
        </div>

        <div className="space-y-4">
          {skills.length > 0 && (
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
          )}
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
                      {filteredSoftSkills.map((skill) => (
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
      </CardContent>
    </Card>
  );
}