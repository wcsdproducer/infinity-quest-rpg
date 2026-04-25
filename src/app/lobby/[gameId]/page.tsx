
import LobbyClientPage from './lobby-client-page';

export default async function LobbyPage({ params }: { params: Promise<{ gameId: string }> }) {
  const { gameId } = await params;
  return <LobbyClientPage gameId={gameId} />;
}
