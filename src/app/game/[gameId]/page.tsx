
import { FirebaseClientProvider } from '@/firebase';
import { GamePageContent } from './game-page-content';

export default async function GamePage({ params }: { params: Promise<{ gameId: string }> }) {
    const { gameId } = await params;
    return (
        <FirebaseClientProvider>
            <GamePageContent gameId={gameId} />
        </FirebaseClientProvider>
    );
}
