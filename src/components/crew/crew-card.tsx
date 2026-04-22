
'use client';

import type { Character } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CharacterPanel } from '@/components/game/character-panel';


type CrewCardProps = {
    character: Character;
};

export function CrewCard({ character }: CrewCardProps) {
    return <CharacterPanel character={character} />;
}
