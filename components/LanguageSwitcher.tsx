'use client';

import { usePathname, useRouter } from 'next/navigation';
import { locales, type Locale } from '@/locales/i18n';
import { useCallback } from 'react';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import CountryFlag from './CountryFlag';

type Props = {
	currentLocale: Locale;
};

const localeData: Record<Locale, { name: string; flagCode: 'FR' | 'GB' }> = {
	fr: { name: 'Français', flagCode: 'FR' },
	en: { name: 'English', flagCode: 'GB' },
};

export default function LanguageSwitcher({ currentLocale }: Props) {
	const pathname = usePathname();
	const router = useRouter();

	const switchLocale = useCallback(
		(newLocale: Locale) => {
			if (newLocale === currentLocale) return;

			// Set cookie for locale preference
			document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=31536000`;

			// Get the path without the current locale prefix
			const pathWithoutLocale = pathname.replace(`/${currentLocale}`, '');

			// Redirect to the same path with the new locale
			router.push(`/${newLocale}${pathWithoutLocale || ''}`);
		},
		[currentLocale, pathname, router],
	);

	return (
		<Select value={currentLocale} onValueChange={switchLocale}>
			<SelectTrigger className="w-[140px]">
				<SelectValue placeholder="Select language" />
			</SelectTrigger>
			<SelectContent>
				{locales.map((locale) => (
					<SelectItem key={locale} value={locale}>
						<span className="flex items-center gap-2">
							<CountryFlag countryCode={localeData[locale].flagCode} />
							{localeData[locale].name}
						</span>
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
