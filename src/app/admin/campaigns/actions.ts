
'use server';

import { z } from 'zod';
import { initializeServerFirebase } from '@/firebase/server-init';
import { doc, setDoc, addDoc, collection, serverTimestamp, getDoc } from 'firebase/firestore';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
import { revalidatePath } from 'next/cache';
import { faker } from '@faker-js/faker';

const MediaURLSchema = z.object({
  url: z.string(),
  loop: z.boolean().optional(),
});

const ActItemSchema = z.object({
  uuid: z.string().default(() => faker.string.uuid()),
  name: z.string().optional(),
  context: z.string().optional(),
  actions: z.array(z.string()).optional(),
  narrative: z.string().optional(),
});

const LocationItemSchema = z.object({
  uuid: z.string().default(() => faker.string.uuid()),
  name: z.string().optional(),
  context: z.string().optional(),
  actions: z.array(z.string()).optional(),
  narrative: z.string().optional(),
  mediaUrls: z.array(MediaURLSchema).optional(),
});

const EventTriggerSchema = z.object({
    type: z.enum(['player-action', 'game-event']).default('player-action'),
    value: z.string().min(1, 'Trigger value is required.'),
});

const EventItemSchema = z.object({
  uuid: z.string().default(() => faker.string.uuid()),
  name: z.string().optional(),
  context: z.string().optional(),
  actions: z.array(z.string()).optional(),
  narrative: z.string().optional(),
  trigger: EventTriggerSchema,
  mediaUrls: z.array(MediaURLSchema).optional(),
});

const NpcItemSchema = z.object({
  uuid: z.string().default(() => faker.string.uuid()),
  name: z.string().optional(),
  context: z.string().optional(),
  actions: z.array(z.string()).optional(),
  narrative: z.string().optional(),
  mediaUrls: z.array(MediaURLSchema).optional(),
});

const ShipStatSchema = z.object({
    value: z.coerce.number().default(0),
    notes: z.string().optional(),
});

const ShipItemSchema = z.object({
  uuid: z.string().default(() => faker.string.uuid()),
  name: z.string().min(1, 'Ship name is required.'),
  class: z.string().optional(),
  registry: z.string().optional(),
  condition: z.string().optional(),
  stats: z.object({
    hull: ShipStatSchema,
    speed: ShipStatSchema,
    armor: ShipStatSchema,
    power: ShipStatSchema,
    crewCapacity: ShipStatSchema,
    cargo: ShipStatSchema,
    stressCap: ShipStatSchema,
  }),
  mediaUrls: z.array(MediaURLSchema).optional(),
});

const ContractSchema = z.object({
    uuid: z.string().default(() => faker.string.uuid()),
    title: z.string().min(1, 'Contract title is required.'),
    description: z.string().min(1, 'Contract description is required.'),
    reward: z.string().min(1, 'Reward is required.'),
    requirements: z.string().optional(),
});


const CampaignSchema = z.object({
  name: z.string().min(1, 'Campaign name is required.'),
  description: z.string().min(1, 'Description is required.'),
  startingLocationId: z.string().optional(),
  status: z.enum(['draft', 'published']).default('draft'),
  imageUrl: z.string().optional(),
  initialMediaUrl: z.string().optional(),
  initialMessage: z.string().optional(),
  acts: z.array(ActItemSchema).optional(),
  locations: z.array(LocationItemSchema).optional(),
  events: z.array(EventItemSchema).optional(),
  npcs: z.array(NpcItemSchema).optional(),
  ships: z.array(ShipItemSchema).optional(),
  contracts: z.array(ContractSchema).optional(),
  prompt: z.string().optional(),
});


type SaveCampaignResponse = {
    success: boolean;
    error?: string;
    campaignId?: string;
};

const createStorageFolderName = (campaignName: string) => {
    return campaignName
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .slice(0, 50);
};

const getMimeTypeAndExtension = (dataUrl: string): { mimeType: string, extension: string } => {
    const mimeMatch = dataUrl.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/);
    if (!mimeMatch) return { mimeType: 'application/octet-stream', extension: '' };
    
    const mimeType = mimeMatch[1];
    const extension = mimeType.split('/')[1]?.split('+')[0] || '';
    
    return { mimeType, extension: `.${extension}` };
};

