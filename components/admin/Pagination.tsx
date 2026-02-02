'use client';

import { Button } from '@/components/ui/button';
import { useAdminDictionary } from './AdminDictionaryProvider';

interface PaginationProps {
  currentPage: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
  itemName?: string; // Optional: 'blogs' or 'projects' for custom text
}

export default function Pagination({
  currentPage,
  total,
  limit,
  onPageChange,
  itemName,
}: PaginationProps) {
  const dict = useAdminDictionary();
  const totalPages = Math.ceil(total / limit);

  // Get translations based on itemName (blogs or projects)
  const section = itemName
    ? dict.admin[itemName as 'blogs' | 'projects']
    : null;
  const showingText =
    section?.pagination?.showing || `Showing {from} to {to} of {total} items`;
  const previousText = section?.pagination?.previous || 'Previous';
  const nextText = section?.pagination?.next || 'Next';

  if (totalPages <= 1) {
    return null;
  }

  const from = (currentPage - 1) * limit + 1;
  const to = Math.min(currentPage * limit, total);

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="text-sm text-muted-foreground">
        {showingText
          .replace('{from}', String(from))
          .replace('{to}', String(to))
          .replace('{total}', String(total))}
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          {previousText}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        >
          {nextText}
        </Button>
      </div>
    </div>
  );
}
