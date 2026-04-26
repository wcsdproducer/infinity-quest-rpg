const admin = require('firebase-admin');

// No service account needed if we are logged in via gcloud/cli in some environments,
// but here we might need to specify the project ID.
admin.initializeApp({
  projectId: 'infinity-quest-rpg'
});

const db = admin.firestore();

async function updateCampaignUrls() {
  const campaignId = 'H1HwmRN1Iy0LspPkVYe9';
  const campaignRef = db.collection('campaigns').doc(campaignId);
  const campaignSnap = await campaignRef.get();

  if (!campaignSnap.exists) {
    console.error('Campaign not found');
    return;
  }

  const data = campaignSnap.data();
  const locations = data.locations || [];

  const dockingBayUrl = 'https://firebasestorage.googleapis.com/v0/b/infinity-quest-rpg.firebasestorage.app/o/campaigns%2Fa-pound-of-flesh%2FLocations%2FDry%20Dock%2Fdocking-bay%2FDocking%20Bay.png?alt=media&token=5cbc116e-10ae-4709-bf60-696474049888';
  const arrivalUrl = 'https://firebasestorage.googleapis.com/v0/b/infinity-quest-rpg.firebasestorage.app/o/campaigns%2Fa-pound-of-flesh%2FLocations%2FDry%20Dock%2Farrival%2FArrival%201.mp4?alt=media&token=9c851639-7e63-4d98-bec7-c22a7a64b7fd';

  let updated = false;
  const updatedLocations = locations.map((loc) => {
    if (loc.uuid === 'loc-docking-bay-001' || loc.uuid === 'loc-hangar-bay') {
      if (loc.mediaUrls && loc.mediaUrls.length > 0) {
        loc.mediaUrls[0].url = dockingBayUrl;
        updated = true;
      }
    } else if (loc.uuid === 'loc-arrival') {
      if (loc.mediaUrls && loc.mediaUrls.length > 0) {
        loc.mediaUrls[0].url = arrivalUrl;
        updated = true;
      }
    }
    return loc;
  });

  if (updated) {
    await campaignRef.update({ locations: updatedLocations });
    console.log('Successfully updated campaign media URLs');
  } else {
    console.log('No locations found to update');
  }
}

updateCampaignUrls().catch(console.error);
