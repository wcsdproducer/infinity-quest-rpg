
import { FirebaseClientProvider } from '@/firebase';
import { GamePageContent } from './game-page-content';


export default function GamePage({ params: { gameId } }: { params: { gameId: string } }) {
    return (
        <FirebaseClientProvider>
            <GamePageContent gameId={gameId} />
        </FirebaseClientProvider>
    );
}
