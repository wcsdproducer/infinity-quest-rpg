
'use client';

import { Button } from '@/components/ui/button';
import { LogOut, Maximize } from 'lucide-react';
import React from 'react';

type GameControlsProps = {
  rootRef?: React.RefObject<HTMLDivElement>;
};

export function GameControls({ rootRef }: GameControlsProps) {

  const handleQuit = () => {
    // In a real app, you'd save progress here before quitting.
    if (document.fullscreenElement) {
        document.exitFullscreen();
    }
    console.log('Save and quit (placeholder)');
    window.location.href = '/'; // Go back to the start screen
  };

  const handleFullscreen = () => {
    if (!rootRef?.current) return;

    if (!document.fullscreenElement) {
      rootRef.current.requestFullscreen().catch(err => {
        alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="flex items-center justify-between gap-2">
      <Button variant="outline" onClick={handleFullscreen}>
        <Maximize className="mr-2 h-4 w-4" />
        Fullscreen
      </Button>
      <Button variant="outline" onClick={handleQuit}>
        <LogOut className="mr-2 h-4 w-4" />
        Save & Quit
      </Button>
    </div>
  );
}
