
'use client';

import { ImageIcon } from 'lucide-react';
import Image from 'next/image';

type MediaPanelProps = {
  imageUrl?: string;
  videoUrl?: string;
};

export function MediaPanel({ imageUrl, videoUrl }: MediaPanelProps) {
    if (videoUrl) {
        return (
            <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black">
                <video
                    key={videoUrl} // Add key to force re-render on URL change
                    src={videoUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="h-full w-full object-cover"
                />
            </div>
        );
    }
    
  return (
    <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black">
      {imageUrl && <Image
        key={imageUrl}
        src={imageUrl}
        alt="Campaign Image"
        fill
        priority
        className="object-cover"
      />}
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

    