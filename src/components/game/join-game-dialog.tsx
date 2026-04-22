
'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogOverlay,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoaderCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';


type JoinGameDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function JoinGameDialog({ open, onOpenChange }: JoinGameDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [gameCode, setGameCode] = useState('');
  const { toast } = useToast();
  const router = useRouter();

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gameCode.trim() || gameCode.trim().length !== 14) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please enter a valid game code.',
      });
      return;
    }
    setIsLoading(true);
    // This is a placeholder for actual game joining logic.
    // In a real app, you would validate the code and then navigate.
    console.log('Attempting to join game with code:', gameCode);
    setTimeout(() => {
        // For demonstration, we'll just navigate to the lobby.
        // In a real app, you'd verify the code first.
        router.push(`/lobby/${gameCode}`);
        setIsLoading(false);
        onOpenChange(false);
    }, 1500)
  };

  const handleOpenChange = (isOpen: boolean) => {
      onOpenChange(isOpen);
      if (!isOpen) {
          setTimeout(() => {
            setGameCode('');
          }, 300);
      }
  }

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    let formattedCode = '';
    if (rawValue.length > 0) {
      formattedCode = rawValue.match(/.{1,4}/g)?.join('-') || '';
    }
    setGameCode(formattedCode);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
       <DialogOverlay className="bg-black/30 backdrop-blur-sm" />
      <DialogContent className="sm:max-w-md text-white bg-[#111827]/80 border-white/10 !rounded-lg overflow-hidden p-0">
            <div className="p-6">
                 <DialogHeader className="text-center items-center p-6 pt-0">
                    <DialogTitle className="text-4xl font-bold font-headline">Join Game</DialogTitle>
                    <DialogDescription className="text-lg text-white/80 max-w-xl">
                       Enter the code provided by your host to join their game.
                    </DialogDescription>
                </DialogHeader>
                <Card className="bg-[#2c1e4a]/50 border-purple-500/50 text-left max-w-sm mx-auto">
                     <CardHeader className="text-center">
                        <CardTitle className="text-xl font-bold">Enter Code</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 pt-0">
                        <form onSubmit={handleJoinSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="game-code" className="sr-only">Game Code</Label>
                                <Input 
                                    id="game-code" 
                                    name="game-code" 
                                    placeholder="AAAA-BBBB-CCCC" 
                                    value={gameCode}
                                    onChange={handleCodeChange}
                                    className="h-14 text-center text-2xl font-mono tracking-widest bg-white/5 border-white/20 focus:border-purple-500 focus:ring-purple-500"
                                    maxLength={14}
                                />
                            </div>
                            <Button type="submit" className="w-full h-11 bg-purple-600 hover:bg-purple-700 text-white font-semibold" disabled={isLoading}>
                                {isLoading ? <LoaderCircle className="animate-spin" /> : 'Join Now'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
      </DialogContent>
    </Dialog>
  );
}

    