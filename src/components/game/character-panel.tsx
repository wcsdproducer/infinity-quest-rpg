
'use client';

import {
  HeartPulse,
  BookUser,
  Brain,
  Wrench,
  Boxes,
  Briefcase,
} from 'lucide-react';
import Image from 'next/image';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { Character, Skill } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { skillCatalog, SkillName } from '@/lib/skills';
import { ScrollArea } from '@/components/ui/scroll-area';

type CharacterPanelProps = {
  character: Character;
  activeStat?: string;
  playerNumber?: number;
  compact?: boolean;
};

// Full-size stat block used in game view
const StatBlock = ({
  label,
  abbreviation,
  value,
  modifier,
  isActive,
}: {
  label: string;
  abbreviation: string;
  value: number;
  modifier: number;
  isActive?: boolean;
}) => (
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger>
                <div className={cn(
                    "flex flex-col items-center justify-center px-3 py-2 rounded-md transition-colors", 
                    'bg-muted/50',
                    isActive ? 'bg-green-400/20' : ''
                )}>
                    <div className="text-xs font-medium text-muted-foreground">{abbreviation}</div>
                    <div className={cn("font-mono text-xl font-bold")}>
                        {value}
                        <span className={cn(
                            "text-sm font-normal ml-1",
                            modifier < 0 ? "text-red-400" : ""
                        )}>
                           ({modifier > 0 ? '+' : ''}{modifier})
                        </span>
                    </div>
                </div>
            </TooltipTrigger>
            <TooltipContent>
                <p>{label}: {value} (Base) {modifier > 0 ? '+' : ''}{modifier} (Class) = {value + modifier} (Total)</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
);

// Tiny stat cell used in compact mode
const MiniStat = ({ label, value, modifier }: { label: string; value: number; modifier: number }) => (
  <div className="flex flex-col items-center bg-muted/50 rounded py-1">
    <span className="text-[9px] text-muted-foreground uppercase leading-none">{label}</span>
    <span className="font-mono text-xs font-bold leading-tight">{value}</span>
    <span className={cn("text-[9px] leading-none", modifier < 0 ? "text-red-400" : "text-muted-foreground")}>
      {modifier > 0 ? '+' : ''}{modifier}
    </span>
  </div>
);

const SkillLevelIndicator = ({ level }: { level: Skill['level'] }) => {
    const levelMap = {
      'Trained': 1,
      'Expert': 2,
      'Master': 3,
    };
    const filledBars = levelMap[level];
  
    return (
      <div className="flex items-center gap-1">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-3 w-1 rounded-sm',
              i < filledBars ? 'bg-primary' : 'bg-muted/50'
            )}
          />
        ))}
      </div>
    );
  };

