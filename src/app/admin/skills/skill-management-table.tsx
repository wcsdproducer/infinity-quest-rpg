
'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  skillCatalog,
  type SkillDefinition,
  type SkillLevel,
  SkillName,
} from '@/lib/skills';

export function SkillManagementTable() {
  const categorizedSkills: Record<SkillLevel, SkillDefinition[]> = {
    Trained: [],
    Expert: [],
    Master: [],
  };

  for (const key in skillCatalog) {
    const skill = skillCatalog[key as keyof typeof skillCatalog];
    categorizedSkills[skill.level].push(skill);
  }

  const getPrerequisiteText = (skill: SkillDefinition) => {
    if (skill.prerequisites.length === 0) {
      return 'Basic Skill';
    }

    if (skill.level !== 'Master') {
      return `Req: ${skill.prerequisites.join(', ')}`;
    }

    // For Master skills, show the next level of prerequisites
    const prereqStrings = skill.prerequisites.map((prereqName) => {
      const prereqSkill = skillCatalog[prereqName as SkillName];
      if (prereqSkill && prereqSkill.prerequisites.length > 0) {
        return `${prereqName} (Req: ${prereqSkill.prerequisites.join(', ')})`;
      }
      return prereqName;
    });

    return `Req: ${prereqStrings.join('; ')}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills & Prerequisites</CardTitle>
        <CardDescription>
          This is a read-only view of the game's hardcoded skill catalog.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(['Trained', 'Expert', 'Master'] as SkillLevel[]).map((level) => (
            <div key={level} className="space-y-4">
              <h3 className="text-lg font-semibold uppercase tracking-wider text-muted-foreground pb-2 border-b">
                {level} Skills
              </h3>
              <div className="space-y-4">
                {categorizedSkills[level].map((skill) => (
                  <div key={skill.name} className="space-y-1">
                    <label className="font-medium">{skill.name}</label>
                    <p className="text-sm text-muted-foreground min-h-[40px] italic">
                      {getPrerequisiteText(skill)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