export async function saveCampaign(
    formData: z.infer<typeof CampaignSchema>,
    campaignId: string | null
): Promise<SaveCampaignResponse> {
    const result = CampaignSchema.safeParse(formData);

    if (!result.success) {
        return { success: false, error: result.error.errors.map(e => e.message).join(', ') };
    }

    const { firestore, storage } = initializeServerFirebase();

    try {
        const dataToSave = { ...result.data };
        let storageFolderName = '';
        
        if (campaignId) {
            const existingCampaignSnap = await getDoc(doc(firestore, 'campaigns', campaignId));
            if (existingCampaignSnap.exists()) {
                storageFolderName = existingCampaignSnap.data().storageFolderName;
            }
        }
        
        if (!storageFolderName && dataToSave.name) {
            storageFolderName = createStorageFolderName(dataToSave.name);
        }

        // Handle initialMediaUrl upload
        if (dataToSave.initialMediaUrl && dataToSave.initialMediaUrl.startsWith('data:')) {
            const { extension } = getMimeTypeAndExtension(dataToSave.initialMediaUrl);
            const filePath = `campaigns/${storageFolderName}/initial_media${extension}`;
            const storageRef = ref(storage, filePath);
            const snapshot = await uploadString(storageRef, dataToSave.initialMediaUrl, 'data_url');
            dataToSave.initialMediaUrl = await getDownloadURL(snapshot.ref);
        }
        
        const mediaFields: ('locations' | 'events' | 'npcs' | 'ships')[] = ['locations', 'events', 'npcs', 'ships'];
        
        for (const field of mediaFields) {
            const items = dataToSave[field];
            if (items && Array.isArray(items)) {
                const updatedItems = await Promise.all(
                    items.map(async (item) => {
                        if (!item.mediaUrls || item.mediaUrls.length === 0) {
                            return item;
                        }

                        const uploadedUrls = await Promise.all(
                            item.mediaUrls.map(async (media, index) => {
                                if (media.url && media.url.startsWith('data:')) {
                                    const { extension } = getMimeTypeAndExtension(media.url);
                                    const filePath = `campaigns/${storageFolderName}/${field}/${item.uuid}/${index}${extension}`;
                                    const storageRef = ref(storage, filePath);
                                    const snapshot = await uploadString(storageRef, media.url, 'data_url');
                                    const downloadURL = await getDownloadURL(snapshot.ref);
                                    return { url: downloadURL, loop: media.loop };
                                }
                                return media;
                            })
                        );
                        
                        return { ...item, mediaUrls: uploadedUrls };
                    })
                );
                (dataToSave as any)[field] = updatedItems;
            }
        }

        const finalData: Record<string, any> = {
            ...dataToSave,
            storageFolderName,
            updatedAt: serverTimestamp(),
        };
        
        if (finalData.acts) finalData.acts = finalData.acts.filter(i => i.name || i.narrative);
        if (finalData.locations) finalData.locations = finalData.locations.filter(i => i.name || i.narrative || (i.mediaUrls && i.mediaUrls.length > 0));
        if (finalData.events) finalData.events = finalData.events.filter(i => i.name || i.narrative || (i.trigger && i.trigger.value) || (i.mediaUrls && i.mediaUrls.length > 0));
        if (finalData.npcs) finalData.npcs = finalData.npcs.filter(i => i.name || i.narrative || (i.mediaUrls && i.mediaUrls.length > 0));
        if (finalData.ships) finalData.ships = finalData.ships.filter(s => s.name || s.condition);
        if (finalData.contracts) finalData.contracts = finalData.contracts.filter(c => c.title || c.description || c.reward);


        let newCampaignId = campaignId;

        if (newCampaignId) {
            const campaignRef = doc(firestore, 'campaigns', newCampaignId);
            await setDoc(campaignRef, finalData, { merge: true });
        } else {
            const campaignsCollection = collection(firestore, 'campaigns');
            const dataWithTimestamp = { ...finalData, createdAt: serverTimestamp() };
            const newDocRef = await addDoc(campaignsCollection, dataWithTimestamp);
            newCampaignId = newDocRef.id;
        }

        revalidatePath('/admin');
        revalidatePath('/admin/campaigns');
        if (newCampaignId) {
             revalidatePath(`/admin/campaigns/${newCampaignId}`);
        }
       
        return { success: true, campaignId: newCampaignId };

    } catch (error: any) {
        console.error('Error saving campaign:', error);
        if (error.code === 'permission-denied') {
            return { success: false, error: 'You do not have permission to perform this action.' };
        }
        return { success: false, error: 'An unknown error occurred while saving the campaign.' };
    }
}

    