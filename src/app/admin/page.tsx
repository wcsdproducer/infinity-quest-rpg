
'use client';

import { Header } from "@/components/layout/header";
import { FirebaseClientProvider } from "@/firebase";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Settings, Wrench, BookHeart } from 'lucide-react';

function AdminPageContent() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <p className="text-muted-foreground">Manage campaigns, app settings, and game mechanics.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                  <div className="flex items-start justify-between">
                      <div>
                          <CardTitle>Campaign Management</CardTitle>
                          <CardDescription>Create and manage your adventures.</CardDescription>
                      </div>
                      <BookHeart className="h-6 w-6 text-muted-foreground" />
                  </div>
              </CardHeader>
              <CardContent>
                  <p>Build and edit the storylines, locations, NPCs, and events that make up your game worlds.</p>
              </CardContent>
              <CardFooter>
                  <Button asChild>
                    <Link href="/admin/campaigns">Manage Campaigns</Link>
                  </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                  <div className="flex items-start justify-between">
                      <div>
                          <CardTitle>Application Settings</CardTitle>
                          <CardDescription>Global look and feel.</CardDescription>
                      </div>
                      <Settings className="h-6 w-6 text-muted-foreground" />
                  </div>
              </CardHeader>
              <CardContent>
                  <p>Customize the title screen's background image and music to match the theme of your universe.</p>
              </CardContent>
              <CardFooter>
                  <Button asChild>
                  <Link href="/admin/settings">Manage Settings</Link>
                  </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                  <div className="flex items-start justify-between">
                      <div>
                          <CardTitle>Skill Management</CardTitle>
                          <CardDescription>View skill prerequisites.</CardDescription>
                      </div>
                      <Wrench className="h-6 w-6 text-muted-foreground" />
                  </div>
              </CardHeader>
              <CardContent>
                  <p>Review the hardcoded skill tree, including Trained, Expert, and Master level skills and their requirements.</p>
              </CardContent>
              <CardFooter>
                  <Button asChild>
                  <Link href="/admin/skills">View Skills</Link>
                  </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function AdminPage() {
  return (
    <FirebaseClientProvider>
      <AdminPageContent />
    </FirebaseClientProvider>
  );
}
