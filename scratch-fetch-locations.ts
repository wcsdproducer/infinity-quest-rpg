import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    projectId: 'infinity-quest-rpg',
  });
}

const db = admin.firestore();

async function run() {
  const campaignRef = db.collection('campaigns').doc('H1HwmRN1Iy0LspPkVYe9');
  const docSnap = await campaignRef.get();
  
  if (!docSnap.exists) {
    console.log("Campaign not found");
    return;
  }
  
  const data = docSnap.data();
  const locations = data?.locations || [];
  
  console.log("Locations in campaign:");
  locations.forEach((loc: any) => {
    console.log(`- ${loc.name} (UUID: ${loc.uuid})`);
  });
}

run().catch(console.error);
