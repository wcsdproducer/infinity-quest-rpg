
'use client';

import React from 'react';
import { useForm, useFieldArray, Control } from 'react-hook-form';
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
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { saveCampaign } from '../actions';
import { LoaderCircle, PlusCircle, Trash2, Paperclip, Check, RefreshCw, Star, Ship, FileText, Music, Video, Play } from 'lucide-react';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import type { Campaign, ShipItem as TShipItem, Contract as TContract, MediaItem } from '@/lib/types';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { doc } from 'firebase/firestore';
import { Switch } from '@/components/ui/switch';
import { faker } from '@faker-js/faker';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import isEqual from 'lodash.isequal';
import { MultiSelect } from '@/components/ui/multi-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';


const MediaURLSchema = z.object({
    url: z.string().default(''),
    loop: z.boolean().optional().default(false),
});
export type MediaURL = z.infer<typeof MediaURLSchema>;

const ActItemSchema = z.object({
  uuid: z.string().default(() => faker.string.uuid()),
  name: z.string().optional().default(''),
  context: z.string().optional().default(''),
  actions: z.array(z.string()).optional().default([]),
  narrative: z.string().optional().default(''),
});


const LocationItemSchema = z.object({
  uuid: z.string().default(() => faker.string.uuid()),
  name: z.string().optional().default(''),
  context: z.string().optional().default(''),
  actions: z.array(z.string()).optional().default([]),
  narrative: z.string().optional().default(''),
  mediaUrls: z.array(MediaURLSchema).optional().default([]),
  isHidden: z.boolean().optional().default(false),
  isLocked: z.boolean().optional().default(false),
  interiorLocationId: z.string().optional().default(''), // UUID of the linked interior location
});

const EventTriggerSchema = z.object({
    type: z.enum(['player-action', 'game-event']).default('player-action'),
    value: z.string().min(1, 'Trigger value is required.').default(''),
});

const EventItemSchema = z.object({
  uuid: z.string().default(() => faker.string.uuid()),
  name: z.string().optional().default(''),
  context: z.string().optional().default(''),
  actions: z.array(z.string()).optional().default([]),
  narrative: z.string().optional().default(''),
  trigger: EventTriggerSchema.default({ type: 'player-action', value: '' }),
  mediaUrls: z.array(MediaURLSchema).optional().default([]),
});


const NpcItemSchema = z.object({
  uuid: z.string().default(() => faker.string.uuid()),
  name: z.string().optional().default(''),
  context: z.string().optional().default(''),
  actions: z.array(z.string()).optional().default([]),
  narrative: z.string().optional().default(''),
  mediaUrls: z.array(MediaURLSchema).optional().default([]),
});

const ShipStatSchema = z.object({
    value: z.coerce.number().default(0),
    notes: z.string().optional().default(''),
});

const ShipItemSchema = z.object({
  uuid: z.string().default(() => faker.string.uuid()),
  name: z.string().min(1, 'Ship name is required.').default(''),
  class: z.string().optional().default(''),
  registry: z.string().optional().default(''),
  condition: z.string().optional().default(''),
  stats: z.object({
    hull: ShipStatSchema,
    speed: ShipStatSchema,
    armor: ShipStatSchema,
    power: ShipStatSchema,
    crewCapacity: ShipStatSchema,
    cargo: ShipStatSchema,
    stressCap: ShipStatSchema,
  }),
  mediaUrls: z.array(MediaURLSchema).optional().default([]),
});

const ContractSchema = z.object({
    uuid: z.string().default(() => faker.string.uuid()),
    title: z.string().min(1, 'Contract title is required.').default(''),
    description: z.string().min(1, 'Contract description is required.').default(''),
    reward: z.string().min(1, 'Reward is required.').default(''),
    requirements: z.string().optional().default(''),
});


const campaignSchema = z.object({
  name: z.string().min(1, 'Campaign name is required.').default(''),
  description: z.string().min(1, 'Description is required.').default(''),
  startingLocationId: z.string().optional().default(''),
  status: z.enum(['draft', 'published']).default('draft'),
  imageUrl: z.string().optional().default(''),
  initialMediaUrl: z.string().optional().default(''),
  initialMessage: z.string().optional().default(''),
  acts: z.array(ActItemSchema).optional().default([]),
  locations: z.array(LocationItemSchema).optional().default([]),
  events: z.array(EventItemSchema).optional().default([]),
  npcs: z.array(NpcItemSchema).optional().default([]),
  ships: z.array(ShipItemSchema).optional().default([]),
  contracts: z.array(ContractSchema).optional().default([]),
  prompt: z.string().optional().default(''),
});

type CampaignFormValues = z.infer<typeof campaignSchema>;

type FieldArrayNames = "acts" | "locations" | "events" | "npcs" | "ships" | "contracts";

const actionOptions = [
    { label: 'Play Media', value: 'play_media' },
];

