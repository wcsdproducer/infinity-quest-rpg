
'use client';

import { FirebaseClientProvider } from '@/firebase';
import { Header } from '@/components/layout/header';
import { SkillManagementTable } from './skill-management-table';

function SkillsPageContent() {
    return (
        <div>
            <Header />
            <main className="p-4 max-w-4xl mx-auto space-y-8">
                <div>
                    <h1 className="text-2xl font-bold">Skill Management</h1>
                    <p className="text-muted-foreground">Adjust the levels for each skill in the game.</p>
                </div>
                <SkillManagementTable />
            </main>
        </div>
    );
}

export default function SkillsPage() {
    return (
        <FirebaseClientProvider>
            <SkillsPageContent />
        </FirebaseClientProvider>
    );
}
