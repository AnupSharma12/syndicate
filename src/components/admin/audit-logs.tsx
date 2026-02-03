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
import { ArrowLeft, Clock, Trash2, Download } from 'lucide-react';
import { useState } from 'react';

interface AuditLog {
  id: string;
  action: string;
  user: string;
  timestamp: string;
  details: string;
  status: 'success' | 'error' | 'warning';
}

interface AuditLogsProps {
  setView: (view: AdminView) => void;
}

type AdminView = 'dashboard' | 'users' | 'tournaments' | 'applications' | 'teams' | 'audit';

export function AuditLogs({ setView }: AuditLogsProps) {
  const [logs, setLogs] = useState<AuditLog[]>([
    {
      id: '1',
      action: 'User Created',
      user: 'admin@syndicate.esp',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      details: 'New user john.doe@example.com registered',
      status: 'success'
    },
    {
      id: '2',
      action: 'Application Approved',
      user: 'admin@syndicate.esp',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      details: 'Team "Dragons" application approved',
      status: 'success'
    },
    {
      id: '3',
      action: 'Tournament Created',
      user: 'admin@syndicate.esp',
      timestamp: new Date(Date.now() - 10800000).toISOString(),
      details: 'New tournament "Esports Championship 2026" created',
      status: 'success'
    },
    {
      id: '4',
      action: 'Failed Login',
      user: 'unknown@example.com',
      timestamp: new Date(Date.now() - 14400000).toISOString(),
      details: 'Multiple failed login attempts detected',
      status: 'warning'
    },
    {
      id: '5',
      action: 'Settings Updated',
      user: 'admin@syndicate.esp',
      timestamp: new Date(Date.now() - 18000000).toISOString(),
      details: 'Max team size changed from 5 to 6',
      status: 'success'
    },
  ]);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'success': return 'text-green-600 bg-green-500/10';
      case 'error': return 'text-red-600 bg-red-500/10';
      case 'warning': return 'text-yellow-600 bg-yellow-500/10';
      default: return 'text-gray-600 bg-gray-500/10';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <div className="w-full overflow-x-hidden flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 bg-muted/20">
        <div className="w-full max-w-6xl mx-auto px-4 py-12 md:py-16">
          <div className="mb-10 flex items-center justify-between">
            <div>
              <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tighter">
                Audit Logs
              </h1>
              <p className="mt-3 text-lg text-muted-foreground">
                Track all administrative actions and system events
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

          {/* Filters and Actions */}
          <Card className="bg-card border-border/60 mb-8">
            <CardHeader>
              <CardTitle>Filters & Export</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4">
              <Button variant="outline" size="sm">All Actions</Button>
              <Button variant="outline" size="sm">User Actions</Button>
              <Button variant="outline" size="sm">System Events</Button>
              <Button variant="outline" size="sm" className="ml-auto flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
            </CardContent>
          </Card>

          {/* Logs Table */}
          <Card className="bg-card border-border/60">
            <CardContent className="pt-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-border/60 bg-muted/50">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold">Action</th>
                      <th className="text-left py-3 px-4 font-semibold">User</th>
                      <th className="text-left py-3 px-4 font-semibold">Details</th>
                      <th className="text-left py-3 px-4 font-semibold">Time</th>
                      <th className="text-left py-3 px-4 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log) => (
                      <tr key={log.id} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                        <td className="py-4 px-4 font-medium">{log.action}</td>
                        <td className="py-4 px-4 text-muted-foreground">{log.user}</td>
                        <td className="py-4 px-4 text-muted-foreground text-xs">{log.details}</td>
                        <td className="py-4 px-4 text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTime(log.timestamp)}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(log.status)}`}>
                            {log.status.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Log Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <Card className="bg-card border-border/60">
              <CardHeader>
                <CardTitle className="text-sm">Total Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{logs.length}</div>
                <p className="text-xs text-muted-foreground mt-2">Last 30 days</p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border/60">
              <CardHeader>
                <CardTitle className="text-sm">Success Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {Math.round((logs.filter(l => l.status === 'success').length / logs.length) * 100)}%
                </div>
                <p className="text-xs text-muted-foreground mt-2">Successful operations</p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border/60">
              <CardHeader>
                <CardTitle className="text-sm">Active Admins</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">1</div>
                <p className="text-xs text-muted-foreground mt-2">Last 24 hours</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
