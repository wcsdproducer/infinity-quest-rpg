
'use client';

import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import type { Campaign } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BookOpen, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function CampaignList() {
    const firestore = useFirestore();

    const campaignsQuery = useMemoFirebase(() => {
        if (!firestore) return null;
        return collection(firestore, 'campaigns');
    }, [firestore]);

    const { data: campaigns, isLoading, error } = useCollection<Campaign>(campaignsQuery);

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader>
                            <Skeleton className="h-6 w-3/4 mb-2" />
                            <Skeleton className="h-4 w-full" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-32 w-full" />
                        </CardContent>
                        <CardFooter>
                            <Skeleton className="h-10 w-24" />
                        </CardFooter>
                    </Card>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                    Failed to load campaigns. You may not have the required permissions.
                </AlertDescription>
            </Alert>
        )
    }

    if (!campaigns || campaigns.length === 0) {
        return (
            <Alert>
                <BookOpen className="h-4 w-4" />
                <AlertTitle>No Campaigns Found</AlertTitle>
                <AlertDescription>
                    Get started by creating your first campaign using the "New Campaign" button.
                </AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map(campaign => (
                <Card key={campaign.id} className="flex flex-col">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>{campaign.name}</CardTitle>
                            <Badge variant={campaign.status === 'published' ? 'default' : 'secondary'} className={cn(campaign.status === 'published' ? 'bg-green-600' : '')}>
                                {campaign.status}
                            </Badge>
                        </div>
                        <CardDescription className="line-clamp-2 h-10">{campaign.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                         <div className="relative aspect-video w-full">
                            <Image
                                src={campaign.imageUrl || 'https://picsum.photos/seed/1/400/225'}
                                alt={campaign.name}
                                fill
                                className="object-cover rounded-md"
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button asChild variant="secondary">
                            <Link href={`/admin/campaigns/${campaign.id}`}>Edit</Link>
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}
