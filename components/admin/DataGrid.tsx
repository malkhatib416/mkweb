'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loading } from '@/components/ui/loading';
import { Pagination } from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useDebounce } from '@/hooks/use-debounce';
import { useTranslations } from '@/hooks/use-translations';
import type {
  DataGridConfig,
  DataGridFilter,
  DataGridFilterSelect,
  DataGridFilterText,
  DataGridParams,
  DataGridResponse,
  DataGridSelectOption,
} from '@/types/data-grid';
import { AlertCircle, Columns, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';

const COLUMN_VISIBILITY_PREFIX = 'datagrid-columns-';
/** Sentinel for "all" / empty filter. Cannot use '' because Radix Select reserves empty string for placeholder. */
const EMPTY_FILTER_VALUE = '__all__';

function normalizeSelectOptions(
  opts: DataGridSelectOption[],
  allowEmpty?: boolean,
  emptyLabel?: string,
): { value: string; label: string }[] {
  const list: { value: string; label: string }[] = [];
  if (allowEmpty) {
    list.push({ value: EMPTY_FILTER_VALUE, label: emptyLabel || 'Tous' });
  }
  for (const o of opts) {
    if (typeof o === 'string') {
      list.push({ value: o, label: o });
    } else {
      list.push({ value: o.value, label: o.label });
    }
  }
  return list;
}

function getFilterInitialValues(
  filters: DataGridFilter[] | undefined,
): Record<string, string> {
  const r: Record<string, string> = {};
  if (!filters) return r;
  for (const f of filters) {
    if (f.type === 'select') {
      const opts = normalizeSelectOptions(
        f.options,
        f.allowEmpty,
        f.emptyLabel,
      );
      r[f.name] = opts[0]?.value ?? EMPTY_FILTER_VALUE;
    } else {
      r[f.name] = (f as DataGridFilterText).defaultValue ?? '';
    }
  }
  return r;
}

/** First text filter that uses debouncing (for a single useDebounce). */
function firstDebouncedTextFilter(
  filters: DataGridFilter[] | undefined,
  searchDebounceMs: number,
): DataGridFilterText | null {
  if (!filters) return null;
  const def = searchDebounceMs > 0 ? searchDebounceMs : 300;
  for (const f of filters) {
    if (f.type === 'text') {
      const ms = (f as DataGridFilterText).debounceMs ?? def;
      if (ms > 0) return f as DataGridFilterText;
    }
  }
  return null;
}

export interface DataGridProps<
  T,
  F extends DataGridFilter[] = DataGridFilter[],
> {
  config: DataGridConfig<T, F>;
  /** Called with SWR mutate so the parent can refetch after create/update/delete. */
  onMutateReady?: (_mutate: () => Promise<unknown>) => void;
  /** Called when the grid loading state changes (for dialog submit/disabled state). */
  onLoadingChange?: (_loading: boolean) => void;
}

export function DataGrid<T, F extends DataGridFilter[] = DataGridFilter[]>({
  config,
  onMutateReady,
  onLoadingChange,
}: DataGridProps<T, F>) {
  const { t } = useTranslations();
  const {
    swrKey,
    fetcher,
    filters = [],
    columns,
    actions = [],
    empty,
    searchDebounceMs = 300,
    defaultPageSize = 10,
    pageSizeOptions = [5, 10, 20, 50],
    getData = (r: DataGridResponse<T>) => r?.data ?? [],
    getPages = (r: DataGridResponse<T>) => r?.pagination?.pages ?? 1,
    clientSideFiltering = false,
    filterRows,
    filterTitle,
    className,
    columnVisibilityStorageKey,
  } = config;

  const columnStorageKey =
    COLUMN_VISIBILITY_PREFIX + (columnVisibilityStorageKey ?? swrKey);

  const [filterValues, setFilterValues] = useState<Record<string, string>>(() =>
    getFilterInitialValues(filters),
  );
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [columnVisibility, setColumnVisibility] = useState<
    Record<string, boolean>
  >(() => Object.fromEntries(columns.map((c) => [c.name, true])));

  useEffect(() => {
    if (typeof localStorage === 'undefined') return;
    const raw = localStorage.getItem(columnStorageKey);
    const saved: Record<string, boolean> = (() => {
      try {
        return raw ? JSON.parse(raw) : {};
      } catch {
        return {};
      }
    })();
    const merged = Object.fromEntries(
      columns.map((c) => [c.name, saved[c.name] ?? true]),
    );
    setColumnVisibility(merged);
  }, [columnStorageKey, columns]);

  const persistVisibility = (vis: Record<string, boolean>) => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(columnStorageKey, JSON.stringify(vis));
    }
  };

  const visibleColumns = useMemo(
    () => columns.filter((col) => columnVisibility[col.name] !== false),
    [columns, columnVisibility],
  );

  const handleColumnToggle = (
    name: string,
    checked: boolean | 'indeterminate',
  ) => {
    const next = { ...columnVisibility, [name]: checked === true };
    setColumnVisibility(next);
    persistVisibility(next);
  };

  const handleResetColumns = () => {
    const next = Object.fromEntries(columns.map((c) => [c.name, true]));
    setColumnVisibility(next);
    persistVisibility(next);
  };

  const debouncedText = firstDebouncedTextFilter(filters, searchDebounceMs);
  const debouncedVal = useDebounce(
    debouncedText ? (filterValues[debouncedText.name] ?? '') : '',
    debouncedText ? (debouncedText.debounceMs ?? searchDebounceMs) : 0,
  );

  // Reset to page 1 when debounced search changes
  useEffect(() => {
    if (debouncedText) setPage(1);
  }, [debouncedVal, debouncedText]);

  const params: DataGridParams<Record<string, unknown>> = useMemo(() => {
    const p: Record<string, unknown> = { page, limit: pageSize };
    for (const f of filters) {
      const v =
        debouncedText && f.name === debouncedText.name
          ? debouncedVal
          : (filterValues[f.name] ?? '');
      if (v !== '' && v !== EMPTY_FILTER_VALUE && v != null) p[f.name] = v;
    }
    return p as DataGridParams<Record<string, unknown>>;
  }, [filters, filterValues, debouncedText, debouncedVal, page, pageSize]);

  const swrKeyFull = useMemo(
    () =>
      [
        swrKey,
        clientSideFiltering ? { page: 1, limit: 50000 } : params,
      ] as const,
    [swrKey, clientSideFiltering, params],
  );

  const {
    data: response,
    error,
    isLoading,
    mutate,
  } = useSWR(swrKeyFull, fetcher, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    keepPreviousData: true,
  });

  useEffect(() => {
    onMutateReady?.(mutate);
  }, [mutate, onMutateReady]);

  useEffect(() => {
    onLoadingChange?.(isLoading);
  }, [isLoading, onLoadingChange]);

  const allRows = getData(response ?? {});
  const effectiveFilterValues = useMemo(() => {
    const ev = { ...filterValues };
    if (debouncedText) ev[debouncedText.name] = debouncedVal;
    return ev;
  }, [filterValues, debouncedText, debouncedVal]);

  const filteredRows =
    clientSideFiltering && filterRows
      ? filterRows(allRows, effectiveFilterValues)
      : allRows;

  const totalPages = clientSideFiltering
    ? Math.max(1, Math.ceil(filteredRows.length / pageSize))
    : getPages(response ?? {});

  const rowsToRender = clientSideFiltering
    ? filteredRows.slice((page - 1) * pageSize, page * pageSize)
    : filteredRows;

  // Clamp page when it exceeds totalPages (e.g. after filtering in clientSideFiltering)
  useEffect(() => {
    if (clientSideFiltering && page > totalPages && totalPages >= 1) {
      setPage(totalPages);
    }
  }, [clientSideFiltering, page, totalPages]);

  const setFilter = (name: string, value: string) => {
    setFilterValues((prev) => ({ ...prev, [name]: value }));
    setPage(1);
  };

  return (
    <div className={className ? `space-y-6 ${className}` : 'space-y-6'}>
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error instanceof Error ? error.message : String(error)}
          </AlertDescription>
        </Alert>
      )}
      {/* Filters */}
      {filters.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>{filterTitle ?? t('common.filter')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filters.map((f) => {
                if (f.type === 'text') {
                  const ft = f as DataGridFilterText;
                  return (
                    <div key={f.name} className="space-y-2">
                      <Label>{f.placeholder ?? f.name}</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder={f.placeholder}
                          value={filterValues[f.name] ?? ''}
                          onChange={(e) => {
                            const v = e.target.value;
                            setFilterValues((prev) => ({
                              ...prev,
                              [f.name]: v,
                            }));
                            if ((ft.debounceMs ?? searchDebounceMs) <= 0) {
                              setPage(1);
                            }
                          }}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  );
                }
                const fs = f as DataGridFilterSelect;
                const opts = normalizeSelectOptions(
                  fs.options,
                  fs.allowEmpty,
                  fs.emptyLabel,
                );
                return (
                  <div key={f.name} className="space-y-2">
                    <Label>{f.placeholder ?? f.name}</Label>
                    <Select
                      value={
                        (filterValues[f.name] === '' ||
                          filterValues[f.name] == null) &&
                        fs.allowEmpty
                          ? EMPTY_FILTER_VALUE
                          : (filterValues[f.name] ?? '')
                      }
                      onValueChange={(v) => setFilter(f.name, v)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={
                            f.placeholder ?? t('common.emptyState.noResults')
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {opts.map((o) => (
                          <SelectItem key={o.value} value={o.value}>
                            {o.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Table */}
      <div>
        {columns.length > 0 && (
          <div className="mb-2 flex items-center justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Columns className="h-4 w-4" />
                  {t('common.columns')}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {columns.map((col) => (
                  <DropdownMenuCheckboxItem
                    key={col.name}
                    checked={columnVisibility[col.name] !== false}
                    onCheckedChange={(checked) =>
                      handleColumnToggle(col.name, checked)
                    }
                  >
                    {col.label}
                  </DropdownMenuCheckboxItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleResetColumns}>
                  {t('common.resetColumns')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
        {isLoading ? (
          <Card>
            <Loading size="lg" className="py-8" />
          </Card>
        ) : filteredRows.length === 0 ? (
          <Card>
            <Empty>
              <EmptyHeader>
                {empty?.icon && (
                  <EmptyMedia variant="icon">
                    <empty.icon className="h-6 w-6" />
                  </EmptyMedia>
                )}
                <EmptyTitle>
                  {empty?.title ?? t('common.emptyState.noResults')}
                </EmptyTitle>
                {empty?.description && (
                  <EmptyDescription>{empty.description}</EmptyDescription>
                )}
              </EmptyHeader>
              {empty?.onCreate && empty.createLabel && (
                <EmptyContent>
                  <Button onClick={empty.onCreate}>{empty.createLabel}</Button>
                </EmptyContent>
              )}
            </Empty>
          </Card>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  {visibleColumns.map((col) => (
                    <TableHead
                      key={col.name}
                      className={col.width}
                      style={
                        col.align === 'right'
                          ? { textAlign: 'right' }
                          : col.align === 'center'
                            ? { textAlign: 'center' }
                            : undefined
                      }
                    >
                      {col.label}
                    </TableHead>
                  ))}
                  {actions.length > 0 && (
                    <TableHead className="text-right w-[120px]">
                      {t('common.actions')}
                    </TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {rowsToRender.map((row, idx) => (
                  <TableRow key={(row as { id?: string }).id ?? idx}>
                    {visibleColumns.map((col) => (
                      <TableCell
                        key={col.name}
                        className={col.width}
                        style={
                          col.align === 'right'
                            ? { textAlign: 'right' }
                            : col.align === 'center'
                              ? { textAlign: 'center' }
                              : undefined
                        }
                      >
                        {col.cell
                          ? col.cell(row)
                          : String(
                              (row as Record<string, unknown>)[col.name] ?? '',
                            )}
                      </TableCell>
                    ))}
                    {actions.length > 0 && (
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          {actions.map((a) => {
                            const Icon = a.icon;
                            return (
                              <Button
                                key={a.name}
                                variant={a.variant ?? 'ghost'}
                                size="icon"
                                onClick={() => a.onClick(row)}
                                className={a.className ?? 'h-8 w-8'}
                                aria-label={a.label}
                              >
                                {Icon ? <Icon className="h-4 w-4" /> : a.label}
                              </Button>
                            );
                          })}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <Pagination
        currentPage={page}
        totalPages={Math.max(1, totalPages)}
        onPageChange={setPage}
        pageSize={pageSize}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
        pageSizeOptions={pageSizeOptions}
        className="mt-6"
      />
    </div>
  );
}

export {
  type DataGridAction,
  type DataGridColumn,
  type DataGridConfig,
  type DataGridEmptyConfig,
  type DataGridFilter,
} from '@/types/data-grid';
