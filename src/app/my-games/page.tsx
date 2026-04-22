'use client';

import { Header } from "@/components/layout/header";
import { FirebaseClientProvider } from "@/firebase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function MyGamesPageContent() {
  return (
    <div>
        <Header />
        <main className="p-4">
            <h1 className="text-2xl font-bold">My Games</h1>
            <p className="text-muted-foreground mb-6">This is where your saved campaigns and game sessions will appear.</p>
            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Coming Soon</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">The ability to view and manage your games is under construction.</p>
                </CardContent>
            </Card>
        </main>
    </div>
  );
}

export default function MyGamesPage() {
  return (
    <FirebaseClientProvider>
      <MyGamesPageContent />
    </FirebaseClientProvider>
  );
}
