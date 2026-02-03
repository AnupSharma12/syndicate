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
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Settings, Bell, Lock, Save, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useFirestore, setDocumentNonBlocking, useDoc } from '@/firebase';
import { doc } from 'firebase/firestore';
import { logAction } from '@/firebase/audit-logger';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

interface SettingsPanelProps {
  setView: (view: AdminView) => void;
}

type AdminView = 'dashboard' | 'users' | 'tournaments' | 'applications' | 'teams' | 'settings';

interface Settings {
  appName: string;
  appDescription: string;
  appEmail: string;
  maxTeamSize: string;
  minTeamSize: string;
  maxTournamentsPerGame: string;
  tournamentFeePercentage: string;
  enableEmailDigests: boolean;
  enableTeamLogos: boolean;
  enableYouTubeProof: boolean;
  enablePaymentGateway: boolean;
  maintenanceMode: boolean;
  enableRegistration: boolean;
  autoApproveTeams: boolean;
  minPasswordLength: string;
  sessionTimeout: string;
  maxLoginAttempts: string;
  maxUploadSize: string;
  enableAnalytics: boolean;
  enableAuditLogs: boolean;
  backupFrequency: string;
  [key: string]: string | boolean;
}

export function SettingsPanel({ setView }: SettingsPanelProps) {
  const firestore = useFirestore();
  const [settings, setSettings] = useState<Settings>({
    appName: 'Syndicate ESP',
    appDescription: 'Esports tournament management platform',
    appEmail: 'support@syndicate.com',
    maxTeamSize: '5',
    minTeamSize: '1',
    maxTournamentsPerGame: '10',
    tournamentFeePercentage: '10',
    enableEmailDigests: true,
    enableTeamLogos: true,
    enableYouTubeProof: true,
    enablePaymentGateway: true,
    maintenanceMode: false,
    enableRegistration: true,
    autoApproveTeams: false,
    minPasswordLength: '8',
    sessionTimeout: '3600',
    maxLoginAttempts: '5',
    maxUploadSize: '10',
    enableAnalytics: true,
    enableAuditLogs: true,
    backupFrequency: 'daily',
  });
  
  const [currentUser, setCurrentUser] = useState<{ uid: string; email: string | null } | null>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const settingsDocRef = firestore ? doc(firestore, 'appSettings', 'config') : null;
  const { data: loadedSettings } = useDoc(settingsDocRef);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser({ uid: user.uid, email: user.email });
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (loadedSettings) {
      setSettings(prev => ({
        ...prev,
        ...loadedSettings
      }));
    }
    setIsLoading(false);
  }, [loadedSettings]);

  const handleChange = (key: string, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    setError('');
  };

  const handleSave = async () => {
    if (!firestore || !currentUser) {
      setError('Missing firestore or user');
      return;
    }

    setIsSaving(true);
    setError('');
    
    try {
      const settingsDocRef = doc(firestore, 'appSettings', 'config');
      setDocumentNonBlocking(settingsDocRef, {
        ...settings,
        updatedAt: new Date().toISOString(),
        updatedBy: currentUser.email
      }, { merge: true });

      try {
        await logAction(
          'Settings Updated',
          currentUser.uid,
          currentUser.email || 'unknown@example.com',
          `Application settings updated`,
          'success'
        );
      } catch (logError) {
        console.warn('Logging failed but settings saved:', logError);
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
      setError('Failed to save settings. Please try again.');
      try {
        await logAction(
          'Settings Save Error',
          currentUser.uid,
          currentUser.email || 'unknown@example.com',
          `Failed to save settings`,
          'error'
        );
      } catch (logError) {
        console.warn('Logging error failed:', logError);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const featureToggles = [
    { key: 'enableEmailDigests', label: 'Email Digests', desc: 'Weekly summary emails' },
    { key: 'enableTeamLogos', label: 'Team Logos', desc: 'Allow teams to upload logos' },
    { key: 'enableYouTubeProof', label: 'YouTube Proof', desc: 'Require YouTube proof for registrations' },
    { key: 'enablePaymentGateway', label: 'Payment Gateway', desc: 'Enable payment processing' },
  ];

  const securityToggles = [
    { key: 'maintenanceMode', label: 'Maintenance Mode', desc: 'Restrict access to platform' },
    { key: 'enableRegistration', label: 'Enable Registration', desc: 'Allow new user registrations' },
    { key: 'autoApproveTeams', label: 'Auto-Approve Teams', desc: 'Automatically approve team registrations' },
  ];

  const systemToggles = [
    { key: 'enableAnalytics', label: 'Enable Analytics', desc: 'Track user analytics and behavior' },
    { key: 'enableAuditLogs', label: 'Enable Audit Logs', desc: 'Log all admin actions' },
  ];

  return (
    <div className="w-full overflow-x-hidden flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 bg-muted/20">
        <div className="w-full max-w-6xl mx-auto px-4 py-12 md:py-16">
          <div className="mb-10 flex items-center justify-between">
            <div>
              <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tighter">
                Settings
              </h1>
              <p className="mt-3 text-lg text-muted-foreground">
                Configure all application settings and preferences
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

          {saved && (
            <Card className="bg-green-500/10 border-green-500/30 mb-8">
              <CardContent className="pt-6 text-green-600">
                ✓ Settings saved successfully!
              </CardContent>
            </Card>
          )}

          {error && (
            <Card className="bg-red-500/10 border-red-500/30 mb-8">
              <CardContent className="pt-6 flex items-center gap-2 text-red-600">
                <AlertCircle className="w-5 h-5" />
                {error}
              </CardContent>
            </Card>
          )}

          {isLoading ? (
            <Card className="bg-card border-border/60">
              <CardContent className="pt-6">
                <p className="text-muted-foreground">Loading settings...</p>
              </CardContent>
            </Card>
          ) : (
            <>
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
                      <Label htmlFor="appEmail">Support Email</Label>
                      <Input
                        id="appEmail"
                        type="email"
                        value={settings.appEmail}
                        onChange={(e) => handleChange('appEmail', e.target.value)}
                        placeholder="support@example.com"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="appDescription">App Description</Label>
                    <Textarea
                      id="appDescription"
                      value={settings.appDescription}
                      onChange={(e) => handleChange('appDescription', e.target.value)}
                      placeholder="Description of your application"
                      className="min-h-24"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Tournament Settings */}
              <Card className="bg-card border-border/60 mb-8">
                <CardHeader>
                  <CardTitle>Tournament Settings</CardTitle>
                  <CardDescription>Configure tournament-related options</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="minTeamSize">Minimum Team Size</Label>
                      <Input
                        id="minTeamSize"
                        type="number"
                        value={settings.minTeamSize}
                        onChange={(e) => handleChange('minTeamSize', e.target.value)}
                        min="1"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxTeamSize">Maximum Team Size</Label>
                      <Input
                        id="maxTeamSize"
                        type="number"
                        value={settings.maxTeamSize}
                        onChange={(e) => handleChange('maxTeamSize', e.target.value)}
                        min="1"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="maxTournamentsPerGame">Max Tournaments Per Game</Label>
                      <Input
                        id="maxTournamentsPerGame"
                        type="number"
                        value={settings.maxTournamentsPerGame}
                        onChange={(e) => handleChange('maxTournamentsPerGame', e.target.value)}
                        min="1"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tournamentFeePercentage">Tournament Fee Percentage (%)</Label>
                      <Input
                        id="tournamentFeePercentage"
                        type="number"
                        value={settings.tournamentFeePercentage}
                        onChange={(e) => handleChange('tournamentFeePercentage', e.target.value)}
                        min="0"
                        max="100"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Features */}
              <Card className="bg-card border-border/60 mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Features
                  </CardTitle>
                  <CardDescription>Enable or disable platform features</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {featureToggles.map(item => (
                    <div key={item.key} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div>
                        <h3 className="font-semibold">{item.label}</h3>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings[item.key] as boolean}
                        onChange={(e) => handleChange(item.key, e.target.checked)}
                        className="w-5 h-5 cursor-pointer"
                      />
                    </div>
                  ))}
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
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    {securityToggles.map(item => (
                      <div key={item.key} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div>
                          <h3 className="font-semibold">{item.label}</h3>
                          <p className="text-sm text-muted-foreground">{item.desc}</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings[item.key] as boolean}
                          onChange={(e) => handleChange(item.key, e.target.checked)}
                          className="w-5 h-5 cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="minPasswordLength">Min Password Length</Label>
                      <Input
                        id="minPasswordLength"
                        type="number"
                        value={settings.minPasswordLength}
                        onChange={(e) => handleChange('minPasswordLength', e.target.value)}
                        min="6"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sessionTimeout">Session Timeout (seconds)</Label>
                      <Input
                        id="sessionTimeout"
                        type="number"
                        value={settings.sessionTimeout}
                        onChange={(e) => handleChange('sessionTimeout', e.target.value)}
                        min="300"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                      <Input
                        id="maxLoginAttempts"
                        type="number"
                        value={settings.maxLoginAttempts}
                        onChange={(e) => handleChange('maxLoginAttempts', e.target.value)}
                        min="1"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* System Settings */}
              <Card className="bg-card border-border/60 mb-8">
                <CardHeader>
                  <CardTitle>System Settings</CardTitle>
                  <CardDescription>System-wide configuration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="maxUploadSize">Max Upload Size (MB)</Label>
                      <Input
                        id="maxUploadSize"
                        type="number"
                        value={settings.maxUploadSize}
                        onChange={(e) => handleChange('maxUploadSize', e.target.value)}
                        min="1"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="backupFrequency">Backup Frequency</Label>
                      <select
                        id="backupFrequency"
                        value={settings.backupFrequency}
                        onChange={(e) => handleChange('backupFrequency', e.target.value)}
                        className="w-full px-3 py-2 bg-background border border-border rounded-md text-foreground"
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {systemToggles.map(item => (
                      <div key={item.key} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div>
                          <h3 className="font-semibold">{item.label}</h3>
                          <p className="text-sm text-muted-foreground">{item.desc}</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings[item.key] as boolean}
                          onChange={(e) => handleChange(item.key, e.target.checked)}
                          className="w-5 h-5 cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Save Button */}
              <div className="flex gap-4 sticky bottom-4">
                <Button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? 'Saving...' : 'Save All Settings'}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setView('dashboard')}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
