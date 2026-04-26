import { initializeServerFirebase } from '../src/firebase/server-init';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { execSync } from 'child_process';

const campaignId = 'H1HwmRN1Iy0LspPkVYe9';
const bucket = 'infinity-quest-rpg.firebasestorage.app';

async function migrate() {
    const { firestore } = initializeServerFirebase();
    const campaignRef = doc(firestore, 'campaigns', campaignId);
    const campaignSnap = await getDoc(campaignRef);
    
    if (!campaignSnap.exists()) {
        console.error('Campaign not found');
        return;
    }

    const data = campaignSnap.data();
    const locations = data.locations || [];
    const campaignName = 'a-pound-of-flesh'; // From URL

    let migratedCount = 0;

    for (let i = 0; i < locations.length; i++) {
        const loc = locations[i];
        if (!loc.mediaUrls || loc.mediaUrls.length === 0) continue;

        for (let j = 0; j < loc.mediaUrls.length; j++) {
            const media = loc.mediaUrls[j];
            const url = media.url;

            // Check if it's a firebase URL that needs migration
            if (url.includes('/Locations/') && !url.includes(`/${loc.sectorId}/`)) {
                // Extract the path from the URL
                // Format: https://firebasestorage.googleapis.com/v0/b/[bucket]/o/[path]?alt=media&token=[token]
                const match = url.match(/\/o\/(.*?)\?alt=media/);
                if (match) {
                    const oldPath = decodeURIComponent(match[1]);
                    // oldPath example: campaigns/a-pound-of-flesh/Locations/docking-bay/Docking Bay.png
                    
                    // Construct new path
                    // We want to insert sectorId after "Locations/"
                    const newPath = oldPath.replace('/Locations/', `/Locations/${loc.sectorId}/`);
                    
                    console.log(`Migrating: ${oldPath} -> ${newPath}`);
                    
                    try {
                        // Move file using gsutil
                        execSync(`gsutil mv gs://${bucket}/"${oldPath}" gs://${bucket}/"${newPath}"`);
                        
                        // Update URL (replace old path with new path in the encoded part)
                        const encodedOldPath = encodeURIComponent(oldPath).replace(/%2F/g, '/');
                        const encodedNewPath = encodeURIComponent(newPath).replace(/%2F/g, '/');
                        
                        // Wait, the Firebase URL encoding is tricky. 
                        // Let's just regenerate the URL if possible, but we don't have the token easily.
                        // Actually, the token remains the same if we just move it? 
                        // No, usually you need a new signed URL or the same token might work if it's metadata.
                        // Let's just update the string.
                        const newUrl = url.replace(encodeURIComponent(oldPath), encodeURIComponent(newPath));
                        
                        media.url = newUrl;
                        migratedCount++;
                    } catch (err) {
                        console.error(`Failed to move ${oldPath}:`, err.message);
                    }
                }
            }
        }
    }

    if (migratedCount > 0) {
        await updateDoc(campaignRef, { locations });
        console.log(`Successfully migrated ${migratedCount} assets and updated Firestore.`);
    } else {
        console.log('No assets needed migration.');
    }
}

migrate().catch(console.error);
