
import CampaignEditPageContent from './campaign-edit-page';

// Server Component: extracts campaignId from the async params Promise (Next.js 15)
export default async function CampaignEditPage({ params }: { params: Promise<{ campaignId: string }> }) {
    const { campaignId } = await params;
    return <CampaignEditPageContent campaignId={campaignId} />;
}
