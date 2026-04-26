import * as admin from 'firebase-admin';
import { poundOfFleshCampaignData } from './src/lib/campaigns';

if (!admin.apps.length) {
  admin.initializeApp({
    projectId: 'infinity-quest-rpg',
  });
}

const db = admin.firestore();
db.settings({ ignoreUndefinedProperties: true });

async function run() {
  const ref = db.collection('campaigns').doc('H1HwmRN1Iy0LspPkVYe9');
  
  // We want to merge the basic fields back in, keeping the locations array we just updated
  const { locations, ...basicFields } = poundOfFleshCampaignData;
  
  await ref.set(
    {
      ...basicFields,
      status: 'published', // ensure it is published
    },
    { merge: true }
  );

  console.log('Restored A Pound of Flesh basic fields.');
}

run().catch(console.error);
