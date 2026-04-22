
'use client';

import { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { saveAppSettings } from './actions';
import { useDoc, useFirestore } from '@/firebase';
import { doc } from 'firebase/firestore';
import { LoaderCircle, Upload, Music, Image as ImageIcon } from 'lucide-react';
import type { AppSettings } from '@/lib/types';
import Image from 'next/image';

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_MUSIC_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const ACCEPTED_MUSIC_TYPES = ['audio/mpeg'];

const SettingsSchema = z.object({
  titleScreenImageUrl: z
    .any()
    .optional()
    .refine((files) => !files || files.length == 0 || files[0].size <= MAX_IMAGE_SIZE, `Max image size is 5MB.`)
    .refine(
      (files) => !files || files.length == 0 || ACCEPTED_IMAGE_TYPES.includes(files[0].type),
      '.jpg, .jpeg, .png and .webp files are accepted.'
    ),
  titleScreenMusicUrl: z
    .any()
    .optional()
    .refine((files) => !files || files.length == 0 || files[0].size <= MAX_MUSIC_SIZE, `Max music size is 10MB.`)
    .refine(
        (files) => !files || files.length == 0 || ACCEPTED_MUSIC_TYPES.includes(files[0].type),
        '.mp3 files are accepted.'
    ),
});

export function SettingsForm() {
    const { toast } = useToast();
    const firestore = useFirestore();
    const imageInputRef = useRef<HTMLInputElement>(null);
    const musicInputRef = useRef<HTMLInputElement>(null);
    
    const settingsRef = firestore ? doc(firestore, 'app-settings', 'global') : null;
    const { data: currentSettings, isLoading: isLoadingSettings } = useDoc<AppSettings>(settingsRef);
    
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [musicFileName, setMusicFileName] = useState<string | null>(null);


    const form = useForm<z.infer<typeof SettingsSchema>>({
        resolver: zodResolver(SettingsSchema),
        defaultValues: {
            titleScreenImageUrl: undefined,
            titleScreenMusicUrl: undefined,
        }
    });

    useEffect(() => {
        if (currentSettings) {
           setImagePreview(currentSettings.titleScreenImageUrl || null);
           setMusicFileName(currentSettings.titleScreenMusicUrl ? 'Current background music' : null);
        }
    }, [currentSettings]);


    const onSubmit = async (values: z.infer<typeof SettingsSchema>) => {
        const formData = new FormData();
        if (values.titleScreenImageUrl && values.titleScreenImageUrl.length > 0) {
            formData.append('titleScreenImageUrl', values.titleScreenImageUrl[0]);
        }
        if (values.titleScreenMusicUrl && values.titleScreenMusicUrl.length > 0) {
            formData.append('titleScreenMusicUrl', values.titleScreenMusicUrl[0]);
        }

        // Only submit if there's something to save
        if (formData.has('titleScreenImageUrl') || formData.has('titleScreenMusicUrl')) {
            const response = await saveAppSettings(formData);
            
            if (response.success) {
                toast({
                    title: 'Settings Saved',
                    description: 'Your application settings have been updated.',
                });
                form.reset();
                 if (imageInputRef.current) imageInputRef.current.value = '';
                 if (musicInputRef.current) musicInputRef.current.value = '';
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: response.error || 'An unknown error occurred.',
                });
            }
        } else {
            toast({
                title: 'No changes',
                description: 'No new files were selected to save.',
            });
        }
    };

    if (isLoadingSettings) {
        return (
            <div className="flex items-center justify-center h-48">
                <LoaderCircle className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Title Screen</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        
                        <FormField
                            control={form.control}
                            name="titleScreenImageUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Background Image</FormLabel>
                                    <FormControl>
                                        <div className="relative flex justify-center items-center h-48 w-full border-2 border-dashed rounded-lg">
                                            {imagePreview ? (
                                                <Image src={imagePreview} alt="Background preview" fill style={{objectFit: "cover"}} className="rounded-lg" />
                                            ) : (
                                                <div className="text-center text-muted-foreground">
                                                   <ImageIcon className="mx-auto h-10 w-10" />
                                                   <p>No image selected</p>
                                                </div>
                                            )}
                                            <Input 
                                                ref={imageInputRef}
                                                type="file" 
                                                accept="image/*"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0];
                                                    field.onChange(e.target.files);
                                                    if (file) {
                                                        const reader = new FileReader();
                                                        reader.onloadend = () => {
                                                            setImagePreview(reader.result as string);
                                                        };
                                                        reader.readAsDataURL(file);
                                                    } else {
                                                        setImagePreview(currentSettings?.titleScreenImageUrl || null);
                                                    }
                                                }}
                                             />
                                        </div>
                                    </FormControl>
                                    <FormDescription>
                                        Upload a new background image for the title screen. (Max 5MB)
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="titleScreenMusicUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Background Music</FormLabel>
                                    <FormControl>
                                        <div className="flex items-center gap-4">
                                            <div className="relative flex items-center justify-center w-full">
                                                <Button type="button" variant="outline" className="w-full justify-start text-left font-normal" asChild>
                                                    <label htmlFor="music-upload" className="cursor-pointer">
                                                        <Music className="mr-2 h-4 w-4" />
                                                        <span className="truncate flex-1">
                                                            {musicFileName || 'Select an MP3 file...'}
                                                        </span>
                                                    </label>
                                                </Button>
                                                 <Input 
                                                    id="music-upload"
                                                    ref={musicInputRef}
                                                    type="file" 
                                                    accept=".mp3"
                                                    className="sr-only"
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        field.onChange(e.target.files);
                                                        setMusicFileName(file ? file.name : (currentSettings?.titleScreenMusicUrl ? 'Current background music' : null));
                                                    }}
                                                />
                                            </div>
                                            {musicFileName && (
                                                <Button type="button" variant="ghost" size="sm" onClick={() => {
                                                    form.setValue('titleScreenMusicUrl', null);
                                                    setMusicFileName(null);
                                                    if (musicInputRef.current) musicInputRef.current.value = '';
                                                }}>Clear</Button>
                                            )}
                                        </div>
                                    </FormControl>
                                    <FormDescription>
                                        Upload background music for the title screen. (MP3 only, Max 10MB)
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        
                        <Button type="submit" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                            Save Settings
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
