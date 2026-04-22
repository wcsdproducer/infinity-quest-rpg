
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useUser } from '@/firebase';
import { UserAvatar } from '@/components/auth/user-avatar';
import { handleSignOut } from '@/firebase/auth/auth';
import { useToast } from '@/hooks/use-toast';

type HeaderProps = {
    onAuthClick?: (tab: 'sign-in' | 'sign-up') => void;
};

export function Header({ onAuthClick }: HeaderProps) {
  const { user, isAdmin, isUserLoading } = useUser();
  const { toast } = useToast();

  const onSignOut = async () => {
    try {
        await handleSignOut();
        toast({
            title: 'Signed Out',
            description: 'You have been successfully signed out.',
        });
    } catch (error) {
        console.error('Sign out error:', error);
        toast({
            variant: 'destructive',
            title: 'Sign Out Failed',
            description: 'There was a problem signing you out.',
        });
    }
  }

  return (
    <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-5 py-4 bg-black/30 backdrop-blur-sm text-white">
      <Link href="/" className="flex items-center gap-2">
        <span className="font-headline text-xl font-bold">INFINITY QUEST RPG</span>
      </Link>
      <nav className="flex items-center gap-2">
        {isUserLoading ? (
            <div className="h-8 w-20 animate-pulse rounded-md bg-white/20" />
        ) : user ? (
          <>
            <Button variant="ghost" asChild>
                <Link href="/my-games">My Games</Link>
            </Button>
            {isAdmin && (
                <Button variant="ghost" asChild>
                    <Link href="/admin">Admin</Link>
                </Button>
            )}
            <UserAvatar user={user} onSignOut={onSignOut} />
          </>
        ) : (
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => onAuthClick?.('sign-in')}>
              Log In
            </Button>
            <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-black" onClick={() => onAuthClick?.('sign-up')}>
              Register
            </Button>
          </div>
        )}
      </nav>
    </header>
  );
}
