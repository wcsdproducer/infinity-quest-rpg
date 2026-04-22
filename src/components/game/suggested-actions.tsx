
'use client';

import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

type SuggestedActionsProps = {
  actions: string[];
  onActionClick: (action: string) => void;
};

export function SuggestedActions({ actions, onActionClick }: SuggestedActionsProps) {
  if (!actions || actions.length === 0) {
    return null;
  }

  return (
    <div className="mt-2 flex flex-wrap items-center gap-2">
      <Sparkles className="h-4 w-4 text-muted-foreground" />
      {actions.map((action, index) => (
        <Button
          key={index}
          variant="outline"
          size="sm"
          className="h-auto px-3 py-1 text-xs"
          onClick={() => onActionClick(action)}
        >
          {action}
        </Button>
      ))}
    </div>
  );
}
