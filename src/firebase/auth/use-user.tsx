
'use client';

import { useState, useEffect } from 'react';
import { useAuth, useFirestore, useMemoFirebase } from '@/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc } from 'firebase/firestore';
import { useDoc } from '../firestore/use-doc';

// Define a type for the user profile as it is stored in Firestore
type UserProfile = {
  isAdmin?: boolean;
  // other profile fields can be added here
};

export interface UserAuthHookResult {
  user: User | null;
  isAdmin: boolean;
  isUserLoading: boolean;
  userError: Error | null;
}

export const useUser = (): UserAuthHookResult => {
  const auth = useAuth();
  const firestore = useFirestore();

  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [authError, setAuthError] = useState<Error | null>(null);

  useEffect(() => {
    if (!auth) {
      setIsAuthLoading(false);
      return;
    }
    
    setIsAuthLoading(true);
    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser) => {
        setUser(firebaseUser);
        setIsAuthLoading(false);
      },
      (error) => {
        console.error("useUser hook: onAuthStateChanged error:", error);
        setAuthError(error);
        setUser(null);
        setIsAuthLoading(false);
      }
    );

    return () => unsubscribe();
  }, [auth]);

  // Create a memoized reference to the user's profile document
  const userProfileRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  // Use the useDoc hook to fetch the profile data
  const { data: userProfile, isLoading: isProfileLoading, error: profileError } = useDoc<UserProfile>(userProfileRef);

  const isAdmin = userProfile?.isAdmin === true;
  const isUserLoading = isAuthLoading || (!!user && isProfileLoading);
  const userError = authError || profileError;

  return { user, isAdmin, isUserLoading, userError };
};
