'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { signInWithEmail } from '@/app/auth/actions';
import { signUpWithEmail } from '@/app/auth/actions';
import { handleGoogleSignIn } from '@/firebase/auth/auth';
import { LoaderCircle } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';

type AuthFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAuthSuccess?: () => void;
  defaultTab?: 'sign-in' | 'sign-up';
};

const OrSeparator = () => (
    <div className="flex items-center my-6">
      <div className="flex-grow border-t border-white/10"></div>
      <span className="mx-4 text-xs text-white/60">OR</span>
      <div className="flex-grow border-t border-white/10"></div>
    </div>
);

function VisuallyHidden({ children }: { children: React.ReactNode }) {
    return (
      <div style={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: '0',
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        border: '0',
      }}>
        {children}
      </div>
    );
  }

export function AuthForm({ open, onOpenChange, onAuthSuccess, defaultTab = 'sign-up' }: AuthFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(defaultTab);
  
  const handleAuthAction = async (action: (formData: FormData) => Promise<{success: boolean, error?: string}>, formData: FormData, successMessage: string) => {
    setIsLoading(true);
    const response = await action(formData);
    if (response.success) {
      toast({
        title: 'Success!',
        description: successMessage,
      });
      onAuthSuccess ? onAuthSuccess() : onOpenChange(false);
    } else {
      toast({
        variant: 'destructive',
        title: 'Authentication Failed',
        description: response.error || 'An unknown error occurred.',
      });
    }
    setIsLoading(false);
  };
  
  const handleSignIn = (formData: FormData) => handleAuthAction(signInWithEmail, formData, "You've been successfully signed in.");
  const handleSignUp = (formData: FormData) => handleAuthAction(signUpWithEmail, formData, "Your account has been created.");

  const onGoogleSignIn = async () => {
    setIsLoading(true);
    const { success, error } = await handleGoogleSignIn();
    if (success) {
      toast({
        title: 'Success!',
        description: "You've been successfully signed in with Google.",
      });
      onAuthSuccess ? onAuthSuccess() : onOpenChange(false);
    } else {
      toast({
        variant: 'destructive',
        title: 'Google Sign-In Failed',
        description: error || 'An unknown error occurred.',
      });
    }
    setIsLoading(false);
  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-[#18223e] text-white border-white/10">
         <DialogHeader>
            <VisuallyHidden>
                <DialogTitle>Authentication</DialogTitle>
                <DialogDescription>
                {activeTab === 'sign-up'
                    ? 'Create a new account to join Infinity Quest RPG.'
                    : 'Log in to your existing Infinity Quest RPG account.'}
                </DialogDescription>
            </VisuallyHidden>
        </DialogHeader>
        {activeTab === 'sign-up' && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold">Register</h2>
              <p className="text-white/60 text-sm mt-1">Join Infinity Quest RPG and start your adventure across the stars.</p>
            </div>
            
            <Button variant="outline" className="w-full h-11 bg-white/10 border-white/20 hover:bg-white/20" onClick={onGoogleSignIn} disabled={isLoading}>
                {isLoading ? <LoaderCircle className="animate-spin"/> : <><FcGoogle className="mr-2 h-5 w-5" /> Continue with Google</>}
            </Button>

            <OrSeparator />

            <form action={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input id="displayName" name="displayName" type="text" placeholder="Captain Marvel" required disabled={isLoading} className="bg-white/5 border-white/20 focus:border-blue-500 focus:ring-blue-500" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-signup">Email</Label>
                <Input id="email-signup" name="email" type="email" placeholder="m@example.com" required disabled={isLoading} className="bg-white/5 border-white/20 focus:border-blue-500 focus:ring-blue-500" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-signup">Password</Label>
                <Input id="password-signup" name="password" type="password" required disabled={isLoading} className="bg-white/5 border-white/20 focus:border-blue-500 focus:ring-blue-500" />
              </div>
               <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input id="confirmPassword" name="confirmPassword" type="password" required disabled={isLoading} className="bg-white/5 border-white/20 focus:border-blue-500 focus:ring-blue-500" />
              </div>
              <Button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold" disabled={isLoading}>
                {isLoading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                Create an account
              </Button>
            </form>
             <div className="text-center mt-6">
                <p className="text-sm text-white/60">
                    Already have an account?{' '}
                    <button onClick={() => setActiveTab('sign-in')} className="text-blue-400 hover:underline">
                        Log in
                    </button>
                </p>
            </div>
          </div>
        )}

        {activeTab === 'sign-in' && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold">Log In</h2>
              <p className="text-white/60 text-sm mt-1">Welcome back, adventurer.</p>
            </div>
            
            <Button variant="outline" className="w-full h-11 bg-white/10 border-white/20 hover:bg-white/20" onClick={onGoogleSignIn} disabled={isLoading}>
                {isLoading ? <LoaderCircle className="animate-spin"/> : <><FcGoogle className="mr-2 h-5 w-5" /> Continue with Google</>}
            </Button>

            <OrSeparator />

            <form action={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email-signin">Email</Label>
                <Input id="email-signin" name="email" type="email" placeholder="m@example.com" required disabled={isLoading} className="bg-white/5 border-white/20 focus:border-blue-500 focus:ring-blue-500" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-signin">Password</Label>
                <Input id="password-signin" name="password" type="password" required disabled={isLoading} className="bg-white/5 border-white/20 focus:border-blue-500 focus:ring-blue-500" />
              </div>
              <Button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold" disabled={isLoading}>
                {isLoading && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                Log In
              </Button>
            </form>
            <div className="text-center mt-6">
                <p className="text-sm text-white/60">
                    Don't have an account?{' '}
                    <button onClick={() => setActiveTab('sign-up')} className="text-blue-400 hover:underline">
                        Register
                    </button>
                </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
