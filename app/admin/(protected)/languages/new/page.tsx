'use client';

import { useAdminDictionary } from '@/components/admin/AdminDictionaryProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { languageService } from '@/lib/services/language.service';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function NewLanguagePage() {
  const router = useRouter();
  const dict = useAdminDictionary();
  const t = dict.admin.languages;
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await languageService.create({ code: code.trim(), name: name.trim() });
      toast.success(t.createSuccess);
      router.push('/admin/languages');
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
                {isLoading ? t.create.creating : t.create.createButton}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
