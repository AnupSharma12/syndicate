'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardContent
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Settings, Bell, Lock, Save } from 'lucide-react';
import { useState } from 'react';

interface SettingsPanelProps {
  setView: (view: AdminView) => void;
}

type AdminView = 'dashboard' | 'users' | 'tournaments' | 'applications' | 'teams' | 'settings';

export function SettingsPanel({ setView }: SettingsPanelProps) {
  const [settings, setSettings] = useState({
    appName: 'Syndicate ESP',
    maxTeamSize: '5',
    registrationDeadline: '2026-02-28',
    enableNotifications: true,
    maintenanceMode: false,
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    console.log('Settings saved:', settings);
  };

  return (
    <div className="w-full overflow-x-hidden flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 bg-muted/20">
        <div className="w-full max-w-4xl mx-auto px-4 py-12 md:py-16">
          <div className="mb-10 flex items-center justify-between">
            <div>
              <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tighter">
                Settings
              </h1>
              <p className="mt-3 text-lg text-muted-foreground">
                Configure your application settings
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setView('dashboard')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </div>

          {/* Success Message */}
          {saved && (
            <Card className="bg-green-500/10 border-green-500/30 mb-8">
              <CardContent className="pt-6 text-green-600">
                ✓ Settings saved successfully!
              </CardContent>
            </Card>
          )}

          {/* General Settings */}
          <Card className="bg-card border-border/60 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                General Settings
              </CardTitle>
              <CardDescription>Basic application configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="appName">Application Name</Label>
                  <Input
                    id="appName"
                    value={settings.appName}
                    onChange={(e) => handleChange('appName', e.target.value)}
                    placeholder="App name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxTeamSize">Max Team Size</Label>
                  <Input
                    id="maxTeamSize"
                    type="number"
                    value={settings.maxTeamSize}
                    onChange={(e) => handleChange('maxTeamSize', e.target.value)}
                    placeholder="5"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="deadline">Registration Deadline</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={settings.registrationDeadline}
                  onChange={(e) => handleChange('registrationDeadline', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="bg-card border-border/60 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notifications
              </CardTitle>
              <CardDescription>Configure notification preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <h3 className="font-semibold">Application Notifications</h3>
                  <p className="text-sm text-muted-foreground">Send alerts for new applications</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.enableNotifications}
                  onChange={(e) => handleChange('enableNotifications', e.target.checked)}
                  className="w-5 h-5 cursor-pointer"
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <h3 className="font-semibold">Email Digests</h3>
                  <p className="text-sm text-muted-foreground">Weekly summary emails</p>
                </div>
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 cursor-pointer"
                />
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="bg-card border-border/60 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Security
              </CardTitle>
              <CardDescription>Security and access control</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <h3 className="font-semibold">Maintenance Mode</h3>
                  <p className="text-sm text-muted-foreground">Restrict access to platform</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
                  className="w-5 h-5 cursor-pointer"
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <h3 className="font-semibold">Require 2FA</h3>
                  <p className="text-sm text-muted-foreground">Two-factor authentication for admins</p>
                </div>
                <input
                  type="checkbox"
                  className="w-5 h-5 cursor-pointer"
                />
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex gap-4">
            <Button 
              onClick={handleSave}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Save className="w-4 h-4" />
              Save Settings
            </Button>
            <Button 
              variant="outline"
              onClick={() => setView('dashboard')}
            >
              Cancel
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
