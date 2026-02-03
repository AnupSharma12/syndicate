'use client';

import React, { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { doc } from 'firebase/firestore';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';

export interface AppSettings {
  appName: string;
  logoUrl: string;
  faviconUrl: string;
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

const defaultSettings: AppSettings = {
  appName: 'Syndicate ESP',
  logoUrl: '/logo.jpg',
  faviconUrl: '/favicon.svg',
  appDescription: 'The ultimate destination for competitive gaming.',
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
};

interface SettingsContextValue {
  settings: AppSettings;
  isLoading: boolean;
  error: Error | null;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const firestore = useFirestore();
  const settingsDocRef = useMemoFirebase(
    () => (firestore ? doc(firestore, 'appSettings', 'config') : null),
    [firestore]
  );
  const { data, isLoading, error } = useDoc<AppSettings>(settingsDocRef);
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);

  useEffect(() => {
    if (data) {
      setSettings((prev) => ({
        ...prev,
        ...data,
      }));
    }
  }, [data]);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    if (settings.appName) {
      document.title = settings.appName;
    }

    if (settings.appDescription) {
      const descriptionMeta = document.querySelector('meta[name="description"]');
      if (descriptionMeta) {
        descriptionMeta.setAttribute('content', settings.appDescription);
      }
    }

    if (settings.faviconUrl) {
      // Update favicon
      const link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
      if (link) {
        link.href = settings.faviconUrl;
      } else {
        const newLink = document.createElement('link');
        newLink.rel = 'icon';
        newLink.href = settings.faviconUrl;
        document.head.appendChild(newLink);
      }
      
      // Update apple-touch-icon
      const appleLink: HTMLLinkElement | null = document.querySelector("link[rel='apple-touch-icon']");
      if (appleLink) {
        appleLink.href = settings.faviconUrl;
      }
    }
  }, [settings.appName, settings.appDescription, settings.faviconUrl]);

  const value = useMemo(
    () => ({
      settings,
      isLoading,
      error: error as Error | null,
    }),
    [settings, isLoading, error]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useAppSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useAppSettings must be used within SettingsProvider');
  }
  return context;
}
