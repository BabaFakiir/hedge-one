import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { useAuth } from './AuthContext';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { toast } from 'sonner';
import { Zap, Rocket } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

type Nullable<T> = T | null;

interface StrategyRow {
  id: string;
  name: string;
  image_uri: string;
  description: Nullable<string>;
  requires_telegram: boolean | null;
  default_qty: number | null;
  active: boolean | null;
  created_at?: string;
}

export function StrategiesPage() {
  const { accessToken, user } = useAuth();
  const [strategies, setStrategies] = useState<StrategyRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [deployingId, setDeployingId] = useState<string | null>(null);

  const supabase = useMemo(() => {
    return createClient(
      `https://${projectId}.supabase.co`,
      publicAnonKey,
      {
        global: accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : undefined,
      }
    );
  }, [accessToken]);

  useEffect(() => {
    fetchStrategies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase]);

  const fetchStrategies = async () => {
    setIsFetching(true);
    try {
      const { data, error } = await supabase
        .from('strategy_catalog')
        .select('*')
        .eq('active', true)
        .order('name', { ascending: true });

      if (error) throw error;

      setStrategies((data || []) as StrategyRow[]);
    } catch (error) {
      console.error('Error fetching strategies:', error);
      toast.error('Failed to load strategies');
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  };

  const handleDeploy = async (strategy: StrategyRow) => {
    // Placeholder for deploy functionality
    setDeployingId(strategy.id);
    // Simulate a brief delay for UX
    await new Promise(resolve => setTimeout(resolve, 500));
    setDeployingId(null);
    toast.info(`Deploy functionality for "${strategy.name}" coming soon!`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-600">Loading strategies...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-slate-900 mb-1">Strategies</h1>
          <p className="text-slate-600">Browse and deploy available trading strategies</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Strategy Catalogue
          </CardTitle>
          <CardDescription>
            Select a strategy and click Deploy to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          {strategies.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              No strategies available yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {strategies.map((strategy) => (
                <Card
                  key={strategy.id}
                  className="flex flex-col border border-slate-200 hover:shadow-lg transition-shadow aspect-square overflow-hidden"
                >
                  {strategy.image_uri && (
                    <div className="w-full h-32 bg-slate-100 overflow-hidden">
                      <img
                        src={strategy.image_uri}
                        alt={strategy.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback if image fails to load
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  <CardHeader className="flex-1 pb-3 pt-4">
                    <CardTitle className="text-lg font-semibold text-slate-900 line-clamp-2">
                      {strategy.name || 'Unnamed Strategy'}
                    </CardTitle>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {strategy.requires_telegram && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                          Requires Telegram
                        </span>
                      )}
                      {strategy.default_qty !== null && strategy.default_qty !== undefined && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                          Qty: {strategy.default_qty}
                        </span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col flex-1 pt-0 pb-4">
                    <CardDescription className="flex-1 text-sm text-slate-600 line-clamp-3 mb-4 min-h-[60px]">
                      {strategy.description || 'No description available'}
                    </CardDescription>
                    <Button
                      className="w-full mt-auto"
                      onClick={() => handleDeploy(strategy)}
                      disabled={deployingId === strategy.id}
                    >
                      <Rocket className="mr-2 h-4 w-4" />
                      {deployingId === strategy.id ? 'Deploying...' : 'Deploy'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

