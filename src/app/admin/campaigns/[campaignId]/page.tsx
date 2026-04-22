
import CampaignEditPageContent from './campaign-edit-page';

// This is a Server Component. Its only job is to extract the `campaignId`
// from the URL `params` and pass it as a simple string prop to the
// client component. This avoids the `params` promise warning.
export default function CampaignEditPage({ params }: { params: { campaignId: string } }) {
    return <CampaignEditPageContent campaignId={params.campaignId} />;
}
