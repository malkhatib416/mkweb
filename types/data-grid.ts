import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

/** Filter types supported by DataGrid */
export type DataGridFilterType = 'text' | 'select';

/** Options for select filter: string[] or { value, label }[] */
export type DataGridSelectOption = string | { value: string; label: string };

export interface DataGridFilterBase {
  name: string;
  placeholder?: string;
  /** Only for "text": debounce ms. Use 0 to disable. Default from grid config. */
  debounceMs?: number;
}

export interface DataGridFilterText extends DataGridFilterBase {
  type: 'text';
  /** Initial value or for controlled use */
  defaultValue?: string;
}

export interface DataGridFilterSelect extends DataGridFilterBase {
  type: 'select';
  options: DataGridSelectOption[];
  /** Optional "all" / empty value for clearing the filter */
  allowEmpty?: boolean;
  emptyLabel?: string;
}

export type DataGridFilter = DataGridFilterText | DataGridFilterSelect;

/** Params built by the grid: filter values + page + limit. F is the shape of extra filter fields. */
export type DataGridParams<
  F extends Record<string, unknown> = Record<string, unknown>,
> = F & {
  page: number;
  limit: number;
};

/** Standard list API response. Actions return { success, data?, pagination?, error? }. */
export interface DataGridResponse<T> {
  data?: T[];
  pagination?: {
    page?: number;
    limit?: number;
    total?: number;
    pages?: number;
  };
  success?: boolean;
  error?: string;
}

export interface DataGridColumn<T> {
  name: string;
  label: string;
  /** Custom cell renderer. Default: row[name] */
  cell?: (row: T) => ReactNode;
  /** Optional width, e.g. "w-[120px]" or "150px" */
  width?: string;
  /** Align: default "left" */
  align?: 'left' | 'center' | 'right';
}

export interface DataGridAction<T> {
  name: string;
  label: string;
  onClick: (row: T) => void;
  variant?:
    | 'default'
    | 'destructive'
    | 'ghost'
    | 'outline'
    | 'link'
    | 'secondary';
  icon?: LucideIcon;
  /** e.g. "text-red-600 hover:text-red-700 hover:bg-red-50" for delete */
  className?: string;
}

export interface DataGridEmptyConfig {
  icon?: LucideIcon;
  title: string;
  description?: string;
  /** Label for the primary action button */
  createLabel?: string;
  /** When user clicks create in empty state. If not set, actions.createLabel is ignored. */
  onCreate?: () => void;
}

/** Extract filter field names and their value types from filter config. */
export type DataGridFilterValues<F extends DataGridFilter[]> = {
  [K in F[number]['name']]: string | undefined;
};

export interface DataGridConfig<
  T,
  F extends DataGridFilter[] = DataGridFilter[],
  // Params = DataGridParams<DataGridFilterValues<F>>
> {
  /** Unique SWR key part, e.g. "redirects", "tags". Full key is [swrKey, params]. */
  swrKey: string;
  /**
   * Fetcher. Receives the full SWR key [swrKey, params].
   * params = { ...filterValues, page, limit }.
   * Most list fetchers expect (key) => api(key[1]); if your fetcher expects only params, use (key) => myFetcher(key[1]).
   */
  fetcher: (
    key: readonly [string, DataGridParams<DataGridFilterValues<F>>],
  ) => Promise<DataGridResponse<T>>;
  filters?: F;
  columns: DataGridColumn<T>[];
  actions?: DataGridAction<T>[];
  empty?: DataGridEmptyConfig;
  /** Debounce (ms) for text filters. Default 300. Use 0 to disable. */
  searchDebounceMs?: number;
  /** Default page size. Default 10. */
  defaultPageSize?: number;
  /** Page size options. Default [5, 10, 20, 50]. */
  pageSizeOptions?: number[];
  /** Override getData from response. Default: r => r?.data ?? [] */
  getData?: (response: DataGridResponse<T>) => T[];
  /** Override getPages from response. Default: r => r?.pagination?.pages ?? 1 */
  getPages?: (response: DataGridResponse<T>) => number;
  /**
   * When true: fetch all data once (no filter/pagination params), no server pagination.
   * Filtering is applied in the frontend via filterRows. Pagination UI is hidden.
   */
  clientSideFiltering?: boolean;
  /**
   * Required when clientSideFiltering is true.
   * Applies filters locally to the fetched rows. Receives effective filter values
   * (text filters use debounced value).
   */
  filterRows?: (rows: T[], filterValues: Record<string, string>) => T[];
  /** Card title for the table card */
  tableTitle?: string;
  /** Card description for the table card */
  tableDescription?: string;
  /** Filter card title. Default from common.filter */
  filterTitle?: string;
  /** Class name for the grid wrapper */
  className?: string;
  /**
   * localStorage key for column visibility. Defaults to swrKey.
   * Stored as `datagrid-columns-${columnVisibilityStorageKey ?? swrKey}`.
   */
  columnVisibilityStorageKey?: string;
}
