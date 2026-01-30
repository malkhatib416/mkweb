'use client';

import { useAdminDictionary } from '@/components/admin/AdminDictionaryProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loading } from '@/components/ui/loading';
import { languageService } from '@/lib/services/language.service';
import { fetcher } from '@/lib/swr-fetcher';
import type { LanguageResponse } from '@/types/entities';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import * as React from 'react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import useSWR from 'swr';

export default function EditLanguagePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const dict = useAdminDictionary();
  const t = dict.admin.languages;

  const {
    data,
    error,
    isLoading: isFetching,
  } = useSWR<LanguageResponse>(
    id ? `/api/admin/languages/${id}` : null,
    fetcher,
  );

  const language = data?.data;

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  React.useEffect(() => {
    if (language && !isInitialized) {
      setCode(language.code);
      setName(language.name);
      setIsInitialized(true);
    }
  }, [language, isInitialized]);

  if (error) {
    toast.error(t.fetchSingleError);
    router.push('/admin/languages');
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await languageService.update(id, { code, name });
      toast.success(t.updateSuccess);
      router.push('/admin/languages');
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

  if (!language) return null;

  return (
    <div className="flex flex-col gap-8">
      <Link
        href="/admin/languages"
        className="inline-flex w-fit items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        {t.backToLanguages}
      </Link>

      <div>
        <p className="text-sm font-medium text-muted-foreground">
          {t.edit.title}
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
          {language.name}
        </h1>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="code">{t.fields.code} *</Label>
              <Input
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                placeholder={t.placeholders.code}
                maxLength={10}
              />
            </div>

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

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/languages">{dict.admin.common.cancel}</Link>
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
