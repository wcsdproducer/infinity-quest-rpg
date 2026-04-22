
'use client';

import { Swords, User, Bot } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { Combatant } from '@/ai/schemas';
import { cn } from '@/lib/utils';

type CombatTrackerProps = {
  combatants: Combatant[];
};

export function CombatTracker({ combatants }: CombatTrackerProps) {
  if (!combatants || combatants.length === 0) {
    return (
        <Card className="border-border/50 bg-background/80 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline text-lg">
                <Swords className="h-5 w-5" />
                Combat Tracker
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex h-24 items-center justify-center rounded-md border-2 border-dashed bg-muted/50">
                <p className="text-sm text-muted-foreground">No active combat.</p>
                </div>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card className="border-border/50 bg-background/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline text-lg">
          <Swords className="h-5 w-5 text-destructive" />
          COMBAT ACTIVE
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {combatants.map((c) => (
            <li key={c.id} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                {c.id === 'player' ? (
                    <User className="h-4 w-4 text-green-400" />
                ) : (
                    <Bot className="h-4 w-4 text-red-400" />
                )}
                <span className={cn(c.id === 'player' ? 'font-semibold' : '')}>{c.name}</span>
              </div>
              <span className="text-muted-foreground">{c.status}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
