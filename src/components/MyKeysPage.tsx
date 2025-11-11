import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useAuth } from './AuthContext';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { toast } from 'sonner';
import { Key } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

type Nullable<T> = T | null;

interface MyKeyRow {
  platform: string;
  api_key: string;
  api_secret: Nullable<string>;
  auth_token: Nullable<string>;
  client_id: Nullable<string>;
  mpin: Nullable<string>;
  totp: Nullable<string>;
  user: string;
}

interface EditableRow extends MyKeyRow {
  _originalApiKey: string;
  _isNew?: boolean;
  _isSaving?: boolean;
  _isDirty?: boolean;
}

export function MyKeysPage() {
  const { accessToken, user } = useAuth();
  const [rows, setRows] = useState<EditableRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  const supabase = useMemo(() => {
    // Create a client that forwards the current user's JWT for RLS
    return createClient(
      `https://${projectId}.supabase.co`,
      publicAnonKey,
      {
        global: accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : undefined,
      }
    );
  }, [accessToken]);

  useEffect(() => {
    if (!user?.id) {
        setIsLoading(false);
        return;
      }
    fetchRows();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, supabase]);

  const fetchRows = async () => {
    if (!user?.id) return;
    setIsFetching(true);
    try {
      const { data, error } = await supabase
        .from('my_keys')
        .select('*')
        .eq('user', user.id)
        .order('platform', { ascending: true });

      if (error) throw error;

      const editable = (data || []).map((r) => ({
        platform: r.platform ?? '',
        api_key: r.api_key ?? '',
        api_secret: r.api_secret ?? null,
        auth_token: r.auth_token ?? null,
        client_id: r.client_id ?? null,
        mpin: r.mpin ?? null,
        totp: r.totp ?? null,
        user: r.user ?? user.id,
        _originalApiKey: r.api_key ?? '',
        _isNew: false,
        _isSaving: false,
        _isDirty: false,
      })) as EditableRow[];

      setRows(editable);
    } catch (error) {
      console.error('Error fetching keys:', error);
      toast.error('Failed to load keys');
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  };

  const addNewRow = () => {
    if (!user?.id) return;
    setRows((prev) => [
      {
        platform: '',
        api_key: '',
        api_secret: null,
        auth_token: null,
        client_id: null,
        mpin: null,
        totp: null,
        user: user.id,
        _originalApiKey: '',
        _isNew: true,
        _isSaving: false,
        _isDirty: true,
      },
      ...prev,
    ]);
  };

  const updateCell = <K extends keyof MyKeyRow>(index: number, field: K, value: MyKeyRow[K]) => {
    setRows((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value, _isDirty: true };
      return next;
    });
  };

  const saveRow = async (index: number) => {
    const row = rows[index];
    if (!row) return;
    if (!row.platform || !row.api_key) {
      toast.error('Platform and API Key are required');
      return;
    }
    try {
      setRows((prev) => {
        const next = [...prev];
        next[index] = { ...next[index], _isSaving: true };
        return next;
      });

      const payload: MyKeyRow = {
        platform: row.platform,
        api_key: row.api_key,
        api_secret: row.api_secret,
        auth_token: row.auth_token,
        client_id: row.client_id,
        mpin: row.mpin,
        totp: row.totp,
        user: row.user,
      };

      if (row._isNew) {
        const { error } = await supabase.from('my_keys').insert([payload]);
        if (error) throw error;
        toast.success('Entry added');
      } else {
        const { error } = await supabase
          .from('my_keys')
          .update(payload)
          .eq('api_key', row._originalApiKey)
          .eq('user', row.user);
        if (error) throw error;
        toast.success('Entry updated');
      }

      // Refresh or update local state
      setRows((prev) => {
        const next = [...prev];
        next[index] = {
          ...next[index],
          _isNew: false,
          _isSaving: false,
          _isDirty: false,
          _originalApiKey: next[index].api_key,
        };
        return next;
      });
    } catch (error: any) {
      console.error('Save failed:', error);
      toast.error(error?.message || 'Save failed');
      setRows((prev) => {
        const next = [...prev];
        next[index] = { ...next[index], _isSaving: false };
        return next;
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-600">Loading keys...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
      <div>
          <h1 className="text-slate-900 mb-1">My Keys</h1>
          <p className="text-slate-600">View, add, and edit your API keys</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={addNewRow} variant="default">Add Entry</Button>
          <Button onClick={fetchRows} variant="secondary" disabled={isFetching}>
            {isFetching ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            API Keys
          </CardTitle>
          <CardDescription>
            Edit any cell and click Save to persist changes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-600">
                  <th className="p-2">Platform</th>
                  <th className="p-2">API Key</th>
                  <th className="p-2">API Secret</th>
                  <th className="p-2">Auth Token</th>
                  <th className="p-2">Client ID</th>
                  <th className="p-2">MPIN</th>
                  <th className="p-2">TOTP</th>
                  <th className="p-2 w-28">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td className="p-2 text-slate-500" colSpan={8}>
                      No entries yet. Click "Add Entry" to create one.
                    </td>
                  </tr>
                ) : (
                  rows.map((r, idx) => (
                    <tr key={`${r._originalApiKey}-${idx}`} className="border-t border-slate-200">
                      <td className="p-2 min-w-[140px]">
                        <Input
                          value={r.platform}
                          onChange={(e) => updateCell(idx, 'platform', e.target.value)}
                          placeholder="Platform"
                        />
                      </td>
                      <td className="p-2 min-w-[220px]">
                        <Input
                          value={r.api_key}
                          onChange={(e) => updateCell(idx, 'api_key', e.target.value)}
                          placeholder="API Key"
                        />
                      </td>
                      <td className="p-2 min-w-[220px]">
              <Input
                          type="password"
                          value={r.api_secret ?? ''}
                          onChange={(e) => updateCell(idx, 'api_secret', e.target.value || null)}
                          placeholder="API Secret"
                        />
                      </td>
                      <td className="p-2 min-w-[220px]">
              <Input
                type="password"
                          value={r.auth_token ?? ''}
                          onChange={(e) => updateCell(idx, 'auth_token', e.target.value || null)}
                          placeholder="Auth Token"
                        />
                      </td>
                      <td className="p-2 min-w-[160px]">
                        <Input
                          value={r.client_id ?? ''}
                          onChange={(e) => updateCell(idx, 'client_id', e.target.value || null)}
                          placeholder="Client ID"
                        />
                      </td>
                      <td className="p-2 min-w-[140px]">
              <Input
                type="password"
                          value={r.mpin ?? ''}
                          onChange={(e) => updateCell(idx, 'mpin', e.target.value || null)}
                          placeholder="MPIN"
                        />
                      </td>
                      <td className="p-2 min-w-[140px]">
              <Input
                type="password"
                          value={r.totp ?? ''}
                          onChange={(e) => updateCell(idx, 'totp', e.target.value || null)}
                          placeholder="TOTP"
                        />
                      </td>
                      <td className="p-2">
                        <Button
                          size="sm"
                          disabled={r._isSaving || !r._isDirty}
                          onClick={() => saveRow(idx)}
                          className="w-full"
                        >
                          {r._isSaving ? 'Saving...' : 'Save'}
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            </div>
        </CardContent>
      </Card>

      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="pt-6">
          <p className="text-amber-900">
          Get Auth token from https://kite.zerodha.com/connect/login?api_key="API_KEY"
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
