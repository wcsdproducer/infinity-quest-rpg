
'use server';

import { z } from 'zod';
import { handleEmailSignUp, handleEmailSignIn } from '@/firebase/auth/auth';
import { updateProfile } from 'firebase/auth';
import { initializeServerFirebase } from '@/firebase/server-init';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

const SignUpSchema = z.object({
  displayName: z.string().min(1, 'Display Name is required'),
  email: z.string().email(),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

const SignInSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1, 'Password is required'),
});

type AuthResponse = {
    success: boolean;
    error?: string;
};

export async function signUpWithEmail(formData: FormData): Promise<AuthResponse> {
    const result = SignUpSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!result.success) {
        return { success: false, error: result.error.errors.map(e => e.message).join(', ') };
    }

    const { email, password, displayName } = result.data;
    const { success, error, userCredential } = await handleEmailSignUp(email, password);
    
    if (success && userCredential?.user) {
        try {
            await updateProfile(userCredential.user, { displayName });

            const { firestore } = initializeServerFirebase();
            const userRef = doc(firestore, 'users', userCredential.user.uid);
            await setDoc(userRef, {
                uid: userCredential.user.uid,
                displayName: displayName,
                email: email,
                createdAt: serverTimestamp(),
                isAdmin: false, // Default to false for new sign-ups
            });

            return { success: true };
        } catch (updateError: any) {
             return { success: false, error: updateError.message };
        }
    }
    
    return { success, error };
}

export async function signInWithEmail(formData: FormData): Promise<AuthResponse> {
    const result = SignInSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!result.success) {
        return { success: false, error: 'Invalid email or password format.' };
    }
    
    const { email, password } = result.data;
    const { success, error } = await handleEmailSignIn(email, password);

    return { success, error };
}
