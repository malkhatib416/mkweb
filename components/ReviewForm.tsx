'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'react-hot-toast';

type ReviewDict = {
  title: string;
  subtitle: string;
  ratingLabel: string;
  reviewTextLabel: string;
  reviewTextPlaceholder: string;
  submit: string;
  submitting: string;
  success: string;
  error: string;
};

type Props = {
  token: string;
  projectTitle: string;
  clientName: string;
  dict: ReviewDict;
};

export default function ReviewForm({
  token,
  projectTitle,
  clientName,
  dict,
}: Props) {
  const [rating, setRating] = useState<string>('');
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) {
      toast.error(dict.ratingLabel);
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/review/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          rating,
          reviewText: reviewText || undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || dict.error);
      toast.success(dict.success);
      setDone(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : dict.error);
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center dark:border-emerald-800 dark:bg-emerald-950/30">
        <p className="text-lg font-medium text-emerald-800 dark:text-emerald-200">
          {dict.success}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-md space-y-6 rounded-xl border bg-card p-6 shadow-sm"
    >
      <div>
        <h1 className="text-2xl font-bold text-foreground">{dict.title}</h1>
        <p className="mt-1 text-muted-foreground">{dict.subtitle}</p>
        <p className="mt-2 text-sm text-muted-foreground">
          {projectTitle} — {clientName}
        </p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="rating">{dict.ratingLabel}</Label>
        <Select value={rating} onValueChange={setRating} required>
          <SelectTrigger id="rating">
            <SelectValue placeholder="1–5" />
          </SelectTrigger>
          <SelectContent>
            {['5', '4', '3', '2', '1'].map((n) => (
              <SelectItem key={n} value={n}>
                {n} ★
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="reviewText">{dict.reviewTextLabel}</Label>
        <Textarea
          id="reviewText"
          placeholder={dict.reviewTextPlaceholder}
          value={reviewText}
          onChange={(e) => setReviewText(e.target.value)}
          rows={4}
          className="resize-none"
        />
      </div>
      <Button
        type="submit"
        className="w-full bg-myorange-100 hover:bg-myorange-200"
        disabled={submitting}
      >
        {submitting ? dict.submitting : dict.submit}
      </Button>
    </form>
  );
}
