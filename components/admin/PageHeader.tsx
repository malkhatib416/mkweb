'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/utils';

export interface PageHeaderProps {
  /** Page title */
  title: string;
  /** Optional short description below the title */
  description?: string;
  /** Back link (href). When provided, shows a back button with arrow to the left of title/description */
  backHref?: string;
  /** Back button label (e.g. "Back to list"). Used for aria-label when backHref is set */
  backLabel?: string;
  /** Optional action buttons or elements rendered on the right */
  actions?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  backHref,
  backLabel = 'Back',
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between',
        className,
      )}
    >
      <div className="flex min-w-0 flex-1 gap-3">
        {backHref && (
          <Link href={backHref} className="shrink-0 pt-0.5">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-muted-foreground hover:text-foreground"
              aria-label={backLabel}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
        )}
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      {actions && (
        <div className="flex shrink-0 flex-wrap items-center gap-2 sm:pt-0.5">
          {actions}
        </div>
      )}
    </div>
  );
}