const MediaPreview = ({ url, loop, onRemove, onLoopToggle }: { url: string, loop?: boolean, onRemove: () => void, onLoopToggle: (loop: boolean) => void }) => {
    if (!url) return null;
    const isImage = url.startsWith('data:image') || url.includes('image%2F');
    const isVideo = url.startsWith('data:video') || url.includes('video%2F');
    const isAudio = url.startsWith('data:audio') || url.includes('audio%2F');

    return (
        <div className="relative group w-24 h-auto border rounded-lg overflow-hidden flex flex-col">
            <div className="relative w-24 h-24">
                {isImage && <Image src={url} alt="media preview" fill className="object-cover" />}
                {isVideo && (
                    <div className="w-full h-full relative">
                        <video src={url} loop autoPlay muted playsInline className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Play className="w-8 h-8 text-white" />
                        </div>
                    </div>
                )}
                {isAudio && (
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                        <Music className="w-12 h-12 text-muted-foreground" />
                    </div>
                )}
                {!isImage && !isVideo && !isAudio && (
                    <div className="w-full h-full flex items-center justify-center bg-muted">
                        <Paperclip className="w-12 h-12 text-muted-foreground m-auto" />
                    </div>
                )}
            </div>
            <div className="bg-muted/50 p-1 flex items-center justify-around gap-1">
                {(isVideo || isAudio) && (
                    <>
                        <Label htmlFor={`loop-switch-${url.substring(0,10)}`} className="text-xs cursor-pointer">Loop</Label>
                        <Switch id={`loop-switch-${url.substring(0,10)}`} checked={!!loop} onCheckedChange={onLoopToggle} className="h-4 w-7 [&>span]:h-3 [&>span]:w-3 [&>span]:data-[state=checked]:translate-x-3" />
                    </>
                )}
                 <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive/80 hover:text-destructive" onClick={onRemove}>
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};


const CampaignFieldArray = ({ form, name, title, description, placeholder, hasMedia = false }: { form: any, name: FieldArrayNames, title: string, description: string, placeholder: string, hasMedia?: boolean }) => {
    const { fields, append, remove, update } = useFieldArray({
        control: form.control,
        name
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const dataUrl = event.target?.result as string;
            const currentItem = form.getValues(`${name}.${index}`);
            const existingUrls = currentItem.mediaUrls || [];
            update(index, {
                ...currentItem,
                mediaUrls: [...existingUrls, { url: dataUrl, loop: false }]
            });
        };
        reader.readAsDataURL(file);
    };

    const isStartingLocation = (locationUuid: string) => {
        return form.getValues('startingLocationId') === locationUuid;
    }

    const setStartingLocation = (locationUuid: string) => {
        form.setValue('startingLocationId', locationUuid, { shouldDirty: true });
    }
    
    const triggerType = form.watch(`${name}.${fields.length -1}.trigger.type`);
    
    return (
        <div>
            <h3 className="text-lg font-medium">{title}</h3>
            <p className="text-sm text-muted-foreground mb-4">{description}</p>
            <div className="space-y-6">
                {fields.map((field, index) => (
                    <div key={field.id} className="p-4 border rounded-lg bg-muted/20 space-y-4">
                         <div className="flex items-start gap-4">
                            <div className="flex-1 space-y-4">
                                <FormField
                                    control={form.control}
                                    name={`${name}.${index}.name`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder={`Name of ${title.slice(0, -1)} ${index + 1}`} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`${name}.${index}.context`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Context (For AI)</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder={`Background info for the AI. Not shown to player.`} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {name === 'events' ? (
                                     <FormField
                                        control={form.control}
                                        name={`${name}.${index}.actions`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Actions (For AI)</FormLabel>
                                                <FormControl>
                                                     <MultiSelect 
                                                        options={actionOptions}
                                                        selected={field.value || []}
                                                        onChange={field.onChange}
                                                        placeholder="Select AI actions..."
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                ) : (
                                     <FormField
                                        control={form.control}
                                        name={`${name}.${index}.actions`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Actions (Player Options)</FormLabel>
                                                <FormControl>
                                                    <Textarea placeholder={`What can the player do here? One action per line.`} {...field} value={Array.isArray(field.value) ? field.value.join('\n') : field.value || ''} onChange={(e) => field.onChange(e.target.value.split('\n'))} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                )}
                                
                                <FormField
                                    control={form.control}
                                    name={`${name}.${index}.narrative`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Narrative (Player-Facing)</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder={`The story text shown to the player.`} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {name === 'events' && (
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name={`${name}.${index}.trigger.type`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Trigger Type</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a trigger type" />
                                                        </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="player-action">Player Action</SelectItem>
                                                            <SelectItem value="game-event">Game Event</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`${name}.${index}.trigger.value`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Trigger Value</FormLabel>
                                                    {form.watch(`${name}.${index}.trigger.type`) === 'game-event' ? (
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select event" />
                                                            </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="success">Success</SelectItem>
                                                                <SelectItem value="fail">Fail</SelectItem>
                                                                <SelectItem value="critical_success">Critical Success</SelectItem>
                                                                <SelectItem value="critical_fail">Critical Fail</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    ) : (
                                                        <FormControl>
                                                            <Input placeholder="e.g., 'inspect console'" {...field} />
                                                        </FormControl>
                                                    )}
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                )}
                            </div>
                            
                            <div className="flex flex-col items-center gap-2">
                                <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                                {name === 'locations' && (
                                    isStartingLocation((fields[index] as any).uuid) ? (
                                        <Button type="button" variant="secondary" size="sm" className="bg-green-600 hover:bg-green-700 text-white" disabled>
                                            <Star className="mr-2 h-4 w-4" />
                                            Start
                                        </Button>
                                    ) : (
                                        <Button type="button" variant="outline" size="sm" onClick={() => setStartingLocation((fields[index] as any).uuid)}>
                                            Set Start
                                        </Button>
                                    )
                                )}
                            </div>
                        </div>

                        {name === 'locations' && (
                            <div className="border rounded-md p-3 bg-muted/30 space-y-2">
                                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Warden Controls</p>
                                <div className="flex items-center gap-6">
                                    <FormField
                                        control={form.control}
                                        name={`${name}.${index}.isHidden` as any}
                                        render={({ field }) => (
                                            <FormItem className="flex items-center gap-2 space-y-0">
                                                <FormControl>
                                                    <Switch checked={!!field.value} onCheckedChange={field.onChange} />
                                                </FormControl>
                                                <div>
                                                    <FormLabel className="text-sm">Hidden</FormLabel>
                                                    <p className="text-xs text-muted-foreground">Players are unaware this location exists until discovered.</p>
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`${name}.${index}.isLocked` as any}
                                        render={({ field }) => (
                                            <FormItem className="flex items-center gap-2 space-y-0">
                                                <FormControl>
                                                    <Switch checked={!!field.value} onCheckedChange={field.onChange} />
                                                </FormControl>
                                                <div>
                                                    <FormLabel className="text-sm">Locked (Exterior)</FormLabel>
                                                    <p className="text-xs text-muted-foreground">This is the exterior/restricted view. Link an interior below.</p>
                                                </div>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                {/* Linked Interior Location selector — only shown when isLocked is true */}
                                {form.watch(`${name}.${index}.isLocked`) && (
                                    <FormField
                                        control={form.control}
                                        name={`${name}.${index}.interiorLocationId` as any}
                                        render={({ field }) => {
                                            const allLocations = form.getValues('locations') || [];
                                            const thisUuid = (form.getValues(`${name}.${index}`) as any)?.uuid;
                                            const otherLocations = allLocations.filter((l: any) => l.uuid !== thisUuid && !l.isLocked);
                                            return (
                                                <FormItem>
                                                    <FormLabel className="text-sm">Linked Interior Location</FormLabel>
                                                    <p className="text-xs text-muted-foreground mb-1">When a player successfully bypasses this area, they will be offered entry to this interior location.</p>
                                                    <Select
                                                        value={field.value || ''}
                                                        onValueChange={(val) => field.onChange(val === '__none__' ? '' : val)}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue placeholder="— No linked interior —" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="__none__">— No linked interior —</SelectItem>
                                                            {otherLocations.map((l: any) => (
                                                                <SelectItem key={l.uuid} value={l.uuid}>
                                                                    {l.name || 'Unnamed Location'}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </FormItem>
                                            );
                                        }}
                                    />
                                )}
                            </div>
                        )}

                        {hasMedia && (
                            <div className="grid grid-cols-[repeat(auto-fill,minmax(6rem,1fr))] gap-2">
                               {(form.getValues(`${name}.${index}.mediaUrls`) || []).map((media: MediaURL, mediaIndex: number) => (
                                   <MediaPreview key={mediaIndex} url={media.url} loop={media.loop} onRemove={() => {
                                       const currentItem = form.getValues(`${name}.${index}`);
                                       const updatedUrls = currentItem.mediaUrls?.filter((_: any, i: number) => i !== mediaIndex) || [];
                                       update(index, { ...currentItem, mediaUrls: updatedUrls });
                                   }} onLoopToggle={(newLoopState) => {
                                        const currentItem = form.getValues(`${name}.${index}`);
                                        const updatedUrls = currentItem.mediaUrls?.map((m: MediaURL, i: number) => i === mediaIndex ? { ...m, loop: newLoopState } : m) || [];
                                        update(index, { ...currentItem, mediaUrls: updatedUrls });
                                   }} />
                               ))}
                                <div className="w-24 h-24">
                                    <label className={cn(
                                        "cursor-pointer w-full h-full flex flex-col items-center justify-center rounded-lg border-2 border-dashed hover:bg-muted/50 transition-colors"
                                    )}>
                                        <Paperclip className="h-6 w-6 text-muted-foreground" />
                                        <span className="text-xs text-muted-foreground mt-1">
                                            Add Media
                                        </span>
                                        <input type="file" className="hidden" onChange={(e) => handleFileChange(e, index)} />
                                    </label>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => {
                    const baseItem = { uuid: faker.string.uuid(), name: '', context: '', actions: [], narrative: '', mediaUrls: [] };
                    if (name === 'events') {
                        append({ ...baseItem, trigger: { type: 'player-action', value: '' } });
                    } else if (name === 'acts') {
                        append({ uuid: faker.string.uuid(), name: `Act ${fields.length + 1}`, context: '', actions: [], narrative: '' });
                    } else {
                        append(baseItem);
                    }
                }}
            >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add {title.slice(0, -1)}
            </Button>
        </div>
    );
};

const ShipFieldArray = ({ form, name, title, description }: { form: any, name: "ships", title: string, description: string }) => {
    const { fields, append, remove, update } = useFieldArray({
        control: form.control,
        name
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const dataUrl = event.target?.result as string;
            const currentItem = form.getValues(`${name}.${index}`);
            const existingUrls = currentItem.mediaUrls || [];
            update(index, {
                ...currentItem,
                mediaUrls: [...existingUrls, { url: dataUrl, loop: false }]
            });
        };
        reader.readAsDataURL(file);
    };
    
    return (
        <div>
            <h3 className="text-lg font-medium">{title}</h3>
            <p className="text-sm text-muted-foreground mb-4">{description}</p>
            <div className="space-y-6">
                {fields.map((field, index) => (
                    <div key={field.id} className="p-4 border rounded-lg bg-muted/20 space-y-4">
                        <div className="flex items-start gap-4">
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name={`${name}.${index}.name`}
                                    render={({ field }) => (
                                        <FormItem className="md:col-span-2">
                                            <FormLabel>Ship Name</FormLabel>
                                            <FormControl><Input placeholder="e.g., ISS Ardent Dawn" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`${name}.${index}.class`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Class</FormLabel>
                                            <FormControl><Input placeholder="e.g., Medium Survey / Transport Vessel" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                 <FormField
                                    control={form.control}
                                    name={`${name}.${index}.registry`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Registry</FormLabel>
                                            <FormControl><Input placeholder="e.g., Independent" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`${name}.${index}.condition`}
                                    render={({ field }) => (
                                        <FormItem className="md:col-span-2">
                                            <FormLabel>Condition</FormLabel>
                                            <FormControl><Textarea placeholder="e.g., Operational but aging..." {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="md:col-span-2 space-y-2">
                                    <Label>Ship Stats</Label>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 p-2 border rounded-md">
                                        {(Object.keys(form.getValues(`${name}.${index}.stats`)) as (keyof TShipItem['stats'])[]).map((statName) => (
                                            <div key={statName} className="p-2 bg-background/50 rounded-md">
                                                <FormField
                                                    control={form.control}
                                                    name={`${name}.${index}.stats.${statName}.value`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-xs capitalize">{statName}</FormLabel>
                                                            <FormControl><Input type="number" {...field} /></FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                                 <FormField
                                                    control={form.control}
                                                    name={`${name}.${index}.stats.${statName}.notes`}
                                                    render={({ field }) => (
                                                        <FormItem className="mt-1">
                                                            <FormControl><Input placeholder="Notes..." {...field} className="text-xs h-8" /></FormControl>
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="self-start">
                                <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                        </div>
                        <div className="grid grid-cols-[repeat(auto-fill,minmax(6rem,1fr))] gap-2">
                            {(form.getValues(`${name}.${index}.mediaUrls`) || []).map((media: MediaURL, mediaIndex: number) => (
                                <MediaPreview key={mediaIndex} url={media.url} loop={media.loop} onRemove={() => {
                                    const currentItem = form.getValues(`${name}.${index}`);
                                    const updatedUrls = currentItem.mediaUrls?.filter((_: any, i: number) => i !== mediaIndex) || [];
                                    update(index, { ...currentItem, mediaUrls: updatedUrls });
                                }} onLoopToggle={(newLoopState) => {
                                    const currentItem = form.getValues(`${name}.${index}`);
                                    const updatedUrls = currentItem.mediaUrls?.map((m: MediaURL, i: number) => i === mediaIndex ? { ...m, loop: newLoopState } : m) || [];
                                    update(index, { ...currentItem, mediaUrls: updatedUrls });
                                }} />
                            ))}
                            <div className="w-24 h-24">
                                <label className={cn(
                                    "cursor-pointer w-full h-full flex flex-col items-center justify-center rounded-lg border-2 border-dashed hover:bg-muted/50 transition-colors"
                                )}>
                                    <Paperclip className="h-6 w-6 text-muted-foreground" />
                                    <span className="text-xs text-muted-foreground mt-1">
                                        Add Media
                                    </span>
                                    <input type="file" className="hidden" onChange={(e) => handleFileChange(e, index)} />
                                </label>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => {
                    append({
                        uuid: faker.string.uuid(),
                        name: 'ISS Ardent Dawn',
                        class: 'Medium Survey / Transport Vessel',
                        registry: 'Independent',
                        condition: 'Operational but aging. The port-side thruster array occasionally fails to ignite, requiring manual restart. The hull bears the scars of countless micrometeoroid impacts.',
                        stats: {
                            hull: { value: 60, notes: 'Reinforced bow' },
                            speed: { value: 3, notes: 'Port thruster unreliable' },
                            armor: { value: 20, notes: '' },
                            power: { value: 25, notes: 'Overclocked reactor' },
                            crewCapacity: { value: 8, notes: '' },
                            cargo: { value: 50, notes: 'tons' },
                            stressCap: { value: 3, notes: '' },
                        },
                        mediaUrls: []
                    });
                }}
            >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add {title.slice(0, -1)}
            </Button>
        </div>
    );
};

const ContractFieldArray = ({ form, name, title, description }: { form: any, name: "contracts", title: string, description: string }) => {
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name
    });

    return (
        <div>
            <h3 className="text-lg font-medium">{title}</h3>
            <p className="text-sm text-muted-foreground mb-4">{description}</p>
            <div className="space-y-6">
                {fields.map((field, index) => (
                    <div key={field.id} className="p-4 border rounded-lg bg-muted/20 space-y-4">
                        <div className="flex items-start gap-4">
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name={`${name}.${index}.title`}
                                    render={({ field }) => (
                                        <FormItem className="md:col-span-2">
                                            <FormLabel>Contract Title</FormLabel>
                                            <FormControl><Input placeholder="e.g., Retrieve the Black Box" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`${name}.${index}.description`}
                                    render={({ field }) => (
                                        <FormItem className="md:col-span-2">
                                            <FormLabel>Description</FormLabel>
                                            <FormControl><Textarea placeholder="e.g., The corporate overlords want the flight data..." {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`${name}.${index}.reward`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Reward</FormLabel>
                                            <FormControl><Input placeholder="e.g., 50,000 Credits" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                 <FormField
                                    control={form.control}
                                    name={`${name}.${index}.requirements`}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Requirements (Optional)</FormLabel>
                                            <FormControl><Input placeholder="e.g., Must have a registered transport" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="self-start">
                                <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
            <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => {
                    append({
                        uuid: faker.string.uuid(),
                        title: '',
                        description: '',
                        reward: '',
                        requirements: '',
                    });
                }}
            >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add {title.slice(0, -1)}
            </Button>
        </div>
    );
};


export function CampaignForm({ campaignId }: { campaignId: string | null; }) {
  const { toast } = useToast();
  const router = useRouter();
  const firestore = useFirestore();
  const [activeTab, setActiveTab] = React.useState('details');
  const [activeCampaignId, setActiveCampaignId] = React.useState(campaignId);
  const [initialFormState, setInitialFormState] = React.useState<CampaignFormValues | null>(null);

  const campaignRef = useMemoFirebase(() => {
    if (!firestore || !activeCampaignId) return null;
    return doc(firestore, 'campaigns', activeCampaignId);
  }, [firestore, activeCampaignId]);

  const { data: campaign, isLoading: isLoadingCampaign } = useDoc<Campaign>(campaignRef);

  const form = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      name: '',
      description: '',
      startingLocationId: '',
      status: 'draft',
      imageUrl: '',
      initialMediaUrl: '',
      initialMessage: '',
      acts: [],
      locations: [],
      events: [],
      npcs: [],
      ships: [],
      contracts: [],
      prompt: '',
    },
  });
  
  const ensureUuid = (item: any) => ({ ...item, uuid: item.uuid || faker.string.uuid() });

  React.useEffect(() => {
    if (campaign && !initialFormState) {
        const formData: CampaignFormValues = {
            name: campaign.name || '',
            description: campaign.description || '',
            startingLocationId: campaign.startingLocationId || '',
            status: campaign.status || 'draft',
            imageUrl: campaign.imageUrl || '',
            initialMediaUrl: campaign.initialMediaUrl || '',
            initialMessage: campaign.initialMessage || '',
            acts: campaign.acts?.map(a => ({...ensureUuid(a), name: a.name || '', context: a.context || '', actions: a.actions || [], narrative: a.narrative || ''})) || [],
            locations: campaign.locations?.map(l => ({...ensureUuid(l), name: l.name || '', context: l.context || '', actions: l.actions || [], narrative: l.narrative || '', mediaUrls: l.mediaUrls || [], isHidden: (l as any).isHidden ?? false, isLocked: (l as any).isLocked ?? false, interiorLocationId: (l as any).interiorLocationId || ''})) || [],
            events: campaign.events?.map(e => ({ ...ensureUuid(e), name: e.name || '', context: e.context || '', actions: e.actions || [], narrative: e.narrative || '', trigger: e.trigger || { type: 'player-action', value: '' }, mediaUrls: e.mediaUrls || [] })) || [],
            npcs: campaign.npcs?.map(n => ({...ensureUuid(n), name: n.name || '', context: n.context || '', actions: n.actions || [], narrative: n.narrative || '', mediaUrls: n.mediaUrls || []})) || [],
            ships: campaign.ships?.map(s => ({...ensureUuid(s), name: s.name || '', class: s.class || '', registry: s.registry || '', condition: s.condition || '', stats: s.stats, mediaUrls: s.mediaUrls || [] })) || [],
            contracts: campaign.contracts?.map(c => ({...ensureUuid(c), title: c.title || '', description: c.description || '', reward: c.reward || '', requirements: c.requirements || ''})) || [],
            prompt: campaign.prompt || '',
        };
      form.reset(formData);
      setInitialFormState(formData);
    }
  }, [campaign, form, initialFormState]);


  const combinePrompt = (values: CampaignFormValues): string => {
    let promptText = `You are the Warden for the Mothership campaign titled "${values.name}".\n\n`;
    
    let backgroundInfo = ``;
    backgroundInfo += `SYNOPSIS:\n${values.description}\n\n`;

    const startingLocation = values.locations?.find(l => l.uuid === values.startingLocationId);
    if (startingLocation) {
        backgroundInfo += `STARTING LOCATION: The adventure begins at ${startingLocation.name || 'an unnamed location'}. Description: ${startingLocation.narrative || 'No description provided.'}\n\n`;
    }
    
    if (values.initialMediaUrl && !values.initialMediaUrl.startsWith('data:')) {
        backgroundInfo += `INITIAL MEDIA: At the very beginning of the game, your first response MUST set the 'mediaUrl' field to the following URL: ${values.initialMediaUrl}\n\n`;
    }

    if (values.initialMessage) {
        backgroundInfo += `INITIAL MESSAGE TO PLAYER:\n${values.initialMessage}\n\n`;
    }

    const formatMediaItem = (item: MediaItem, type: string) => {
        let text = `- ${item.name || `Unnamed ${type}`}:\n`;
        if (item.context) text += `  - CONTEXT (For AI): ${item.context}\n`;

        if (item.actions && item.actions.length > 0) {
            if (type === 'Event' && item.actions.includes('play_media')) {
                text += `  - AI ACTIONS: When this event is triggered, set the mediaUrl in the output to the first available media URL for this event.\n`;
            } else if (type !== 'Event') {
                 text += `  - ACTIONS (Player Options): ${item.actions.join(', ')}\n`;
            }
        }
        
        if (item.narrative) text += `  - NARRATIVE (For Player): ${item.narrative}\n`;
        if (type === 'Event' && item.trigger) {
            text += `  - TRIGGER: A '${item.trigger.type}' where the value is '${item.trigger.value}'.\n`;
        }


        const cleanMediaUrls = item.mediaUrls?.filter(m => m && m.url && !m.url.startsWith('data:')) || [];
        if (cleanMediaUrls.length > 0) {
            text += `  - MEDIA: ${cleanMediaUrls.map(m => `${m.url}${m.loop ? ' [loop]' : ''}`).join(', ')}\n`;
        }
        return text;
    };
    
    const acts = values.acts?.filter(a => a.name || a.narrative);
    if (acts && acts.length > 0) {
        backgroundInfo += "CAMPAIGN ACTS:\n" + acts.map(a => formatMediaItem(a, 'Act')).join('\n') + "\n\n";
    }
    
    const locations = values.locations?.filter(l => l.name || l.narrative);
    if (locations && locations.length > 0) {
        backgroundInfo += 'LOCATIONS:\n';
        backgroundInfo += 'The following locations exist in this campaign. Use the context and narrative to guide your descriptions.\n';
        backgroundInfo += 'When a player moves to a new location, update the `location` field in your response to exactly match the location name below.\n\n';
        locations.forEach(l => {
            const isStart = l.uuid === values.startingLocationId;
            const tags: string[] = [];
            if (isStart) tags.push('STARTING LOCATION');
            if ((l as any).isHidden) tags.push('HIDDEN — do not reveal this location to players until narratively appropriate');
            if ((l as any).isLocked) {
                // Find the linked interior name if configured
                const interiorId = (l as any).interiorLocationId;
                const interiorLoc = interiorId ? locations.find((il: any) => il.uuid === interiorId) : null;
                const interiorName = interiorLoc?.name || null;
                if (interiorName) {
                    tags.push(`EXTERIOR/LOCKED — players are OUTSIDE. Interior is "${interiorName}". Upon successful bypass, suggest "Enter ${interiorName}" as an action.`);
                } else {
                    tags.push('EXTERIOR/LOCKED — players are OUTSIDE and cannot enter until conditions are met');
                }
            }
            const tagStr = tags.length > 0 ? ` [${tags.join(' | ')}]` : '';
            let text = `- ${l.name || 'Unnamed Location'}${tagStr}:\n`;
            if (l.context) text += `  - CONTEXT (Warden-only): ${l.context}\n`;
            if (l.narrative) text += `  - DESCRIPTION (for players): ${l.narrative}\n`;
            if (l.actions && l.actions.length > 0) text += `  - SUGGESTED PLAYER ACTIONS: ${l.actions.join(', ')}\n`;
            const cleanMedia = l.mediaUrls?.filter(m => m && m.url && !m.url.startsWith('data:')) || [];
            if (cleanMedia.length > 0) {
                text += `  - MEDIA: When a player arrives here, set the mediaUrl in your response to: ${cleanMedia[0].url}\n`;
            }
            backgroundInfo += text + '\n';
        });
        backgroundInfo += '\n';
    }

    const events = values.events?.filter(e => e.name || e.narrative || e.trigger?.value);
    if (events && events.length > 0) {
        backgroundInfo += "POTENTIAL EVENTS:\n" + events.map(e => formatMediaItem(e, 'Event')).join('\n') + "\n\n";
    }
    
    const npcs = values.npcs?.filter(n => n.name || n.narrative);
    if (npcs && npcs.length > 0) {
        backgroundInfo += "KEY NPCs:\n" + npcs.map(n => formatMediaItem(n, 'NPC')).join('\n') + "\n\n";
    }

    const ships = values.ships?.filter(s => s.name);
    if (ships && ships.length > 0) {
        backgroundInfo += "KEY SHIPS:\n" + ships.map(s => {
            let shipDetails = `- ${s.name} (${s.class || 'Unclassed'}): ${s.condition || 'No condition notes'}. Registry: ${s.registry || 'N/A'}.\n`;
            shipDetails += `  Stats: Hull ${s.stats.hull.value}, Speed ${s.stats.speed.value}, Armor ${s.stats.armor.value}, Power ${s.stats.power.value}, Crew ${s.stats.crewCapacity.value}, Cargo ${s.stats.cargo.value} tons, Stress Cap ${s.stats.stressCap.value}.\n`;
            return shipDetails;
        }).join('\n') + "\n\n";
    }

    const contracts = values.contracts?.filter(c => c.title);
    if (contracts && contracts.length > 0) {
        backgroundInfo += "AVAILABLE CONTRACTS:\n" + contracts.map(c => {
            let contractDetails = `- ${c.title}: ${c.description}\n`;
            contractDetails += `  - Reward: ${c.reward}\n`;
            if (c.requirements) contractDetails += `  - Requirements: ${c.requirements}\n`;
            return contractDetails;
        }).join('\n') + "\n\n";
    }

    promptText += `<BACKGROUND_INFORMATION>\n${backgroundInfo}</BACKGROUND_INFORMATION>\n\n`;

    return promptText;
  }
  
  const generateAndUpdatePrompt = () => {
    const currentValues = form.getValues();
    const generatedPrompt = combinePrompt(currentValues);
    form.setValue('prompt', generatedPrompt, { shouldDirty: true });
    toast({
        title: "Prompt Updated",
        description: "The AI Warden prompt has been regenerated with the latest data.",
    })
  }

  const onTabChange = (value: string) => {
    if (value === 'ai-prompt') {
      const currentValues = form.getValues();
      const generatedPrompt = combinePrompt(currentValues);
      form.setValue('prompt', generatedPrompt);
    }
    setActiveTab(value);
  };
  
  const onSubmit = async (values: CampaignFormValues) => {
    const isValid = await form.trigger(['name', 'description']);
    if (!isValid) {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Campaign Name and Description are required to save.',
        });
        setActiveTab('details');
        return;
    }
    
    // Auto-save if this is a new campaign being created on first save
    if (!activeCampaignId) {
        const result = await saveCampaign(form.getValues(), null);
        if (result.success && result.campaignId) {
          setActiveCampaignId(result.campaignId);
          router.replace(`/admin/campaigns/${result.campaignId}`, { scroll: false });
          setInitialFormState(form.getValues());
          toast({ title: 'Campaign Created', description: 'You can now continue editing.' });
          
          const finalPrompt = combinePrompt(values);
          const dataToSave = { ...values, prompt: finalPrompt };
          await saveCampaign(dataToSave, result.campaignId);
          
          router.push('/admin');

        } else {
          toast({ variant: 'destructive', title: 'Error Creating Campaign', description: result.error });
        }
        return;
    }


    const finalPrompt = combinePrompt(values);
    const dataToSave = {
        ...values,
        prompt: finalPrompt,
    };

    const result = await saveCampaign(dataToSave, activeCampaignId);
    
    if (result.success && result.campaignId) {
      toast({
          title: 'Campaign Updated',
          description: `"${values.name}" has been successfully saved.`,
      });
      
      const newInitialState = {
          ...values,
          prompt: finalPrompt,
      };
      form.reset(newInitialState);
      setInitialFormState(newInitialState);
      
      router.push('/admin');
    } else {
         toast({
            variant: 'destructive',
            title: 'Error Saving Campaign',
            description: result.error || 'An unknown error occurred.',
        });
    }
  };

  if (isLoadingCampaign && activeCampaignId) {
      return (
          <div className="flex justify-center items-center h-64">
              <LoaderCircle className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
      );
  }
  
  
  const currentValues = form.watch();
  const isDirty = !isEqual(initialFormState, currentValues);
  const isSaveDisabled = form.formState.isSubmitting || (!isDirty && !!activeCampaignId);

  const handleInitialMediaFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) {
            form.setValue('initialMediaUrl', campaign?.initialMediaUrl || '');
            return;
        };

        const reader = new FileReader();
        reader.onload = (event) => {
            const dataUrl = event.target?.result as string;
            form.setValue('initialMediaUrl', dataUrl, { shouldDirty: true });
        };
        reader.readAsDataURL(file);
    };

  const url = form.watch('initialMediaUrl') || '';
  const isInitialMediaImage = url && (url.startsWith('data:image') || url.includes('image%2F'));
  const isInitialMediaVideo = url && (url.startsWith('data:video') || url.includes('video%2F'));
  const isInitialMediaAudio = url && (url.startsWith('data:audio') || url.includes('audio%2F'));


  return (
    <Card>
      <CardContent className="p-6">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <Tabs value={activeTab} onValueChange={onTabChange}>
                    <div className="flex justify-between items-center mb-4">
                        <TabsList>
                            <TabsTrigger value="details">Details</TabsTrigger>
                            <TabsTrigger value="acts">Acts</TabsTrigger>
                            <TabsTrigger value="locations">Locations</TabsTrigger>
                            <TabsTrigger value="events">Events</TabsTrigger>
                            <TabsTrigger value="npcs">NPCs</TabsTrigger>
                            <TabsTrigger value="ships">Ships</TabsTrigger>
                            <TabsTrigger value="contracts">Contracts</TabsTrigger>
                            <TabsTrigger value="final-touches">Final Touches</TabsTrigger>
                            <TabsTrigger value="ai-prompt">AI Prompt</TabsTrigger>
                        </TabsList>
                        <Button
                            type="submit"
                            disabled={isSaveDisabled}
                            variant="default"
                            >
                            {form.formState.isSubmitting && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                            {activeCampaignId ? 'Update Campaign' : 'Save Campaign'}
                        </Button>
                    </div>

                    <ScrollArea className="h-[500px] pr-4 border-t pt-6">
                        <TabsContent value="details" className="space-y-8 mt-0">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Campaign Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., A Pound of Flesh" {...field} />
                                    </FormControl>
                                    <FormDescription>The public title of your campaign.</FormDescription>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />

                                <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Short Description</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="A one-sentence summary of the campaign." {...field} />
                                    </FormControl>
                                    <FormDescription>This appears on the campaign selection card.</FormDescription>
                                    <FormMessage />
                                    </FormItem>
                                )}
                                />
                        </TabsContent>

                        <TabsContent value="acts">
                            <CampaignFieldArray
                                form={form}
                                name="acts"
                                title="Acts"
                                description="Define the major story arcs of your campaign. Each act represents a significant phase of the narrative."
                                placeholder="e.g., The crew discovers the derelict ship..."
                            />
                        </TabsContent>
                        
                        <TabsContent value="locations">
                            <CampaignFieldArray
                                form={form}
                                name="locations"
                                title="Locations"
                                description="List the key locations the players might visit. Designate one as the starting location."
                                placeholder="A flickering console, a single cryopod..."
                                hasMedia={true}
                            />
                        </TabsContent>

                        <TabsContent value="events">
                            <CampaignFieldArray
                                form={form}
                                name="events"
                                title="Events"
                                description="Outline potential scripted or random events that can occur during the campaign."
                                placeholder="A sudden power failure plunges the ship into darkness..."
                                hasMedia={true}
                            />
                        </TabsContent>

                        <TabsContent value="npcs">
                            <CampaignFieldArray
                                form={form}
                                name="npcs"
                                title="NPCs"
                                description="Describe the non-player characters the crew might encounter. Include their motivations and secrets."
                                placeholder="A paranoid scientist who knows more than he lets on..."
                                hasMedia={true}
                            />
                        </TabsContent>

                        <TabsContent value="ships">
                                <ShipFieldArray
                                    form={form}
                                    name="ships"
                                    title="Ships"
                                    description="Detail the starships featured in the campaign, from player vessels to derelicts."
                                />
                        </TabsContent>

                        <TabsContent value="contracts">
                                <ContractFieldArray
                                    form={form}
                                    name="contracts"
                                    title="Contracts"
                                    description="Define jobs, missions, or tasks players can undertake."
                                />
                        </TabsContent>

                        <TabsContent value="final-touches" className="space-y-8">
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">Status</FormLabel>
                                            <FormDescription>
                                                Published campaigns are visible to players. Drafts are hidden.
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <div className="flex items-center space-x-2">
                                                <span className={cn("text-sm", field.value === 'draft' ? 'text-primary' : 'text-muted-foreground')}>Draft</span>
                                                <Switch
                                                    checked={field.value === 'published'}
                                                    onCheckedChange={(checked) => field.onChange(checked ? 'published' : 'draft')}
                                                />
                                                <span className={cn("text-sm", field.value === 'published' ? 'text-primary' : 'text-muted-foreground')}>Published</span>
                                            </div>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="imageUrl"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel>Image URL</FormLabel>
                                    <FormControl>
                                        <Input placeholder="https://images.unsplash.com/..." {...field} value={field.value ?? ''}/>
                                    </FormControl>
                                    <FormDescription>The cover image for the campaign card. Can be left blank for a default.</FormDescription>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="initialMediaUrl"
                                render={({ field }) => {
                                    return (
                                    <FormItem>
                                    <FormLabel>Initial Launch Media</FormLabel>
                                    <div className="flex items-center gap-4">
                                        <div className="relative group w-24 h-24 border rounded-lg overflow-hidden flex items-center justify-center bg-muted">
                                            {isInitialMediaImage && <Image src={url} alt="media preview" fill className="object-cover" />}
                                            {isInitialMediaVideo && (
                                                <div className="w-full h-full relative">
                                                    <video src={url} loop autoPlay muted playsInline className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Play className="w-8 h-8 text-white" />
                                                    </div>
                                                </div>
                                            )}
                                            {isInitialMediaAudio && (
                                                <div className="w-full h-full flex items-center justify-center bg-muted">
                                                    <Music className="w-12 h-12 text-muted-foreground" />
                                                </div>
                                            )}
                                            {url && !isInitialMediaImage && !isInitialMediaVideo && !isInitialMediaAudio && (
                                                 <div className="w-full h-full flex items-center justify-center bg-muted">
                                                    <Paperclip className="w-12 h-12 text-muted-foreground m-auto" />
                                                </div>
                                            )}
                                            {url && (
                                                 <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                                    <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => form.setValue('initialMediaUrl', '', { shouldDirty: true })}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            )}
                                        </div>

                                        <FormControl>
                                            <label className={cn(
                                                "cursor-pointer flex-1 h-24 flex flex-col items-center justify-center rounded-lg border-2 border-dashed hover:bg-muted/50 transition-colors"
                                            )}>
                                                <Paperclip className="h-6 w-6 text-muted-foreground" />
                                                <span className="text-xs text-muted-foreground mt-1">
                                                    Upload Media
                                                </span>
                                                <input type="file" className="hidden" onChange={handleInitialMediaFileChange} />
                                            </label>
                                        </FormControl>
                                    </div>
                                    <FormDescription>An optional video or audio file to play when the campaign starts.</FormDescription>
                                    <FormMessage />
                                    </FormItem>
                                )}}
                            />

                            <FormField
                            control={form.control}
                            name="initialMessage"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Initial Player Message</FormLabel>
                                <FormControl>
                                    <Textarea rows={5} placeholder="The first bit of story the player will see..." {...field} value={field.value ?? ''}/>
                                </FormControl>
                                <FormDescription>This is the opening crawl or mission briefing that sets the scene.</FormDescription>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                        </TabsContent>

                        <TabsContent value="ai-prompt">
                            <div>
                                <FormField
                                    control={form.control}
                                    name="prompt"
                                    render={({ field }) => (
                                        <FormItem>
                                        <div className="flex items-center justify-between mb-2">
                                            <FormLabel>AI Warden Prompt</FormLabel>
                                            <Button type="button" variant="outline" size="sm" onClick={generateAndUpdatePrompt}>
                                                <RefreshCw className="mr-2 h-4 w-4" />
                                                Update Prompt
                                            </Button>
                                        </div>
                                        <FormControl>
                                            <Textarea rows={15} placeholder="The master prompt for the AI..." {...field} value={field.value ?? ''}/>
                                        </FormControl>
                                        <FormDescription>This prompt is generated from all campaign data. It instructs the AI on how to run the game.</FormDescription>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </TabsContent>
                    </ScrollArea>
                </Tabs>
            </form>
        </Form>
      </CardContent>
    </Card>
  );
}

    