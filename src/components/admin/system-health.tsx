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
import { ArrowLeft, Activity, Cpu, Database, Network, RefreshCw } from 'lucide-react';
import { useState } from 'react';

interface HealthMetric {
  name: string;
  status: 'healthy' | 'warning' | 'critical';
  value: number;
  unit: string;
}

interface SystemHealthProps {
  setView: (view: AdminView) => void;
}

type AdminView = 'dashboard' | 'users' | 'tournaments' | 'applications' | 'teams' | 'health';

export function SystemHealth({ setView }: SystemHealthProps) {
  const [metrics] = useState<HealthMetric[]>([
    { name: 'Database', status: 'healthy', value: 45, unit: '%' },
    { name: 'API Response Time', status: 'healthy', value: 120, unit: 'ms' },
    { name: 'Memory Usage', status: 'warning', value: 78, unit: '%' },
    { name: 'Disk Space', status: 'healthy', value: 62, unit: '%' },
  ]);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'healthy': return 'bg-green-500/20 border-green-500/50 text-green-600';
      case 'warning': return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-600';
      case 'critical': return 'bg-red-500/20 border-red-500/50 text-red-600';
      default: return '';
    }
  };

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'healthy': return '✓ Healthy';
      case 'warning': return '⚠ Warning';
      case 'critical': return '✗ Critical';
      default: return 'Unknown';
    }
  };

  return (
    <div className="w-full overflow-x-hidden flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1 bg-muted/20">
        <div className="w-full max-w-6xl mx-auto px-4 py-12 md:py-16">
          <div className="mb-10 flex items-center justify-between">
            <div>
              <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tighter">
                System Health
              </h1>
              <p className="mt-3 text-lg text-muted-foreground">
                Monitor platform performance and resource usage
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setView('dashboard')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </div>
          </div>

          {/* Overall Status */}
          <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/30 mb-8">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-green-600">System Status: Operational</h3>
                  <p className="text-sm text-muted-foreground mt-1">All systems running normally</p>
                </div>
                <div className="text-green-600">
                  <Activity className="w-8 h-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Health Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {metrics.map((metric, idx) => (
              <Card key={idx} className={`border ${getStatusColor(metric.status)}`}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">{metric.name}</CardTitle>
                  {metric.name === 'Database' && <Database className="w-4 h-4" />}
                  {metric.name === 'API Response Time' && <Network className="w-4 h-4" />}
                  {metric.name === 'Memory Usage' && <Cpu className="w-4 h-4" />}
                  {metric.name === 'Disk Space' && <Database className="w-4 h-4" />}
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-3xl font-bold">{metric.value}</div>
                      <p className="text-xs text-muted-foreground mt-1">{metric.unit}</p>
                    </div>
                    <div className="text-xs font-semibold">
                      {getStatusLabel(metric.status)}
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                    <div 
                      className={`h-2 rounded-full ${
                        metric.status === 'healthy' ? 'bg-green-500' :
                        metric.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${metric.value}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Performance Details */}
          <Card className="bg-card border-border/60 mb-8">
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>Real-time performance data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Uptime</p>
                  <p className="text-2xl font-bold">99.9%</p>
                  <p className="text-xs text-green-600 mt-2">● Active</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Requests/min</p>
                  <p className="text-2xl font-bold">1,240</p>
                  <p className="text-xs text-green-600 mt-2">↑ 12% increase</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Avg Latency</p>
                  <p className="text-2xl font-bold">125ms</p>
                  <p className="text-xs text-green-600 mt-2">● Optimal</p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Active Users</p>
                  <p className="text-2xl font-bold">342</p>
                  <p className="text-xs text-green-600 mt-2">↑ 8 new sessions</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alerts and Notifications */}
          <Card className="bg-card border-border/60">
            <CardHeader>
              <CardTitle>Recent Alerts</CardTitle>
              <CardDescription>System notifications and warnings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex gap-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <div className="text-yellow-600 font-bold">⚠</div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">Memory Usage Warning</p>
                    <p className="text-xs text-muted-foreground mt-1">Memory usage is at 78%. Consider optimizing.</p>
                  </div>
                  <button className="text-xs text-blue-600 hover:underline">Resolve</button>
                </div>
                <div className="flex gap-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                  <div className="text-green-600 font-bold">✓</div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm">Database Backup Successful</p>
                    <p className="text-xs text-muted-foreground mt-1">Daily backup completed at 2:30 AM</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
