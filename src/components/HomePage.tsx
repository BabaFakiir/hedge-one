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

export function HomePage() {
  const { user, accessToken } = useAuth();
  const [trades, setTrades] = useState<Trade[]>([]);
  const [isLoadingTrades, setIsLoadingTrades] = useState(false);

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

  useEffect(() => {
    fetchTrades();
  }, [fetchTrades]);

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

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates on your trades</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { action: 'Trade executed on BTC/USD', time: '2 hours ago', status: 'success' },
                { action: 'API keys updated successfully', time: '5 hours ago', status: 'info' },
                { action: 'Market alert triggered', time: '1 day ago', status: 'warning' },
              ].map((activity, index) => (
                <div key={index} className="flex items-start gap-3 pb-3 border-b border-slate-100 last:border-0 last:pb-0">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.status === 'success' ? 'bg-green-500' :
                    activity.status === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-slate-900">{activity.action}</p>
                    <p className="text-slate-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
            <CardDescription>Performance metrics at a glance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <span className="text-slate-600">Win Rate</span>
                <span className="text-slate-900">68.5%</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <span className="text-slate-600">Average Trade Duration</span>
                <span className="text-slate-900">3.2 days</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Risk-Reward Ratio</span>
                <span className="text-slate-900">1:2.4</span>
              </div>
            </div>
          </CardContent>
        </Card>
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
    </div>
  );
}
