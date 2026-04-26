
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// NOTE: This script assumes you have a service account key or are authenticated.
// For the agent, we will just generate the logic to update Firestore.

const CAMPAIGN_ID = 'H1HwmRN1Iy0LspPkVYe9';
const PROJECT_ID = 'infinity-quest-rpg';

async function migrate() {
    const db = getFirestore();
    const campaignRef = db.collection('campaigns').doc(CAMPAIGN_ID);
    const campaignSnap = await campaignRef.get();

    if (!campaignSnap.exists) {
        console.error('Campaign not found');
        return;
    }

    const data = campaignSnap.data();
    const locations = data?.locations || [];

    const updatedLocations = locations.map((loc: any) => {
        const sectorId = loc.sectorId || 'unknown-sector';
        const locationSlug = loc.name?.toLowerCase().replace(/[^a-z0-9]/g, '-') || loc.uuid;

        if (loc.mediaUrls && loc.mediaUrls.length > 0) {
            loc.mediaUrls = loc.mediaUrls.map((m: any) => {
                if (m.url && m.url.includes('firebasestorage.googleapis.com')) {
                    // Extract the filename
                    const urlParts = m.url.split('?')[0].split('%2F');
                    const filename = decodeURIComponent(urlParts[urlParts.length - 1]);
                    
                    // Construct the new path
                    // Old: campaigns/a-pound-of-flesh/Locations/docking-bay/Docking Bay.png
                    // New: Locations/[SectorId]/[LocationSlug]/[Filename]
                    const newPath = `Locations/${sectorId}/${locationSlug}/${filename}`;
                    
                    // We can't easily rebuild the full Signed URL/Token-based URL here 
                    // without the Storage SDK, but we can update the 'path' if we used a path-based system.
                    // However, Infinity Quest seems to use public URLs with tokens.
                    
                    console.log(`[MOVE] ${m.url} -> ${newPath}`);
                }
                return m;
            });
        }
        return loc;
    });

    // await campaignRef.update({ locations: updatedLocations });
    console.log('Firestore paths updated (dry run).');
}

// migrate();
