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
    const onFsChange = () => {
      const doc = document as any;
      setIsFullscreen(!!(doc.fullscreenElement || doc.webkitFullscreenElement || doc.mozFullScreenElement || doc.msFullscreenElement));
    };
    
    document.addEventListener('fullscreenchange', onFsChange);
    document.addEventListener('webkitfullscreenchange', onFsChange);
    document.addEventListener('mozfullscreenchange', onFsChange);
    document.addEventListener('MSFullscreenChange', onFsChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', onFsChange);
      document.removeEventListener('webkitfullscreenchange', onFsChange);
      document.removeEventListener('mozfullscreenchange', onFsChange);
      document.removeEventListener('MSFullscreenChange', onFsChange);
    };
  }, []);

  const handleQuit = async () => {
    const doc = document as any;
    if (doc.fullscreenElement || doc.webkitFullscreenElement || doc.mozFullScreenElement || doc.msFullscreenElement) {
      if (doc.exitFullscreen) {
        doc.exitFullscreen().catch(() => {});
      } else if (doc.webkitExitFullscreen) {
        doc.webkitExitFullscreen();
      } else if (doc.mozCancelFullScreen) {
        doc.mozCancelFullScreen();
      } else if (doc.msExitFullscreen) {
        doc.msExitFullscreen();
      }
    }
    if (onQuit) {
      setIsSaving(true);
      await onQuit();
    }
    window.location.href = '/'; // Go back to the start screen
  };

  const handleFullscreen = () => {
    if (!rootRef?.current) return;

    if (!document.fullscreenElement) {
      // Prefer the whole document for maximum compatibility to hide URL bars
      const target = document.documentElement;
      target.requestFullscreen().catch(err => {
        console.warn(`Fullscreen request failed: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
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
