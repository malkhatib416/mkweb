'use client';

import { useAdminDictionary } from '@/components/admin/AdminDictionaryProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loading } from '@/components/ui/loading';
import { clientService } from '@/lib/services/client.service';
import { fetcher } from '@/lib/swr-fetcher';
import type { ClientResponse } from '@/types/entities';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import * as React from 'react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import useSWR from 'swr';

export default function EditClientPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const dict = useAdminDictionary();
  const t = dict.admin.clients;

  const {
    data,
    error,
    isLoading: isFetching,
  } = useSWR<ClientResponse>(id ? `/api/admin/clients/${id}` : null, fetcher);

  const client = data?.data;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [photo, setPhoto] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const handlePhotoFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingPhoto(true);
    try {
      const formData = new FormData();
      formData.set('file', file);
      const res = await fetch('/api/admin/upload/photo', {
        method: 'POST',
        body: formData,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Upload failed');
      setPhoto(json.url);
      toast.success('Photo uploaded');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploadingPhoto(false);
      e.target.value = '';
    }
  };

  React.useEffect(() => {
    if (client && !isInitialized) {
      setName(client.name);
      setEmail(client.email ?? '');
      setCompany(client.company ?? '');
      setPhoto(client.photo ?? '');
      setIsInitialized(true);
    }
  }, [client, isInitialized]);

  if (error) {
    toast.error(t.fetchSingleError);
    router.push('/admin/clients');
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await clientService.update(id, {
        name,
        email: email || undefined,
        company: company || undefined,
        photo: photo || undefined,
      });
      toast.success(t.updateSuccess);
      router.push('/admin/clients');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t.updateError);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="rounded-lg border border-border bg-card py-16">
        <Loading label={t.loading} />
      </div>
    );
  }

  if (!client) return null;

  return (
    <div className="flex flex-col gap-8">
      <Link
        href="/admin/clients"
        className="inline-flex w-fit items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        {t.backToClients}
      </Link>

      <div>
        <p className="text-sm font-medium text-muted-foreground">
          {t.edit.title}
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
          {client.name}
        </h1>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">{t.fields.name} *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder={t.placeholders.name}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t.fields.email}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t.placeholders.email}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">{t.fields.company}</Label>
              <Input
                id="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder={t.placeholders.company}
              />
            </div>

            <div className="space-y-2">
              <Label>{t.fields.photo}</Label>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Input
                    id="photo-file"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="max-w-xs"
                    disabled={isUploadingPhoto}
                    onChange={handlePhotoFile}
                  />
                  {isUploadingPhoto && (
                    <span className="text-sm text-muted-foreground">
                      Uploading…
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{t.orPasteUrl}</p>
                <Input
                  id="photo"
                  type="url"
                  value={photo}
                  onChange={(e) => setPhoto(e.target.value)}
                  placeholder={t.placeholders.photoUrl}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/clients">{dict.admin.common.cancel}</Link>
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-myorange-100 hover:bg-myorange-200"
              >
                {isLoading ? t.edit.updating : t.edit.updateButton}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
