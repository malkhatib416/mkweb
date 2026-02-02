'use client';

import { useAdminDictionary } from '@/components/admin/AdminDictionaryProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { categoryService } from '@/lib/services/category.service';
import { generateSlug } from '@/utils/utils';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function NewCategoryPage() {
  const dict = useAdminDictionary();
  const router = useRouter();
  const t = dict.admin.categories;

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleNameChange = (value: string) => {
    setName(value);
    setSlug((prev) =>
      !prev || prev === generateSlug(name) ? generateSlug(value) : prev,
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedSlug = slug.trim() || generateSlug(trimmedName);
    if (!trimmedName || !trimmedSlug) {
      toast.error(t.createError);
      return;
    }
    setIsLoading(true);
    try {
      await categoryService.create({
        name: trimmedName,
        slug: trimmedSlug,
        description: description.trim() || undefined,
      });
      toast.success(t.createSuccess);
      router.push('/admin/categories');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t.createError);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

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
          {t.create.title}
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
          {t.subtitle}
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
                onChange={(e) => handleNameChange(e.target.value)}
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
                disabled={isLoading || !name.trim()}
                className="bg-myorange-100 hover:bg-myorange-100/90"
              >
                {isLoading ? t.create.creating : t.create.createButton}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
