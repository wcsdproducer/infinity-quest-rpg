
'use client';

import { FirebaseClientProvider } from '@/firebase';
import { TitleScreen } from '@/app/title-screen';

export default function Home() {
  return (
    <FirebaseClientProvider>
      <TitleScreen />
    </FirebaseClientProvider>
  );
}
