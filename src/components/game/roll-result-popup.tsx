
'use client';

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { ContinueAdventureOutputSchema } from '@/ai/schemas';
import { z } from 'zod';

type RollResultPopupProps = {
  show: boolean;
  outcome?: z.infer<typeof ContinueAdventureOutputSchema>['rollOutcome'];
  narrative?: string;
  onClose: () => void;
};

const getOutcomeStyles = (outcome?: z.infer<typeof ContinueAdventureOutputSchema>['rollOutcome']) => {
  switch (outcome) {
    case 'critical_success':
      return { container: 'text-green-300 border-green-400/50', text: 'font-bold text-green-300' };
    case 'success':
      return { container: 'text-green-400 border-green-400/50', text: 'text-green-400' };
    case 'fail':
      return { container: 'text-red-400 border-red-500/50', text: 'text-red-400' };
    case 'critical_fail':
      return { container: 'text-red-500 border-red-500/50', text: 'font-bold text-red-500' };
    default:
      return { container: 'text-accent border-accent/50', text: '' };
  }
};

const outcomeTextMap = {
    'critical_success': 'Critical Success!',
    'success': 'Success!',
    'fail': 'Failure!',
    'critical_fail': 'Critical Fail!',
    'none': '',
}

export function RollResultPopup({ show, outcome, narrative, onClose }: RollResultPopupProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        // Allow fade-out animation to complete before calling onClose
        setTimeout(onClose, 500); 
      }, 3000); // Popup visible for 3 seconds

      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [show, onClose]);

  if (!outcome) return null;

  const { container: containerClasses, text: textClasses } = getOutcomeStyles(outcome);
  const narrativeText = narrative || outcomeTextMap[outcome] || '';

  return (
    <div
      className={cn(
        'absolute inset-0 z-20 flex items-center justify-center transition-opacity duration-500 pointer-events-none',
        isVisible ? 'opacity-100' : 'opacity-0'
      )}
    >
      <div className={cn(
          "flex flex-col items-center justify-center p-8 rounded-lg bg-black/70 backdrop-blur-sm border-2 shadow-2xl min-w-[300px]",
          containerClasses
      )}>
        <h2 className={cn("text-4xl font-headline mb-2", textClasses)}>{narrativeText}</h2>
      </div>
    </div>
  );
}
