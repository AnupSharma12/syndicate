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
import { ArrowLeft, Clock, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getAllAuditLogs } from '@/firebase/audit-logger';

interface AuditLog {
  id: string;
  action: string;
  user: string;
  userId: string;
  details: string;
  status: 'success' | 'error' | 'warning';
  timestamp: Date;
}

interface AuditLogsProps {
  setView: (view: AdminView) => void;
}

type AdminView = 'dashboard' | 'users' | 'tournaments' | 'applications' | 'teams' | 'audit' | 'analytics' | 'settings' | 'health';

export function AuditLogs({ setView }: AuditLogsProps) {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterAction, setFilterAction] = useState<string>('all');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setIsLoading(true);
        const allLogs = await getAllAuditLogs(100);
        if (Array.isArray(allLogs)) {
          setLogs(allLogs);
        } else {
          console.error('Invalid logs format:', allLogs);
          setLogs([]);
        }
      } catch (error) {
        console.error('Failed to fetch audit logs:', error);
        setLogs([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'success': return 'text-green-600 bg-green-500/10';
      case 'error': return 'text-red-600 bg-red-500/10';
      case 'warning': return 'text-yellow-600 bg-yellow-500/10';
      default: return 'text-gray-600 bg-gray-500/10';
    }
  };

  const formatTime = (timestamp: Date) => {
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

  const filteredLogs = filterAction === 'all' 
    ? logs 
    : logs.filter(log => log.action === filterAction);

  const uniqueActions = Array.from(new Set(logs.map(log => log.action)));
  const successCount = logs.filter(l => l.status === 'success').length;
  const successRate = logs.length > 0 ? Math.round((successCount / logs.length) * 100) : 0;
  const uniqueUsers = new Set(logs.map(l => l.user)).size;

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

          {/* Filters */}
          <Card className="bg-card border-border/60 mb-8">
            <CardHeader>
              <CardTitle>Filter by Action</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Button 
                variant={filterAction === 'all' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setFilterAction('all')}
              >
                All Actions ({logs.length})
              </Button>
              {uniqueActions.map(action => (
                <Button 
                  key={action}
                  variant={filterAction === action ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setFilterAction(action)}
                >
                  {action} ({logs.filter(l => l.action === action).length})
                </Button>
              ))}
            </CardContent>
          </Card>

          {/* Logs Table */}
          <Card className="bg-card border-border/60 mb-8">
            <CardContent className="pt-6">
              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : filteredLogs.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No audit logs found</p>
                </div>
              ) : (
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
                      {filteredLogs.map((log) => (
                        <tr key={log.id} className="border-b border-border/30 hover:bg-muted/30 transition-colors">
                          <td className="py-4 px-4 font-medium">{log.action}</td>
                          <td className="py-4 px-4 text-muted-foreground text-sm">{log.user}</td>
                          <td className="py-4 px-4 text-muted-foreground text-xs max-w-xs truncate">{log.details}</td>
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
              )}
            </CardContent>
          </Card>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-card border-border/60">
              <CardHeader>
                <CardTitle className="text-sm">Total Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{logs.length}</div>
                <p className="text-xs text-muted-foreground mt-2">All time</p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border/60">
              <CardHeader>
                <CardTitle className="text-sm">Success Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {successRate}%
                </div>
                <p className="text-xs text-muted-foreground mt-2">Successful operations</p>
              </CardContent>
            </Card>
            <Card className="bg-card border-border/60">
              <CardHeader>
                <CardTitle className="text-sm">Active Admins</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{uniqueUsers}</div>
                <p className="text-xs text-muted-foreground mt-2">Unique users</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
