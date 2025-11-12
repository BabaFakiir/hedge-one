import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { TrendingUp, Activity, BarChart3, DollarSign } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { useAuth } from './AuthContext';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { toast } from 'sonner';

interface Trade {
  id: number;
  user: string | null;
  stock_option: string | null;
  position: string | null;
  price: number | null;
  date_time: string | null;
}

interface PythonLog {
  id: number;
  created_at: string;
  user: string | null;
  content: string | null;
}

export function HomePage() {
  const { user, accessToken } = useAuth();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isLoadingTrades, setIsLoadingTrades] = useState(false);
  const [logs, setLogs] = useState<PythonLog[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);

  const supabase = useMemo(() => {
    return createClient(
      `https://${projectId}.supabase.co`,
      publicAnonKey,
      {
        global: accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : undefined,
      }
    );
  }, [accessToken]);

  const fetchTrades = useCallback(async () => {
    if (!user?.id) return;
    setIsLoadingTrades(true);
    try {
      const { data, error } = await supabase
        .from('trades')
        .select('*')
        .eq('user', user.id)
        .order('date_time', { ascending: false });

      if (error) throw error;

      setTrades((data ?? []) as Trade[]);
    } catch (error) {
      console.error('Error fetching trades:', error);
      toast.error('Failed to load trades');
    } finally {
      setIsLoadingTrades(false);
    }
  }, [supabase, user?.id]);

  const fetchLogs = useCallback(async () => {
    if (!user?.id) return;
    setIsLoadingLogs(true);
    try {
      const { data, error } = await supabase
        .from('python_logs')
        .select('*')
        .eq('user', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      setLogs((data ?? []) as PythonLog[]);
    } catch (error) {
      console.error('Error fetching logs:', error);
      toast.error('Failed to load logs');
    } finally {
      setIsLoadingLogs(false);
    }
  }, [supabase, user?.id]);

  useEffect(() => {
    fetchTrades();
    fetchLogs();
  }, [fetchTrades, fetchLogs]);

  const stats = [
    {
      title: 'Total Balance',
      value: '$48,294',
      icon: DollarSign,
      description: '+12.3% this month',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Active Trades',
      value: '8',
      icon: Activity,
      description: '3 pending review',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Performance',
      value: '+15.2%',
      icon: BarChart3,
      description: 'Average return',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Win Rate',
      value: '68.5%',
      icon: TrendingUp,
      description: 'Last 30 days',
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-slate-900 mb-2">Dashboard</h1>
        <p className="text-slate-600">Welcome back! Here's an overview of your trading activity.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-slate-600">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-slate-900 mb-1">{stat.value}</div>
                <p className="text-slate-500">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Trades</CardTitle>
            <CardDescription>Latest executions pulled from your trade history</CardDescription>
          </div>
          <Button onClick={fetchTrades} disabled={isLoadingTrades} variant="secondary">
            {isLoadingTrades ? 'Refreshing...' : 'Refresh'}
          </Button>
        </CardHeader>
        <CardContent>
          {isLoadingTrades ? (
            <div className="text-slate-600">Loading trades...</div>
          ) : trades.length === 0 ? (
            <div className="text-slate-500 text-sm">No trades recorded yet.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Stock / Option</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Date / Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trades.map((trade) => (
                  <TableRow key={trade.id}>
                    <TableCell>{trade.stock_option ?? '—'}</TableCell>
                    <TableCell className="capitalize">{trade.position ?? '—'}</TableCell>
                    <TableCell>
                      {trade.price !== null && trade.price !== undefined
                        ? `$${trade.price.toFixed(2)}`
                        : '—'}
                    </TableCell>
                    <TableCell>
                      {trade.date_time
                        ? new Date(trade.date_time).toLocaleString()
                        : '—'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <CardTitle>Python Logs</CardTitle>
            <CardDescription>Live output captured from your automation scripts</CardDescription>
          </div>
          <Button onClick={fetchLogs} disabled={isLoadingLogs} variant="secondary">
            {isLoadingLogs ? 'Refreshing...' : 'Refresh'}
          </Button>
        </CardHeader>
        <CardContent>
          {isLoadingLogs ? (
            <div className="text-slate-600">Loading logs...</div>
          ) : logs.length === 0 ? (
            <div className="text-slate-500 text-sm">No logs available yet.</div>
          ) : (
            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="border border-slate-200 rounded-md p-3 bg-white shadow-sm"
                >
                  <div className="text-xs text-slate-500 mb-1">
                    {new Date(log.created_at).toLocaleString()}
                  </div>
                  <pre className="whitespace-pre-wrap break-words text-sm text-slate-800">
                    {log.content ?? ''}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
