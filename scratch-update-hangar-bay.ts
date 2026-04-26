import * as admin from 'firebase-admin';
import { getStationGraph } from './src/lib/extracted-graph';

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: 'infinity-quest-rpg',
  });
}

const db = admin.firestore();
db.settings({ ignoreUndefinedProperties: true });

async function run() {
  const campaignRef = db.collection('campaigns').doc('H1HwmRN1Iy0LspPkVYe9');
  const docSnap = await campaignRef.get();
  
  if (!docSnap.exists) {
    console.log("Campaign H1HwmRN1Iy0LspPkVYe9 not found");
    return;
  }
  
  const data = docSnap.data();
  const locations = data?.locations || [];
  
  const existingDockingBay = locations.find((l: any) => l.uuid === 'loc-docking-bay-001');
  if (existingDockingBay) {
    console.log("Updating Docking Bay location with new mediaUrls...");
    existingDockingBay.mediaUrls = [
      {
        url: "https://firebasestorage.googleapis.com/v0/b/infinity-quest-rpg.firebasestorage.app/o/campaigns%2Fa-pound-of-flesh%2FLocations%2Fdocking-bay%2FDocking%20Bay.png?alt=media&token=5cbc116e-10ae-4709-bf60-696474049888"
      }
    ];
  } else {
    console.log("Docking Bay not found in campaign!");
  }
  
  // Update the campaign document
  await campaignRef.update({
    locations: locations
  });
  
  console.log("Successfully updated loc-docking-bay-001.");
}

run().catch(console.error);
