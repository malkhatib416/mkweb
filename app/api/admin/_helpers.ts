import { requireAuth } from "@/lib/auth-utils";
import { getErrorMessage, getErrorStatus } from "@/lib/utils/api-error-handler";
import { localeEnum } from "@/lib/validations/entities";
import type { Locale } from "@/locales/i18n";
import type { Status } from "@/types/entities";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

type PaginationDefaults = {
  page?: number;
  limit?: number;
  maxLimit?: number;
};

const DEFAULT_PAGINATION: Required<PaginationDefaults> = {
  page: 1,
  limit: 10,
  maxLimit: 100,
};

function buildPaginationSchema(defaults?: PaginationDefaults) {
  const resolved = { ...DEFAULT_PAGINATION, ...defaults };

  return z.object({
    page: z.coerce.number().int().positive().default(resolved.page),
    limit: z.coerce
      .number()
      .int()
      .positive()
      .max(resolved.maxLimit)
      .default(resolved.limit),
  });
}

export function parsePaginationQuery(
  request: NextRequest,
  defaults?: PaginationDefaults
) {
  const searchParams = request.nextUrl.searchParams;
  const query = buildPaginationSchema(defaults).parse({
    page: searchParams.get("page") ?? undefined,
    limit: searchParams.get("limit") ?? undefined,
  });

  return {
    page: query.page,
    limit: query.limit,
  };
}

export function parseStatusLocalePaginationQuery(
  request: NextRequest,
  defaults?: PaginationDefaults
) {
  const searchParams = request.nextUrl.searchParams;
  const pagination = parsePaginationQuery(request, defaults);

  const query = z
    .object({
      status: z.enum(["draft", "published"]).optional(),
      locale: localeEnum.optional(),
    })
    .parse({
      status: searchParams.get("status") ?? undefined,
      locale: searchParams.get("locale") ?? undefined,
    });

  return {
    ...pagination,
    status: query.status as Status | undefined,
    locale: query.locale as Locale | undefined,
  };
}

export function getOptionalLocale(request: NextRequest): Locale | undefined {
  const locale = request.nextUrl.searchParams.get("locale");
  const parsed = localeEnum.safeParse(locale);
  return parsed.success ? parsed.data : undefined;
}

export function handleAdminApiError(error: unknown, defaultMessage: string) {
  if (error instanceof z.ZodError) {
    return NextResponse.json({ error: error.issues }, { status: 400 });
  }

  return NextResponse.json(
    { error: getErrorMessage(error, defaultMessage) },
    { status: getErrorStatus(error) }
  );
}

export function withAuthenticatedAdminRoute<Args extends unknown[]>(
  // eslint-disable-next-line no-unused-vars
  handler: (...args: [NextRequest, ...Args]) => Promise<NextResponse>,
  defaultMessage: string
) {
  return async (request: NextRequest, ...args: Args) => {
    try {
      await requireAuth();
      return await handler(request, ...args);
    } catch (error) {
      console.error(defaultMessage, error);
      return handleAdminApiError(error, defaultMessage);
    }
  };
}
