import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface Skill {
  name: string;
  type: 'soft' | 'hard';
}

interface SkillsSectionProps {
  skills: Skill[];
}

export function SkillsSection({ skills }: SkillsSectionProps) {
  const softSkills = skills.filter(skill => skill.type === 'soft');
  const hardSkills = skills.filter(skill => skill.type === 'hard');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {softSkills.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-2">Soft Skills</h3>
            <div className="flex flex-wrap gap-2">
              {softSkills.map((skill, index) => (
                <Badge
                  key={index}
                  className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100"
                >
                  {skill.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {hardSkills.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-2">Technical Skills</h3>
            <div className="flex flex-wrap gap-2">
              {hardSkills.map((skill, index) => (
                <Badge
                  key={index}
                  className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                >
                  {skill.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {skills.length === 0 && (
          <p className="text-center text-muted-foreground">
            No skills added yet
          </p>
        )}
      </CardContent>
    </Card>
  );
}