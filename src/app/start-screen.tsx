
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCollection, useFirestore, useMemoFirebase, useAuth, useUser } from '@/firebase';
import type { Campaign } from '@/lib/types';
import { collection, query, where } from 'firebase/firestore';
import Image from 'next/image';
import { Skeleton } from '@/components/ui/skeleton';
import { initiateAnonymousSignIn } from '@/firebase/non-blocking-login';
import { LoaderCircle } from 'lucide-react';

type StartScreenProps = {
  onCampaignSelect: (campaign: Campaign) => void;
  hosting?: boolean;
};

function CampaignCard({ campaign, onCampaignSelect, hosting, disabled }: { campaign: Campaign, onCampaignSelect: (campaign: Campaign) => void, hosting?: boolean, disabled?: boolean }) {
  return (
    <Card className="overflow-hidden bg-background/50">
      <div className="relative h-48 w-full">
        <Image
          src={campaign.imageUrl || 'https://picsum.photos/seed/1/400/225'}
          alt={campaign.name}
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>
      <CardHeader>
        <CardTitle className="font-headline text-2xl">{campaign.name}</CardTitle>
        <CardDescription>{campaign.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={() => onCampaignSelect(campaign)} className="w-full" disabled={disabled}>
          {hosting ? 'Select Campaign to Host' : 'Begin Campaign'}
        </Button>
      </CardContent>
    </Card>
  )
}

function CampaignCardSkeleton() {
    return (
      <Card className="overflow-hidden">
        <Skeleton className="h-48 w-full" />
        <CardHeader>
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-full mt-2" />
          <Skeleton className="h-4 w-1/2 mt-1" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

export function StartScreen({ onCampaignSelect, hosting = false }: StartScreenProps) {
  const firestore = useFirestore();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    // When auth is ready and there's no user, sign in anonymously.
    if (auth && !user && !isUserLoading && !hosting) {
      initiateAnonymousSignIn(auth);
    }
  }, [auth, user, isUserLoading, hosting]);

  const campaignsQuery = useMemoFirebase(() => {
    if (!firestore || (!user && !hosting)) return null;
    return query(collection(firestore, 'campaigns'), where('status', '==', 'published'));
  }, [firestore, user, hosting]);

  const { data: campaigns, isLoading } = useCollection<Campaign>(campaignsQuery);

  const showLoadingState = (isUserLoading && !hosting) || isLoading;

  return (
    <div>
        {showLoadingState && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <CampaignCardSkeleton />
                <CampaignCardSkeleton />
                <CampaignCardSkeleton />
            </div>
        )}

        {!showLoadingState && campaigns && campaigns.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {campaigns.map((campaign) => (
                    <CampaignCard key={campaign.id} campaign={campaign} onCampaignSelect={onCampaignSelect} hosting={hosting} />
                ))}
            </div>
        )}
        
        {!showLoadingState && (!campaigns || campaigns.length === 0) && (
          <div className="text-center text-muted-foreground py-10 border-2 border-dashed rounded-lg">
            <p className="mb-4">No published campaigns found in the database.</p>
            <p className="text-sm">You can create a new campaign in the Admin dashboard.</p>
          </div>
        )}
    </div>
  );
}
