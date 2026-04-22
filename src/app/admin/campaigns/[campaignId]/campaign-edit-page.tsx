
'use client';

import { FirebaseClientProvider } from "@/firebase";
import { Header } from "@/components/layout/header";
import { CampaignForm } from "./campaign-form";

// This is the Client Component that now receives the campaignId as a simple string.
export default function CampaignEditPageContent({ campaignId }: { campaignId: string }) {
    const isNew = campaignId === 'new';
    const finalCampaignId = isNew ? null : campaignId;

    return (
        <FirebaseClientProvider>
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
                    <div className="w-full max-w-6xl">
                        <CampaignForm campaignId={finalCampaignId} />
                    </div>
                </main>
            </div>
        </FirebaseClientProvider>
    );
}
