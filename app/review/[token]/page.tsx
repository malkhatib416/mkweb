import { getLocaleFromHeaders } from '@/lib/get-locale-from-headers';
import { getDictionary } from '@/locales/dictionaries';
import { getReviewByToken } from '@/lib/services/project-review.service.server';
import ReviewForm from '@/components/ReviewForm';
import Link from 'next/link';

type Props = {
  params: Promise<{ token: string }>;
};

export default async function ReviewPage({ params }: Props) {
  const { token } = await params;
  const locale = await getLocaleFromHeaders();
  const dict = await getDictionary(locale);
  const reviewDict = dict.review as {
    title: string;
    subtitle: string;
    ratingLabel: string;
    reviewTextLabel: string;
    reviewTextPlaceholder: string;
    submit: string;
    submitting: string;
    success: string;
    expired: string;
    alreadySubmitted: string;
    error: string;
  };

  const data = await getReviewByToken(token);

  if (!data) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center px-4">
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-center dark:border-amber-800 dark:bg-amber-950/30">
          <p className="text-lg font-medium text-amber-800 dark:text-amber-200">
            {reviewDict.expired}
          </p>
          <Link
            href={`/${locale}`}
            className="mt-4 inline-block text-sm text-myorange-100 hover:underline"
          >
            {dict.common?.backToHome ?? 'Back to home'}
          </Link>
        </div>
      </div>
    );
  }

  if (data.review.submittedAt) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center px-4">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-6 text-center dark:border-slate-800 dark:bg-slate-900/50">
          <p className="text-lg font-medium text-foreground">
            {reviewDict.alreadySubmitted}
          </p>
          <Link
            href={`/${locale}`}
            className="mt-4 inline-block text-sm text-myorange-100 hover:underline"
          >
            {dict.common?.backToHome ?? 'Back to home'}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 py-12">
      <ReviewForm
        token={token}
        projectTitle={data.project.title}
        clientName={data.client.name}
        dict={reviewDict}
      />
      <Link
        href={`/${locale}`}
        className="mt-6 text-sm text-muted-foreground hover:text-foreground"
      >
        {dict.common?.backToHome ?? 'Back to home'}
      </Link>
    </div>
  );
}
