'use client';

import { useAdminDictionary } from '@/components/admin/AdminDictionaryProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { LANGUAGES_PALETTE, getFlagEmoji } from '@/data/languages-palette';
import { languageService } from '@/lib/services/language.service';
import { fetcher } from '@/lib/swr-fetcher';
import { ArrowLeft, Plus, Search } from 'lucide-react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';
import useSWR from 'swr';

type LanguagesListResponse = { data: { code: string }[] };

export default function NewLanguagePage() {
  const dict = useAdminDictionary();
  const t = dict.admin.languages;
  const {
    data,
    isLoading: loadingExisting,
    mutate,
  } = useSWR<LanguagesListResponse>('/api/admin/languages?limit=100', fetcher);
  const existingCodes = useMemo(
    () => new Set((data?.data ?? []).map((l) => l.code)),
    [data],
  );
  const [addingCode, setAddingCode] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCustom, setShowCustom] = useState(false);
  const [customCode, setCustomCode] = useState('');
  const [customName, setCustomName] = useState('');
  const [customLoading, setCustomLoading] = useState(false);

  const availableItems = useMemo(() => {
    const notAdded = LANGUAGES_PALETTE.filter(
      (l) => !existingCodes.has(l.code),
    );
    if (!searchQuery.trim()) return notAdded;
    const q = searchQuery.trim().toLowerCase();
    return notAdded.filter(
      (l) =>
        l.name.toLowerCase().includes(q) || l.code.toLowerCase().includes(q),
    );
  }, [existingCodes, searchQuery]);

  const handleAddFromPalette = async (code: string, name: string) => {
    if (existingCodes.has(code)) return;
    setAddingCode(code);
    try {
      await languageService.create({ code, name });
      toast.success(t.createSuccess);
      await mutate();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t.createError);
      console.error(err);
    } finally {
      setAddingCode(null);
    }
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = customCode.trim();
    const name = customName.trim();
    if (!code || !name) return;
    setCustomLoading(true);
    try {
      await languageService.create({ code, name });
      toast.success(t.createSuccess);
      await mutate();
      setCustomCode('');
      setCustomName('');
      setShowCustom(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t.createError);
      console.error(err);
    } finally {
      setCustomLoading(false);
    }
  };

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
          {t.create.title}
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
          {t.subtitle}
        </h1>
      </div>

      <Card>
        <CardContent className="pt-6">
          <p className="mb-4 text-sm text-muted-foreground">
            {t.create.chooseFromPalette}
          </p>
          {loadingExisting ? (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="h-16 animate-pulse rounded-lg bg-muted"
                />
              ))}
            </div>
          ) : (
            <>
              <div className="relative mb-5">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    (t.create as { searchPlaceholder?: string })
                      .searchPlaceholder ?? 'Search by name or code…'
                  }
                  className="h-10 rounded-lg border-border bg-muted/30 pl-10 focus-visible:ring-2 focus-visible:ring-ring/20"
                  aria-label={
                    (t.create as { searchPlaceholder?: string })
                      .searchPlaceholder ?? 'Search by name or code'
                  }
                />
              </div>
              {availableItems.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">
                  {(t.create as { noResults?: string }).noResults ??
                    'No languages to add.'}
                </p>
              ) : (
                <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {availableItems.map(({ code, name }) => {
                    const adding = addingCode === code;
                    return (
                      <li key={code}>
                        <div className="flex items-center gap-4 rounded-xl border border-border bg-card px-4 py-3 shadow-sm transition-colors hover:border-border/40 hover:bg-muted/30">
                          <span
                            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted/50 text-2xl leading-none"
                            role="img"
                            aria-hidden
                          >
                            {getFlagEmoji(code)}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-foreground">
                              {name}
                            </p>
                            <p className="text-xs uppercase tracking-wider text-muted-foreground">
                              {code}
                            </p>
                          </div>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            className="h-9 w-9 shrink-0 rounded-full p-0 text-foreground hover:bg-myorange-100/10 hover:text-foreground"
                            disabled={adding}
                            onClick={() => handleAddFromPalette(code, name)}
                            title={t.create.addThisLanguage}
                            aria-label={t.create.addThisLanguage}
                          >
                            {adding ? (
                              <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                            ) : (
                              <Plus className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Separator />

      <div>
        <Button
          type="button"
          variant="outline"
          className="gap-1.5"
          onClick={() => setShowCustom((v) => !v)}
        >
          <Plus className="h-4 w-4" />
          {t.create.addCustom}
        </Button>
        {showCustom && (
          <Card className="mt-4">
            <CardContent className="pt-6">
              <form onSubmit={handleCustomSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="custom-code">{t.fields.code} *</Label>
                  <Input
                    id="custom-code"
                    value={customCode}
                    onChange={(e) => setCustomCode(e.target.value)}
                    placeholder={t.placeholders.code}
                    maxLength={10}
                    required={showCustom}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="custom-name">{t.fields.name} *</Label>
                  <Input
                    id="custom-name"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder={t.placeholders.name}
                    required={showCustom}
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setShowCustom(false);
                      setCustomCode('');
                      setCustomName('');
                    }}
                  >
                    {dict.admin.common.cancel}
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      customLoading || !customCode.trim() || !customName.trim()
                    }
                    className="bg-myorange-100 hover:bg-myorange-100/90"
                  >
                    {customLoading ? t.create.creating : t.create.createButton}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
