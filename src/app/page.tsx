
import { FirebaseClientProvider } from '@/firebase';
import { TitleScreen } from '@/app/title-screen';

export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <FirebaseClientProvider>
      <TitleScreen />
    </FirebaseClientProvider>
  );
}
