'use client';

import { FirebaseClientProvider } from '@/firebase';
import { CrewAssembly } from '@/components/crew/crew-assembly';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

function AssembleCrewPage({ params: { gameId } }: { params: { gameId: string } }) {
    const backgroundImage = PlaceHolderImages.find(
        (img) => img.id === 'title-screen-background'
    );

    return (
        <FirebaseClientProvider>
            <div className="relative min-h-screen w-full bg-black">
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
                <div className="relative z-10 p-4">
                    <CrewAssembly gameId={gameId} />
                </div>
            </div>
        </FirebaseClientProvider>
    );
}

export default AssembleCrewPage;
