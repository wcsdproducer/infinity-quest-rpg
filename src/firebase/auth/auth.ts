
'use client';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  GoogleAuthProvider,
  UserCredential,
} from 'firebase/auth';
import { initializeFirebase } from '@/firebase';
import { initializeServerFirebase } from '@/firebase/server-init';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

// This function can be called from server actions or client components.
// It ensures Firebase is initialized before getting the auth instance.
function getClientAuth() {
  const { auth } = initializeFirebase();
  return auth;
}

export async function handleEmailSignUp(email: string, password: string): Promise<{ success: boolean; error?: string; userCredential?: UserCredential }> {
  const auth = getClientAuth();
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return { success: true, userCredential };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function handleEmailSignIn(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  const auth = getClientAuth();
  try {
    await signInWithEmailAndPassword(auth, email, password);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function handleGoogleSignIn(): Promise<{ success: boolean; error?: string }> {
    const auth = getClientAuth();
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // After sign-in, check if user profile exists in Firestore.
        // If not, create it.
        const { firestore } = initializeFirebase();
        const userRef = doc(firestore, 'users', user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          // This is a new user, create their profile.
          await setDoc(userRef, {
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
            createdAt: serverTimestamp(),
            isAdmin: false, // Default new users to not be admins
          });
        }
        
        return { success: true };
    } catch (error: any) {
        // Handle specific errors like 'auth/popup-closed-by-user'
        if (error.code === 'auth/popup-closed-by-user') {
            return { success: false, error: 'Sign-in process was cancelled.' };
        }
        return { success: false, error: error.message };
    }
}

export async function handleSignOut(): Promise<void> {
    const auth = getClientAuth();
    await signOut(auth);
}
