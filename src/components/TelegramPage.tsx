import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useAuth } from './AuthContext';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { toast } from 'sonner';
import { MessageSquare, Edit3, Trash2, Plus, X } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import * as Dialog from "@radix-ui/react-dialog";
import './global.css';

type Nullable<T> = T | null;

interface TelegramRow {
  id: string;
  user_id: string;
  bot_token: string;
  chat_id: string;
  label: Nullable<string>;
  created_at?: string;
  updated_at?: string;
}

interface TelegramForm extends Omit<TelegramRow, 'id' | 'user_id' | 'created_at' | 'updated_at'> {}

export function TelegramPage() {
  const { accessToken, user } = useAuth();
  const [telegrams, setTelegrams] = useState<TelegramRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(false);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null); // null => adding new
  const [form, setForm] = useState<TelegramForm | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

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
    if (!user?.id) {
      setIsLoading(false);
      return;
    }
    fetchTelegrams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, supabase]);

  const fetchTelegrams = async () => {
    if (!user?.id) return;
    setIsFetching(true);
    try {
      const { data, error } = await supabase
        .from('user_telegram_chats')
        .select('*')
        .eq('user_id', user.id)
        .order('label', { ascending: true, nullsFirst: false });

      if (error) throw error;

      setTelegrams((data || []) as TelegramRow[]);
    } catch (error) {
      console.error('Error fetching telegram chats:', error);
      toast.error('Failed to load telegram chats');
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  };

  // Open dialog to add new telegram chat
  const openAddDialog = () => {
    if (!user?.id) {
      toast.error('No user detected');
      return;
    }
    setEditingId(null);
    setForm({
      bot_token: '',
      chat_id: '',
      label: null,
    });
    setDialogOpen(true);
  };

  // Open dialog to edit existing telegram chat
  const openEditDialog = (telegram: TelegramRow) => {
    setEditingId(telegram.id);
    setForm({
      bot_token: telegram.bot_token,
      chat_id: telegram.chat_id,
      label: telegram.label,
    });
    setDialogOpen(true);
  };

  const updateForm = <K extends keyof TelegramForm>(field: K, value: TelegramForm[K]) => {
    setForm((prev) => {
      if (!prev) return prev;
      return { ...prev, [field]: value };
    });
  };

  const saveTelegram = async () => {
    if (!form || !user?.id) return;
    if (!form.bot_token || !form.chat_id) {
      toast.error('Bot Token and Chat ID are required');
      return;
    }
    setIsSaving(true);
    try {
      const payload = {
        user_id: user.id,
        bot_token: form.bot_token,
        chat_id: form.chat_id,
        label: form.label,
        updated_at: new Date().toISOString(),
      };

      if (editingId === null) {
        // Insert new telegram chat
        const { error } = await supabase.from('user_telegram_chats').insert([payload]);
        if (error) throw error;
        toast.success('Telegram chat added successfully');
      } else {
        // Update existing telegram chat
        const { error } = await supabase
          .from('user_telegram_chats')
          .update(payload)
          .eq('id', editingId)
          .eq('user_id', user.id);
        if (error) throw error;
        toast.success('Telegram chat updated successfully');
      }
      setDialogOpen(false);
      await fetchTelegrams();
    } catch (err: any) {
      console.error('Save failed:', err);
      toast.error(err?.message || 'Failed to save telegram chat');
    } finally {
      setIsSaving(false);
    }
  };

  const deleteTelegram = async (telegram: TelegramRow) => {
    if (!user?.id) return;
    const confirmed = window.confirm(
      `Are you sure you want to delete this telegram chat${telegram.label ? ` "${telegram.label}"` : ''}? This action cannot be undone.`
    );
    if (!confirmed) return;

    setIsDeleting(telegram.id);
    try {
      const { error } = await supabase
        .from('user_telegram_chats')
        .delete()
        .eq('id', telegram.id)
        .eq('user_id', user.id);
      if (error) throw error;
      toast.success('Telegram chat deleted successfully');
      await fetchTelegrams();
    } catch (err: any) {
      console.error('Delete failed:', err);
      toast.error(err?.message || 'Failed to delete telegram chat');
    } finally {
      setIsDeleting(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-600">Loading telegram chats...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-slate-900 mb-1">Telegram</h1>
          <p className="text-slate-600">Manage your Telegram bot configurations</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={openAddDialog} variant="default">
            <Plus className="mr-2 h-4 w-4" /> Add Telegram
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Telegram Chats
          </CardTitle>
          <CardDescription>
            Manage your Telegram bot tokens and chat IDs. Click Edit to view or modify all fields.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {telegrams.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              No telegram chats yet. Click "Add Telegram" to create one.
            </div>
          ) : (
            <div className="space-y-3">
              {telegrams.map((telegram) => (
                <div
                  key={telegram.id}
                  className="flex items-center justify-between border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="font-semibold text-slate-900">
                      {telegram.label || 'Unnamed Telegram Chat'}
                    </div>
                    <div className="text-sm text-slate-600 mt-1">
                      <span className="font-medium">Chat ID:</span>{' '}
                      <span className="font-mono text-xs">{telegram.chat_id}</span>
                      {telegram.bot_token && (
                        <span className="ml-4">
                          <span className="font-medium">Bot Token:</span>{' '}
                          <span className="font-mono text-xs">{telegram.bot_token.slice(0, 12)}...</span>
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditDialog(telegram)}
                    >
                      <Edit3 className="mr-2 h-4 w-4" /> Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteTelegram(telegram)}
                      disabled={isDeleting === telegram.id}
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> 
                      {isDeleting === telegram.id ? 'Deleting...' : 'Delete'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/** Dialog - reused for Add and Edit */}
      <Dialog.Root open={dialogOpen} onOpenChange={(o) => {
        setDialogOpen(o);
        if (!o) {
          // reset editing state when dialog closes
          setEditingId(null);
          setForm(null);
        }
      }}>
        <Dialog.Portal>
          <Dialog.Overlay className="DialogOverlay" />
          <Dialog.Content className="DialogContent">
            <div className="flex items-center justify-between mb-4">
              <Dialog.Title className="DialogTitle text-xl font-semibold text-slate-900">
                {editingId === null ? 'Add Telegram Chat' : 'Edit Telegram Chat'}
              </Dialog.Title>
              <Dialog.Close asChild>
                <button
                  className="IconButton rounded-full p-1 hover:bg-slate-100 transition-colors"
                  aria-label="Close"
                >
                  <X className="h-5 w-5 text-slate-500" />
                </button>
              </Dialog.Close>
            </div>
            <Dialog.Description className="DialogDescription text-sm text-slate-600 mb-6">
              {editingId === null 
                ? 'Enter telegram chat details below. Bot Token and Chat ID are required.' 
                : 'Edit telegram chat details and click Save to update.'}
            </Dialog.Description>

            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex flex-col">
                  <label htmlFor="telegram-label" className="text-sm font-medium text-slate-700 mb-1.5">
                    Label
                  </label>
                  <Input
                    id="telegram-label"
                    value={form?.label ?? ''}
                    onChange={(e) => updateForm('label', e.target.value || null)}
                    placeholder="e.g. Main Trading Bot"
                    className="w-full"
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="telegram-bot-token" className="text-sm font-medium text-slate-700 mb-1.5">
                    Bot Token <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="telegram-bot-token"
                    type="password"
                    value={form?.bot_token ?? ''}
                    onChange={(e) => updateForm('bot_token', e.target.value)}
                    placeholder="Enter Bot Token"
                    className="w-full"
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="telegram-chat-id" className="text-sm font-medium text-slate-700 mb-1.5">
                    Chat ID <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="telegram-chat-id"
                    value={form?.chat_id ?? ''}
                    onChange={(e) => updateForm('chat_id', e.target.value)}
                    placeholder="Enter Chat ID"
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-200">
              <Dialog.Close asChild>
                <Button
                  variant="outline"
                  onClick={() => {
                    setDialogOpen(false);
                  }}
                >
                  Cancel
                </Button>
              </Dialog.Close>
              <Button
                onClick={async () => {
                  await saveTelegram();
                }}
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}

