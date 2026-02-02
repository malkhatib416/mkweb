import { cn } from '@/utils/utils';

type LoadingVariant = 'spinner' | 'dots' | 'text';
type LoadingSize = 'sm' | 'md' | 'lg';

const sizeClasses: Record<LoadingSize, string> = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-8 w-8 border-2',
};

export interface LoadingProps {
  /** Visual style: spinner (circle), dots, or text pulse */
  variant?: LoadingVariant;
  /** Size for spinner; dots/text use default sizing */
  size?: LoadingSize;
  /** Optional label shown below the indicator (and used for a11y) */
  label?: string;
  /** Additional class for the wrapper (flex centering, min-h, padding, etc.) */
  className?: string;
}

/**
 * Reusable loading indicator. Use for full-page, card, or inline loading states.
 */
export function Loading({
  variant = 'spinner',
  size = 'md',
  label,
  className,
}: LoadingProps) {
  const content =
    variant === 'spinner' ? (
      <div
        className={cn(
          'animate-spin rounded-full border-primary border-b-transparent',
          sizeClasses[size],
        )}
        role="progressbar"
        aria-label={label ?? 'Loading'}
      />
    ) : variant === 'dots' ? (
      <span
        className="inline-flex items-center gap-1"
        role="progressbar"
        aria-label={label ?? 'Loading'}
      >
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current [animation-delay:0ms]" />
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current [animation-delay:150ms]" />
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current [animation-delay:300ms]" />
      </span>
    ) : (
      <span
        className="animate-pulse text-muted-foreground"
        role="progressbar"
        aria-label={label ?? 'Loading'}
      >
        {label ?? 'Loading…'}
      </span>
    );

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-2',
        className,
      )}
    >
      {content}
      {label && variant !== 'text' && (
        <span className="text-sm text-muted-foreground">{label}</span>
      )}
    </div>
  );
}
