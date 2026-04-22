
'use client';

import React, { useMemo, type ReactNode } from 'react';
import { FirebaseProvider, useUser } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

// This internal component is now responsible for handling user-state-dependent logic.
// It is guaranteed to render within the FirebaseProvider's context.
function FirebaseUserHandler({ children }: { children: ReactNode }) {
  // You can use hooks that depend on Firebase here safely.
  // For example, fetching user-specific data.
  const { user, isUserLoading } = useUser();

  // You could add a global loader here based on isUserLoading if needed.
  // if (isUserLoading) {
  //   return <GlobalLoader />;
  // }

  return <>{children}</>;
}


export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const firebaseServices = useMemo(() => {
    // Initialize Firebase on the client side, once per component mount.
    return initializeFirebase();
  }, []); // Empty dependency array ensures this runs only once on mount

  return (
    <FirebaseProvider
      firebaseApp={firebaseServices.firebaseApp}
      auth={firebaseServices.auth}
      firestore={firebaseServices.firestore}
      storage={firebaseServices.storage}
    >
      <FirebaseErrorListener />
      {/* The handler component ensures useUser is called within the provider's scope */}
      <FirebaseUserHandler>
        {children}
      </FirebaseUserHandler>
    </FirebaseProvider>
  );
}
