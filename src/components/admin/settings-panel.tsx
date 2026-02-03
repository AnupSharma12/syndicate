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
import { useFirestore, setDocumentNonBlocking, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { logAction } from '@/firebase/audit-logger';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Image from 'next/image';

interface SettingsPanelProps {
  setView: (view: AdminView) => void;
}

type AdminView = 'dashboard' | 'users' | 'tournaments' | 'applications' | 'teams' | 'settings';

interface Settings {
  appName: string;
  logoUrl: string;
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
    logoUrl: '/logo.jpg',
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
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const settingsDocRef = useMemoFirebase(
    () => (firestore ? doc(firestore, 'appSettings', 'config') : null),
    [firestore]
  );
  const { data: loadedSettings, isLoading: isSettingsLoading, error: settingsError } = useDoc(settingsDocRef);
  const isLoading = isSettingsLoading;

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
  }, [loadedSettings]);

  useEffect(() => {
    if (settingsError) {
      setError('Failed to load settings. Please refresh and try again.');
    }
  }, [settingsError]);

  const handleChange = (key: string, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    setError('');
  };

  const handleLogoUpload = async (file: File | null) => {
    if (!file) return;
    setIsUploadingLogo(true);
    setError('');

    try {
      const maxUploadSize = Number(settings.maxUploadSize || '10') * 1024 * 1024;
      if (Number.isFinite(maxUploadSize) && file.size > maxUploadSize) {
        setError(`File too large. Max upload size is ${settings.maxUploadSize || '10'} MB.`);
        return;
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload-logo', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(result?.error || `Logo upload failed (${response.status})`);
      }

      const result = await response.json();
      handleChange('logoUrl', result.url);
    } catch (uploadError) {
      console.error('Logo upload error:', uploadError);
      setError('Failed to upload logo. Please try again.');
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleLogoDownload = async () => {
    if (!settings.logoUrl) {
      setError('No logo available to download.');
      return;
    }

    try {
      const response = await fetch(settings.logoUrl);
      if (!response.ok) {
        throw new Error(`Download failed (${response.status})`);
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'app-logo';
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (downloadError) {
      console.error('Logo download error:', downloadError);
      setError('Failed to download logo. Please try again.');
    }
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
          <div className="mb-10">
            <div className="flex items-center justify-between mb-8">
              <div className="flex-1 pr-4">
                <Label htmlFor="headerAppName" className="text-sm text-muted-foreground">App Name</Label>
                <div className="relative mt-2">
                  <input
                    id="headerAppName"
                    type="text"
                    value={settings.appName}
                    onChange={(e) => handleChange('appName', e.target.value)}
                    placeholder="Application Name"
                    className="w-full text-3xl md:text-4xl font-bold font-headline bg-transparent border-0 border-b-2 border-red-600/50 focus:border-red-600 focus:outline-none focus:ring-0 py-2 px-0 transition-colors"
                  />
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setView('dashboard')}
                className="flex items-center gap-2 mt-6"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </div>
            <p className="text-lg text-muted-foreground">
              Configure all application settings and preferences
            </p>
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
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="logoUpload">App Logo</Label>
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-full border border-border/60 overflow-hidden bg-muted/40">
                          <Image
                            src={settings.logoUrl || '/logo.jpg'}
                            alt="App logo preview"
                            width={64}
                            height={64}
                            className="h-16 w-16 object-cover"
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <Input
                            id="logoUpload"
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleLogoUpload(e.target.files?.[0] || null)}
                            disabled={isUploadingLogo}
                          />
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => handleChange('logoUrl', '/logo.jpg')}
                              disabled={isUploadingLogo}
                            >
                              Reset to Default
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={handleLogoDownload}
                              disabled={isUploadingLogo || !settings.logoUrl}
                            >
                              Download Logo
                            </Button>
                            <span className="text-xs text-muted-foreground">
                              {isUploadingLogo ? 'Uploading...' : 'PNG/JPG up to your max upload size'}
                            </span>
                          </div>
                        </div>
                      </div>
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
