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
  
  const doc = snapshot.docs[0];
  const data = doc.data();
  
  const updatedLocations = (data.locations || []).map((loc: any) => {
    if (loc.uuid === 'loc-docking-bay-001') {
      return {
        ...loc,
        name: 'Arrival',
        uuid: 'loc-arrival'
      };
    }
    return loc;
  });

  await db.collection('campaigns').doc(doc.id).update({
    locations: updatedLocations,
    startingLocationId: 'loc-arrival'
  });
  
  console.log(`Updated campaign ${doc.id} starting location to Arrival (loc-arrival)`);
}

main().catch(console.error);
