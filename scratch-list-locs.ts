import { initializeServerFirebase } from './src/firebase/server-init';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

async function run() {
  const { firestore } = initializeServerFirebase();
  const campaignRef = doc(firestore, 'campaigns', 'a-pound-of-flesh');
  const docSnap = await getDoc(campaignRef);
  
  if (!docSnap.exists()) {
    console.log("Campaign not found");
    return;
  }
  
  const data = docSnap.data();
  console.log("Starting Location ID:", data?.startingLocationId);
  console.log(`Found ${data?.locations?.length || 0} locations in array:`);
  
  if (data?.locations) {
    data.locations.forEach((loc: any) => {
      console.log(`- Name: ${loc.name}, UUID: ${loc.uuid}`);
    });
  }
}

run().catch(console.error);