export function CharacterPanel({ character, activeStat, playerNumber, compact }: CharacterPanelProps) {
  let avatarId = 'character-avatar';
  if (character.class === 'Android') {
    avatarId = 'character-avatar-android';
  } else if (character.class === 'Marine') {
    avatarId = 'character-avatar-marine';
  } else if (character.class === 'Teamster') {
    avatarId = 'character-avatar-teamster';
  } else if (character.class === 'Scientist') {
    avatarId = 'character-avatar-scientist';
  }
  const avatarImage = PlaceHolderImages.find((img) => img.id === avatarId);

  const prerequisiteSkills = new Set<string>();
  character.skills.forEach(skill => {
      const skillDef = skillCatalog[skill.name as SkillName];
      if (skillDef?.prerequisites) {
          skillDef.prerequisites.forEach(prereq => prerequisiteSkills.add(prereq));
      }
  });

  const displayedSkills = character.skills.filter(skill => !prerequisiteSkills.has(skill.name));

    const calculateMaxItems = (strength: number, inventory: string[]) => {
        let maxItems;
        if (strength <= 10) maxItems = 5;
        else if (strength <= 20) maxItems = 7;
        else if (strength <= 30) maxItems = 9;
        else if (strength <= 40) maxItems = 11;
        else maxItems = 13;

        if (inventory.some(item => item.toLowerCase().includes('backpack'))) {
            maxItems += 2;
        }

        const heavyArmor = ["body armor", "armored chassis", "combat armor", "armored vaccsuit"];
        if (inventory.some(item => heavyArmor.includes(item.toLowerCase()))) {
            maxItems -= 2;
        }

        return maxItems;
    };

    const totalStrength = character.stats.strength + character.modifiers.stats.strength;
    const maxItems = calculateMaxItems(totalStrength, character.inventory);
    const currentItems = character.inventory.length;

  // ─── COMPACT LAYOUT ──────────────────────────────────────────────────────────
  if (compact) {
    return (
      <Card className="overflow-hidden flex flex-col h-full">
        {/* Portrait — landscape, fixed height */}
        <div className="relative w-full" style={{ height: '120px', flexShrink: 0 }}>
          {avatarImage && (
            <Image
              src={avatarImage.imageUrl}
              alt={character.name}
              fill
              className="object-cover object-top"
              data-ai-hint={avatarImage.imageHint}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
          <div className="absolute top-1 right-1">
            {character.playerId ? (
              <Badge variant="default" className="bg-green-600/80 text-white text-[9px] px-1 py-0 leading-tight">
                P{playerNumber}
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-gray-600/80 text-white text-[9px] px-1 py-0 leading-tight">NPC</Badge>
            )}
          </div>
          <div className="absolute bottom-0 left-0 px-2 pb-1">
            <h2 className="font-headline font-bold text-white text-[11px] leading-tight">{character.name}</h2>
            <p className="text-white/70 text-[9px] leading-tight">{character.class}</p>
          </div>
        </div>

        {/* Body */}
        <CardContent className="p-1.5 flex flex-col flex-1 min-h-0 gap-1">
          {/* Vitals row */}
          <div className="grid grid-cols-4 gap-0.5 text-center">
            <div>
              <p className="text-[8px] text-muted-foreground uppercase leading-none">HP</p>
              <p className="font-mono text-[10px] font-bold">{character.health.current}/{character.health.max}</p>
            </div>
            <div>
              <p className="text-[8px] text-muted-foreground uppercase leading-none">ARM</p>
              <p className="font-mono text-[10px] font-bold">{character.armorPoints}</p>
            </div>
            <div>
              <p className="text-[8px] text-muted-foreground uppercase leading-none">WND</p>
              <p className="font-mono text-[10px] font-bold">{character.wounds.current}/{character.wounds.max}</p>
            </div>
            <div>
              <p className="text-[8px] text-muted-foreground uppercase leading-none">STR</p>
              <p className="font-mono text-[10px] font-bold">{character.stress.current}/{character.stress.min}</p>
            </div>
          </div>

          {/* Icon-only tabs */}
          <Tabs defaultValue="stats" className="flex flex-col flex-1 min-h-0">
            <TabsList className="grid w-full grid-cols-4 h-7 p-0.5">
              <TabsTrigger value="bio" className="px-0 h-full">
                <BookUser className="h-3 w-3" />
              </TabsTrigger>
              <TabsTrigger value="stats" className="px-0 h-full">
                <Brain className="h-3 w-3" />
              </TabsTrigger>
              <TabsTrigger value="skills" className="px-0 h-full">
                <Wrench className="h-3 w-3" />
              </TabsTrigger>
              <TabsTrigger value="inventory" className="px-0 h-full">
                <Boxes className="h-3 w-3" />
              </TabsTrigger>
            </TabsList>

            <TabsContent value="bio" className="flex-1 min-h-0 mt-1 overflow-hidden">
              <ScrollArea className="h-full">
                <p className="text-[9px] text-muted-foreground leading-snug">{character.description || 'No description.'}</p>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="stats" className="mt-1">
              <div className="grid grid-cols-4 gap-0.5 mb-1">
                <MiniStat label="STR" value={character.stats.strength} modifier={character.modifiers.stats.strength} />
                <MiniStat label="SPD" value={character.stats.speed} modifier={character.modifiers.stats.speed} />
                <MiniStat label="INT" value={character.stats.intellect} modifier={character.modifiers.stats.intellect} />
                <MiniStat label="CMB" value={character.stats.combat} modifier={character.modifiers.stats.combat} />
              </div>
              <div className="grid grid-cols-3 gap-0.5">
                <MiniStat label="SAN" value={character.saves.sanity} modifier={character.modifiers.saves.sanity} />
                <MiniStat label="FEAR" value={character.saves.fear} modifier={character.modifiers.saves.fear} />
                <MiniStat label="BODY" value={character.saves.body} modifier={character.modifiers.saves.body} />
              </div>
            </TabsContent>

            <TabsContent value="skills" className="flex-1 min-h-0 mt-1 overflow-hidden">
              <ScrollArea className="h-full">
                <ul className="space-y-1">
                  {displayedSkills.map((skill) => (
                    <li key={skill.name} className="flex items-center justify-between">
                      <span className="text-[9px] leading-tight">{skill.name}</span>
                      <SkillLevelIndicator level={skill.level} />
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="inventory" className="flex-1 min-h-0 mt-1 overflow-hidden">
              <ScrollArea className="h-full">
                <ul className="space-y-0.5">
                  {character.inventory.map((item) => (
                    <li key={item} className="text-[9px] text-muted-foreground leading-tight">{item}</li>
                  ))}
                </ul>
              </ScrollArea>
            </TabsContent>
          </Tabs>

          {/* Credits only — no High Score in compact */}
          <div className="flex-shrink-0 flex justify-end">
            <div className="inline-flex items-center rounded-full overflow-hidden border border-white/20 text-white">
              <div className="bg-muted px-2 py-[1px]">
                <span className="font-bold text-[8px] uppercase">Credits</span>
              </div>
              <div className="px-1.5 py-[1px]">
                <span className="font-mono font-bold text-[9px]">Ȼ {character.credits}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // ─── FULL LAYOUT (game view) ──────────────────────────────────────────────────
  return (
    <Card className="overflow-hidden flex-1 flex flex-col">
      <div className="relative w-full aspect-[3/4]">
        {avatarImage && (
          <Image
            src={avatarImage.imageUrl}
            alt={character.name}
            fill
            className="object-cover object-center"
            data-ai-hint={avatarImage.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute top-2 right-2">
            {character.playerId ? (
                <Badge variant="default" className="bg-green-600/80 text-white text-[10px] px-1.5 py-0">
                    P{playerNumber}
                </Badge>
            ) : (
                <Badge variant="secondary" className="bg-gray-600/80 text-white text-[10px] px-1.5 py-0">NPC</Badge>
            )}
        </div>
        <div className="absolute bottom-0 left-0 p-2 text-left">
            <h2 className="font-headline font-bold text-white leading-tight text-lg">{character.name}</h2>
            <p className="text-white/80 text-base">{character.class}</p>
        </div>
      </div>
      <CardContent className="flex-1 flex flex-col p-4">
        <div className="space-y-1">
          <TooltipProvider>
            <div className="grid grid-cols-4 text-center gap-4">
              <Tooltip>
                <TooltipTrigger>
                  <div>
                    <p className="text-[9px] text-muted-foreground uppercase">HP</p>
                    <p className="font-mono font-bold text-xl">
                      {character.health.current}/{character.health.max}
                    </p>
                  </div>
                </TooltipTrigger>
                <TooltipContent><p>Health: {character.health.current} / {character.health.max}</p></TooltipContent>
              </Tooltip>
               <Tooltip>
                <TooltipTrigger>
                  <div>
                    <p className="text-[9px] text-muted-foreground uppercase">ARM</p>
                    <p className="font-mono font-bold text-xl">
                      {character.armorPoints}
                    </p>
                  </div>
                </TooltipTrigger>
                <TooltipContent><p>Armor Points: {character.armorPoints}</p></TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger>
                  <div>
                    <p className="text-[9px] text-muted-foreground uppercase">WND</p>
                    <p className="font-mono font-bold text-xl">
                      {character.wounds.current}/{character.wounds.max}
                    </p>
                  </div>
                </TooltipTrigger>
                <TooltipContent><p>Wounds: {character.wounds.current} / {character.wounds.max}</p></TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger>
                   <div>
                    <p className="text-[9px] text-muted-foreground uppercase">STR</p>
                    <p className="font-mono font-bold text-xl">
                      {character.stress.current}/{character.stress.min}
                    </p>
                  </div>
                </TooltipTrigger>
                <TooltipContent><p>Stress: {character.stress.current} / Min: {character.stress.min}</p></TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </div>

        <Tabs defaultValue="stats" className="w-full mt-2">
            <TabsList className="grid w-full grid-cols-4 mt-2">
              <TabsTrigger value="bio">
                <BookUser className="mr-1 h-4 w-4" />
                Bio
              </TabsTrigger>
              <TabsTrigger value="stats">
                <Brain className="mr-1 h-4 w-4" />
                Stats
              </TabsTrigger>
              <TabsTrigger value="skills">
                <Wrench className="mr-1 h-4 w-4" />
                Skills
              </TabsTrigger>
              <TabsTrigger value="inventory">
                <Boxes className="mr-1 h-4 w-4" />
                Items
              </TabsTrigger>
            </TabsList>
            <TabsContent value="bio" className="mt-4 space-y-4 text-sm text-muted-foreground text-left flex-1 min-h-0">
                <ScrollArea className="h-full pr-4">
                    <div>
                        <h4 className="font-semibold text-foreground mb-1">Physical Description</h4>
                        <p>{character.description || 'No description available.'}</p>
                    </div>
                    <div className="mt-4">
                        <h4 className="font-semibold text-foreground mb-1">Backstory</h4>
                        <p>{character.backstory || 'No backstory available.'}</p>
                    </div>
                </ScrollArea>
            </TabsContent>
            <TabsContent value="stats" className="mt-4 space-y-4">
                <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Stats</p>
                    <div className="grid grid-cols-4 gap-2">
                        <StatBlock label="Strength" abbreviation="STR" value={character.stats.strength} modifier={character.modifiers.stats.strength} isActive={activeStat === 'Strength'} />
                        <StatBlock label="Speed" abbreviation="SPD" value={character.stats.speed} modifier={character.modifiers.stats.speed} isActive={activeStat === 'Speed'} />
                        <StatBlock label="Intellect" abbreviation="INT" value={character.stats.intellect} modifier={character.modifiers.stats.intellect} isActive={activeStat === 'Intellect'} />
                        <StatBlock label="Combat" abbreviation="CMB" value={character.stats.combat} modifier={character.modifiers.stats.combat} isActive={activeStat === 'Combat'} />
                    </div>
                </div>
                 <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Saves</p>
                    <div className="grid grid-cols-3 gap-2">
                        <StatBlock label="Sanity" abbreviation="SAN" value={character.saves.sanity} modifier={character.modifiers.saves.sanity} isActive={activeStat === 'Sanity'} />
                        <StatBlock label="Fear" abbreviation="FEAR" value={character.saves.fear} modifier={character.modifiers.saves.fear} isActive={activeStat === 'Fear'} />
                        <StatBlock label="Body" abbreviation="BODY" value={character.saves.body} modifier={character.modifiers.saves.body} isActive={activeStat === 'Body'} />
                    </div>
                </div>
            </TabsContent>
            <TabsContent value="skills" className="mt-2 flex-1 min-h-0">
                 <ScrollArea className="h-full">
                    <ul className="space-y-4 text-sm pr-4">
                        {displayedSkills.map((skill) => {
                            const skillDef = skillCatalog[skill.name as SkillName];
                            const prerequisites = skillDef?.prerequisites || [];
                            return (
                                <li key={skill.name} className="flex items-start justify-between">
                                    <div>
                                        <span>{skill.name}</span>
                                        <p className="text-xs text-muted-foreground">
                                            {prerequisites.length > 0 ? prerequisites.join(', ') : 'Basic Skill'}
                                        </p>
                                    </div>
                                    <Badge variant="outline" className="flex items-center justify-start gap-2 text-xs w-24">
                                        <SkillLevelIndicator level={skill.level} />
                                        {skill.level}
                                    </Badge>
                                </li>
                            );
                        })}
                    </ul>
                </ScrollArea>
            </TabsContent>
            <TabsContent value="inventory" className="mt-2 flex-1 flex flex-col min-h-0">
                <div className="flex justify-between items-center mb-2">
                    <div/>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Briefcase className="h-4 w-4" />
                                    <span>{currentItems} / {maxItems}</span>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Carrying Capacity: {currentItems} of {maxItems} items</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
                <ScrollArea className="h-full">
                    <ul className="space-y-1 text-sm pr-4">
                    {character.inventory.map((item) => (
                        <li key={item} className="flex items-start">
                        <span className="shrink-0 text-left font-mono text-muted-foreground mr-2">1x</span>
                        <span>{item}</span>
                        </li>
                    ))}
                    </ul>
                </ScrollArea>
            </TabsContent>
        </Tabs>
        
        <div className="mt-auto pt-4 flex justify-between items-center">
            <div className="inline-flex items-center rounded-full overflow-hidden border border-white/20 text-white font-headline">
                <div className="bg-muted px-3 py-[2px]">
                    <span className="font-bold text-[11px] uppercase">High Score</span>
                </div>
                <div className="bg-transparent px-2 py-[2px] flex items-center">
                    <span className="font-mono font-bold text-sm flex items-center">{character.highScore ?? 0}</span>
                </div>
            </div>

            <div className="inline-flex items-center rounded-full overflow-hidden border border-white/20 text-white font-headline">
                <div className="bg-muted px-3 py-[2px]">
                    <span className="font-bold text-[11px] uppercase">Credits</span>
                </div>
                <div className="bg-transparent px-2 py-[2px] flex items-center">
                    <span className="font-mono font-bold text-sm flex items-center">Ȼ {character.credits}</span>
                </div>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
