
'use client';

import type { Character } from '@/lib/types';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { HeartPulse, ShieldAlert, AlertTriangle, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type CrewMemberCardProps = {
  character: Character;
};

const CrewMemberCard = ({ character }: CrewMemberCardProps) => {
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

  return (
    <div className="flex h-full items-center gap-3 rounded-lg bg-black/60 p-3 text-white backdrop-blur-sm border border-white/20">
      <div className="relative aspect-square w-14 flex-shrink-0">
        <Image
          src={avatarImage?.imageUrl || ''}
          alt={character.name}
          fill
          className="rounded-full object-cover border-2 border-white/30"
          data-ai-hint={avatarImage?.imageHint}
        />
      </div>
      <div className="flex h-full flex-col justify-between flex-grow space-y-2">
        <div>
            <p className="font-bold truncate">{character.name}</p>
            <p className="text-xs text-white/70">{character.class}</p>
        </div>
        <div className="space-y-1">
            <TooltipProvider>
                <div className="flex items-center gap-3 text-xs">
                    <Tooltip>
                      <TooltipTrigger className="flex items-center gap-1.5">
                        <HeartPulse className="h-3.5 w-3.5 text-red-400" />
                        <span>{character.health.current}/{character.health.max}</span>
                      </TooltipTrigger>
                      <TooltipContent>Health: {character.health.current} / {character.health.max}</TooltipContent>
                    </Tooltip>
                     <Tooltip>
                      <TooltipTrigger className="flex items-center gap-1.5">
                        <ShieldAlert className="h-3.5 w-3.5 text-yellow-400" />
                        <span>{character.wounds.current}/{character.wounds.max}</span>
                      </TooltipTrigger>
                      <TooltipContent>Wounds: {character.wounds.current} / {character.wounds.max}</TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger className="flex items-center gap-1.5">
                        <AlertTriangle className="h-3.5 w-3.5 text-purple-400" />
                        <span>{character.stress.current}/{character.stress.min}</span>
                      </TooltipTrigger>
                       <TooltipContent>Stress: {character.stress.current} (Min: {character.stress.min})</TooltipContent>
                    </Tooltip>
                </div>
                {character.location && (
                    <div className="flex items-center gap-1.5 text-xs text-white/70 pt-1">
                        <MapPin className="h-3 w-3" />
                        <span>{character.location}</span>
                    </div>
                )}
            </TooltipProvider>
        </div>
      </div>
    </div>
  );
};

type CrewRosterProps = {
  crew: Character[];
  currentPlayerId?: string | null;
  isOpen: boolean;
};

export function CrewRoster({ crew, currentPlayerId, isOpen }: CrewRosterProps) {
  // Filter out the character whose playerId matches the current user's ID
  const otherCrewMembers = crew.filter(
    (member) => member.playerId !== currentPlayerId
  );

  if (otherCrewMembers.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        'absolute top-16 right-4 z-10 w-64 space-y-2 transition-transform duration-300 ease-in-out',
        isOpen ? 'translate-x-0' : 'translate-x-[calc(100%+2rem)]'
      )}
    >
      {otherCrewMembers.map((character) => (
        <CrewMemberCard key={character.id || character.name} character={character} />
      ))}
    </div>
  );
}
