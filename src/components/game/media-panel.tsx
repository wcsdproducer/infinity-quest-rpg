
'use client';

import { ImageIcon, Volume2, VolumeX } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

type MediaPanelProps = {
  imageUrl?: string;
  videoUrl?: string;
};

export function MediaPanel({ imageUrl, videoUrl }: MediaPanelProps) {
    const [isMuted, setIsMuted] = useState(true);

    if (videoUrl) {
        return (
            <div className="absolute inset-0 rounded-lg bg-black overflow-hidden group">
                <video
                    key={videoUrl}
                    src={videoUrl}
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                    className="h-full w-full object-cover"
                />
                <Button
                    variant="secondary"
                    size="icon"
                    className="absolute bottom-4 right-4 h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsMuted(!isMuted);
                    }}
                >
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
            </div>
        );
    }
    
  return (
    <div className="absolute inset-0 rounded-lg bg-black overflow-hidden">
      {imageUrl && (
        <Image
          key={imageUrl}
          src={imageUrl}
          alt="Location"
          fill
          priority
          className="object-cover"
          unoptimized
        />
      )}
      {!imageUrl && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-center text-muted-foreground z-10">
            <div>
                <ImageIcon className="mx-auto h-12 w-12" />
                <p className="mt-2 text-sm">Media will be displayed here</p>
            </div>
        </div>
      )}
    </div>
  );
}

    