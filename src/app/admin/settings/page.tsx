
'use client';

import { FirebaseClientProvider } from '@/firebase';
import { Header } from '@/components/layout/header';
import { SettingsForm } from './settings-form';

function SettingsPageContent() {
    return (
        <div>
            <Header />
            <main className="p-4 max-w-4xl mx-auto space-y-8">
                <div>
                    <h1 className="text-2xl font-bold">Application Settings</h1>
                    <p className="text-muted-foreground">Manage global settings for the application.</p>
                </div>
                <SettingsForm />
            </main>
        </div>
    );
}


export default function SettingsPage() {
    return (
        <FirebaseClientProvider>
            <SettingsPageContent />
        </FirebaseClientProvider>
    );
}
