import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const app = initializeApp();
const db = getFirestore();

async function main() {
  const snapshot = await db.collection('campaigns').where('name', '==', 'A Pound of Flesh').get();
  if (snapshot.empty) {
    console.log('No campaign found.');
    return;
  }
  snapshot.forEach(doc => {
    const data = doc.data();
    console.log('Campaign ID:', doc.id);
    console.log('Starting Location ID:', data.startingLocationId);
    console.log('Locations:');
    (data.locations || []).forEach((loc: any) => {
        console.log(`  - ${loc.name} (uuid: ${loc.uuid})`);
    });
  });
}
main().catch(console.error);
