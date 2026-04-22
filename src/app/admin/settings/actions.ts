
'use server';

import { z } from 'zod';
import { initializeServerFirebase } from '@/firebase/server-init';
import { doc, setDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { revalidatePath } from 'next/cache';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_MUSIC_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const ACCEPTED_MUSIC_TYPES = ['audio/mpeg'];

// Schema for validating the form data when files are uploaded
const SettingsSchema = z.object({
    titleScreenImageUrl: z
        .any()
        .refine((file) => !file || file.size === 0 || file.size <= MAX_IMAGE_SIZE, `Max image size is 5MB.`)
        .refine(
            (file) => !file || file.size === 0 || ACCEPTED_IMAGE_TYPES.includes(file.type),
            '.jpg, .jpeg, .png and .webp files are accepted.'
        )
        .optional(),
    titleScreenMusicUrl: z
        .any()
        .refine((file) => !file || file.size === 0 || file.size <= MAX_MUSIC_SIZE, `Max music size is 10MB.`)
        .refine(
            (file) => !file || file.size === 0 || ACCEPTED_MUSIC_TYPES.includes(file.type),
            '.mp3 files are accepted.'
        )
        .optional(),
});

type SettingsResponse = {
    success: boolean;
    error?: string;
};

// Helper to upload a file and get URL. Now uses the initialized storage instance.
async function uploadFileAndGetURL(storage: any, file: File, path: string): Promise<string> {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
}

export async function saveAppSettings(formData: FormData): Promise<SettingsResponse> {
    const imageFile = formData.get('titleScreenImageUrl');
    const musicFile = formData.get('titleScreenMusicUrl');

    const rawFormData = {
        titleScreenImageUrl: imageFile instanceof File && imageFile.size > 0 ? imageFile : undefined,
        titleScreenMusicUrl: musicFile instanceof File && musicFile.size > 0 ? musicFile : undefined,
    };
    
    const result = SettingsSchema.safeParse(rawFormData);
    
    if (!result.success) {
        return { success: false, error: result.error.errors.map(e => e.message).join(', ') };
    }

    try {
        // Correctly initialize all firebase services
        const { firestore, storage } = initializeServerFirebase();
        const settingsRef = doc(firestore, 'app-settings', 'global');
        
        const dataToSave: { titleScreenImageUrl?: string; titleScreenMusicUrl?: string } = {};

        const { titleScreenImageUrl, titleScreenMusicUrl } = result.data;

        if (titleScreenImageUrl) {
            const imageUrl = await uploadFileAndGetURL(storage, titleScreenImageUrl, `title-screen-assets/background-image.${titleScreenImageUrl.name.split('.').pop()}`);
            dataToSave.titleScreenImageUrl = imageUrl;
        }

        if (titleScreenMusicUrl) {
            const musicUrl = await uploadFileAndGetURL(storage, titleScreenMusicUrl, `title-screen-assets/background-music.mp3`);
            dataToSave.titleScreenMusicUrl = musicUrl;
        }
        
        if (Object.keys(dataToSave).length > 0) {
            await setDoc(settingsRef, dataToSave, { merge: true });
        }

        revalidatePath('/'); // Revalidate the home page to show the new background
        revalidatePath('/admin/settings'); // Revalidate settings page to show current values

        return { success: true };

    } catch (error: any) {
        console.error('Error saving app settings:', error);
        if (error.code === 'storage/unauthorized') {
            return { success: false, error: 'Permission denied. You must be an admin to upload files.' };
        }
        return { success: false, error: 'Could not save settings. An unknown error occurred.' };
    }
}
