
import LobbyClientPage from './lobby-client-page';

export default function LobbyPage({ params }: { params: { gameId: string } }) {
  return <LobbyClientPage params={params} />;
}
