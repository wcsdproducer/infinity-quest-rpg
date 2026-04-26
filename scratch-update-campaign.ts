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
  
  // Find the Arrival location from extracted graph
  const graph = getStationGraph();
  const arrivalLoc = graph.locations.find(l => l.uuid === 'loc-arrival');
  
  if (!arrivalLoc) {
    console.error("Arrival location not found in extracted graph!");
    return;
  }

  const arrivalMedia = [{
    url: "https://firebasestorage.googleapis.com/v0/b/infinity-quest-rpg.firebasestorage.app/o/campaigns%2Fa-pound-of-flesh%2FLocations%2Farrival%2FArrival%201.mp4?alt=media&token=9c851639-7e63-4d98-bec7-c22a7a64b7fd",
    loop: true
  }];

  // Check if Arrival is already in the campaign's locations array
  const existingArrival = locations.find((l: any) => l.uuid === 'loc-arrival');
  if (!existingArrival) {
    console.log("Adding Arrival location to campaign...");
    arrivalLoc.mediaUrls = arrivalMedia;
    locations.push(arrivalLoc);
  } else {
    console.log("Arrival location already exists in campaign, updating mediaUrls...");
    existingArrival.mediaUrls = arrivalMedia;
  }
  
  // Update the campaign document
  await campaignRef.update({
    locations: locations,
    startingLocationId: 'loc-arrival'
  });
  
  console.log("Successfully updated startingLocationId to loc-arrival and ensured Arrival is in the locations array.");
}

run().catch(console.error);
