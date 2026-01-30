'use client';

import { useAdminDictionary } from '@/components/admin/AdminDictionaryProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUploadPhoto } from '@/hooks/use-upload-photo';
import { clientService } from '@/lib/services/client.service';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function NewClientPage() {
  const router = useRouter();
  const dict = useAdminDictionary();
  const t = dict.admin.clients;
  const { uploadPhoto, isUploading: isUploadingPhoto } = useUploadPhoto();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [photo, setPhoto] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePhotoFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadPhoto(file);
      setPhoto(url);
      toast.success('Photo uploaded');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await clientService.create({
        name,
        email: email || undefined,
        company: company || undefined,
        photo: photo || undefined,
      });
      toast.success(t.createSuccess);
      router.push('/admin/clients');
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
        href="/admin/clients"
        className="inline-flex w-fit items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        {t.backToClients}
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
                {isLoading ? t.create.creating : t.create.createButton}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
