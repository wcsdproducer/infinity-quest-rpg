
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ContinueAdventureOutputSchema } from '@/ai/schemas';
import { z } from 'zod';

type RollResult = {
  outcome?: z.infer<typeof ContinueAdventureOutputSchema>['rollOutcome'];
  value?: number;
} | null;


type DiceRollerProps = {
  onRoll?: (result: number) => void;
  isAwaitingRoll?: boolean;
  rollResult?: RollResult;
};

export function DiceRoller({
  onRoll,
  isAwaitingRoll,
  rollResult,
}: DiceRollerProps) {
  const [displayValue, setDisplayValue] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const resultTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear any existing timeout when the component unmounts or dependencies change
    return () => {
      if (resultTimeoutRef.current) {
        clearTimeout(resultTimeoutRef.current);
      }
    };
  }, []);
  
  useEffect(() => {
    if (rollResult?.value) {
      setDisplayValue(rollResult.value);
      if (resultTimeoutRef.current) {
          clearTimeout(resultTimeoutRef.current);
      }
      resultTimeoutRef.current = setTimeout(() => {
        setDisplayValue(null);
      }, 10000); // 10 seconds
    }
  }, [rollResult]);


  const rollDice = () => {
    if (isRolling || !isAwaitingRoll) return;
  
    if (resultTimeoutRef.current) {
      clearTimeout(resultTimeoutRef.current);
    }
  
    setIsRolling(true);
    setDisplayValue(null);
  
    let rollCount = 0;
    const interval = setInterval(() => {
        let result = Math.floor(Math.random() * 100) + 1;
        if (result === 0) result = 100;
        setDisplayValue(result);
      rollCount++;
      if (rollCount > 10) {
        clearInterval(interval);
        
        let finalResult = Math.floor(Math.random() * 100) + 1;
        if (finalResult === 0) finalResult = 100; // 00 is 100 in Mothership

        setDisplayValue(finalResult);
        setIsRolling(false);
        if (onRoll) {
          onRoll(finalResult);
        }
      }
    }, 70);
  };
  
  const getResultClasses = () => {
    if (!rollResult || !displayValue) return '';
    const { outcome } = rollResult;
    
    let classes = '';
    if (outcome === 'success' || outcome === 'critical_success') classes += ' text-green-400';
    if (outcome === 'fail' || outcome === 'critical_fail') classes += ' text-red-500';
    if (outcome === 'critical_success' || outcome === 'critical_fail') classes += ' font-bold';

    return classes;
  };

  const isDisabled = isRolling || !isAwaitingRoll;

  return (
    <Card className="bg-transparent border-none shadow-none">
      <CardContent className="p-0">
        <div className="flex items-center justify-center gap-4">
          <div
            className={cn(
              'font-mono text-5xl font-bold transition-colors h-[60px] flex items-center justify-center w-24',
              isRolling && 'animate-pulse text-accent',
              getResultClasses()
            )}
          >
            {displayValue ?? '--'}
          </div>
          <Button
            size="icon"
            onClick={rollDice}
            disabled={isDisabled}
            className={cn(
              'h-20 w-20 text-xl font-bold bg-white text-black hover:bg-neutral-200',
              isAwaitingRoll && 'animate-pulse ring-2 ring-neutral-400/50'
            )}
          >
            d100
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

    