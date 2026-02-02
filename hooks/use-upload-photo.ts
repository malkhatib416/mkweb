'use client';

import { useCallback, useState } from 'react';

const UPLOAD_URL = '/api/admin/upload/photo';

export function useUploadPhoto() {
  const [isUploading, setIsUploading] = useState(false);

  const uploadPhoto = useCallback(async (file: File): Promise<string> => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.set('file', file);
      const res = await fetch(UPLOAD_URL, { method: 'POST', body: formData });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Upload failed');
      return json.url as string;
    } finally {
      setIsUploading(false);
    }
  }, []);

  return { uploadPhoto, isUploading };
}
