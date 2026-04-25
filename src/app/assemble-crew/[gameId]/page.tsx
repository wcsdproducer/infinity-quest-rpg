'use client';

import { FirebaseClientProvider } from '@/firebase';
import { CrewAssembly } from '@/components/crew/crew-assembly';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { use } from 'react';

function AssembleCrewPage({ params }: { params: Promise<{ gameId: string }> }) {
    const { gameId } = use(params);
    const backgroundImage = PlaceHolderImages.find(
        (img) => img.id === 'title-screen-background'
    );

    return (
        <FirebaseClientProvider>
            <div className="relative h-screen w-full overflow-hidden bg-black">
                {backgroundImage && (
                    <Image
                        src={backgroundImage.imageUrl}
                        alt="Background"
                        fill
                        sizes="100vw"
                        className="object-cover opacity-30"
                    />
                )}
                <div className="absolute inset-0 bg-black/60" />
                {/* Content layer — absolutely fills the full viewport */}
                <div className="absolute inset-0 z-10 flex flex-col px-4 py-3">
                    <CrewAssembly gameId={gameId} />
                </div>
            </div>
        </FirebaseClientProvider>
    );
}

export default AssembleCrewPage;
