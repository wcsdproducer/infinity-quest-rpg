'use client';

import { Button } from '@/components/ui/button';
import { LogOut, Maximize, Minimize, LoaderCircle } from 'lucide-react';
import React, { useState, useEffect } from 'react';

type GameControlsProps = {
  rootRef?: React.RefObject<HTMLDivElement>;
  onQuit?: () => Promise<void>;
};

export function GameControls({ rootRef, onQuit }: GameControlsProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Track fullscreen changes (e.g. user presses Escape)
  useEffect(() => {
    const onFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  const handleQuit = async () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    if (onQuit) {
      setIsSaving(true);
      await onQuit();
    }
    window.location.href = '/'; // Go back to the start screen
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      // Prefer the whole document for maximum compatibility
      const target = rootRef?.current || document.documentElement;
      target.requestFullscreen().catch(err => {
        console.warn(`Fullscreen request failed: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="flex items-center justify-between gap-2">
      <Button variant="outline" onClick={handleFullscreen}>
        {isFullscreen ? (
          <>
            <Minimize className="mr-2 h-4 w-4" />
            Exit Fullscreen
          </>
        ) : (
          <>
            <Maximize className="mr-2 h-4 w-4" />
            Fullscreen
          </>
        )}
      </Button>
      <Button variant="outline" onClick={handleQuit} disabled={isSaving}>
        {isSaving ? (
          <>
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <LogOut className="mr-2 h-4 w-4" />
            Save & Quit
          </>
        )}
      </Button>
    </div>
  );
}
