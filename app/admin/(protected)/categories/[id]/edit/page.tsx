'use client';

import { useAdminDictionary } from '@/components/admin/AdminDictionaryProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loading } from '@/components/ui/loading';
import { categoryService } from '@/lib/services/category.service';
import { fetcher } from '@/lib/swr-fetcher';
import type { CategoryResponse } from '@/types/entities';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import * as React from 'react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import useSWR from 'swr';

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const dict = useAdminDictionary();
  const t = dict.admin.categories;

  const {
    data,
    error,
    isLoading: isFetching,
  } = useSWR<CategoryResponse>(
    id ? `/api/admin/categories/${id}` : null,
    fetcher,
  );

  const category = data?.data;

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  React.useEffect(() => {
    if (category && !isInitialized) {
      setName(category.name);
      setSlug(category.slug);
      setDescription(category.description ?? '');
      setIsInitialized(true);
    }
  }, [category, isInitialized]);

  if (error) {
    toast.error(t.fetchSingleError);
    router.push('/admin/categories');
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await categoryService.update(id, {
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim() || undefined,
      });
      toast.success(t.updateSuccess);
      router.push('/admin/categories');
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

  if (!category) return null;

  return (
    <div className="flex flex-col gap-8">
      <Link
        href="/admin/categories"
        className="inline-flex w-fit items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        {t.backToCategories}
      </Link>

      <div>
        <p className="text-sm font-medium text-muted-foreground">
          {t.edit.title}
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
          {category.name}
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
              <Label htmlFor="slug">{t.fields.slug} *</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
                placeholder={t.placeholders.slug}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                {t.placeholders.slugHint}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">{t.fields.description}</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t.placeholders.description}
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/categories">{dict.admin.common.cancel}</Link>
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-myorange-100 hover:bg-myorange-100/90"
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
