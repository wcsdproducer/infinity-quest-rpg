
'use client';

import { FirebaseClientProvider } from '@/firebase';
import { Header } from '@/components/layout/header';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { CampaignList } from './campaign-list';


function CampaignsAdminPageContent() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
                <div className="max-w-7xl mx-auto w-full">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-2xl font-bold">Campaigns</h1>
                        <Button asChild>
                            <Link href="/admin/campaigns/new">
                                <Plus className="mr-2 h-4 w-4" />
                                New Campaign
                            </Link>
                        </Button>
                    </div>

                    <CampaignList />
                </div>
            </main>
        </div>
    );
}

export default function CampaignsAdminPage() {
    return (
        <FirebaseClientProvider>
            <CampaignsAdminPageContent />
        </FirebaseClientProvider>
    );
}
