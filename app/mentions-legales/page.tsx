import { Building2, Globe, Mail, Phone, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@radix-ui/react-dropdown-menu';
import { getDictionary } from '@/locales/dictionaries';
import { getLocaleFromHeaders } from '@/lib/get-locale-from-headers';
import type { Locale } from '@/locales/i18n';
import type { Metadata } from 'next';
import { formatDate } from '@/utils/format-date';
import { APP_URL } from '@/utils/consts';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocaleFromHeaders();
  const dict = await getDictionary(locale);

  return {
    title: `MK-Web - ${dict.legal.title}`,
    description: dict.legal.description,
  };
}

const MentionLegalPage = async () => {
  const locale = await getLocaleFromHeaders();
  const dict = await getDictionary(locale);
  const url = APP_URL;

  return (
    <main className="mb-16 mt-20 dark:bg-slate-950">
      <div className="container mx-auto px-4 pt-16 pb-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
            {dict.legal.title}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            {dict.legal.description}{' '}
            {url.replace('https://', '').replace('/', '')}
          </p>
        </div>

        <div className="space-y-8">
          {/* Main Information Card */}
          <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-900/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-2xl text-slate-800 dark:text-slate-200">
                <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-500" />
                {dict.legal.mainInfo.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-semibold text-slate-500 dark:text-slate-500 uppercase tracking-wide">
                      {dict.legal.mainInfo.denomination}
                    </span>
                    <p className="text-slate-900 dark:text-slate-300 font-medium">
                      {dict.legal.mainInfo.denominationValue}
                    </p>
                  </div>

                  <div>
                    <span className="text-sm font-semibold text-slate-500 dark:text-slate-500 uppercase tracking-wide">
                      {dict.legal.mainInfo.headquarters}
                    </span>
                    <p className="text-slate-900 dark:text-slate-300">
                      {dict.legal.mainInfo.address}
                      <br />
                      {dict.legal.mainInfo.city}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-blue-600 dark:text-blue-500" />
                    <div>
                      <span className="text-sm font-semibold text-slate-500 dark:text-slate-500 uppercase tracking-wide block">
                        {dict.legal.mainInfo.phone}
                      </span>
                      <a
                        href="tel:+33646777804"
                        className="text-slate-900 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        +33 6 46 77 78 04
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-blue-600 dark:text-blue-500" />
                    <div>
                      <span className="text-sm font-semibold text-slate-500 dark:text-slate-500 uppercase tracking-wide block">
                        {dict.legal.mainInfo.email}
                      </span>
                      <a
                        href="mailto:contact@mk-web.fr"
                        className="text-slate-900 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        contact@mk-web.fr
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <span className="text-sm font-semibold text-slate-500 dark:text-slate-500 uppercase tracking-wide">
                    {dict.legal.mainInfo.siret}
                  </span>
                  <p className="text-slate-900 dark:text-slate-300 font-mono">
                    {dict.legal.mainInfo.siretValue}
                  </p>
                </div>

                <div>
                  <span className="text-sm font-semibold text-slate-500 dark:text-slate-500 uppercase tracking-wide">
                    {dict.legal.mainInfo.vat}
                  </span>
                  <p className="text-slate-900 dark:text-slate-300 font-mono">
                    {dict.legal.mainInfo.vatValue}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hosting Information Card */}
          <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-900/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-2xl text-slate-800 dark:text-slate-200">
                <Globe className="h-6 w-6 text-green-600 dark:text-green-500" />
                {dict.legal.hosting.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-slate-700 dark:text-slate-400 leading-relaxed">
                  {dict.legal.hosting.description.replace('{url}', '')}{' '}
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors underline decoration-2 underline-offset-2"
                  >
                    {url}
                  </a>
                </p>

                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border-l-4 border-green-500">
                  <div className="space-y-2">
                    <p className="font-semibold text-slate-900 dark:text-slate-200">
                      {dict.legal.hosting.provider}
                    </p>
                    <p className="text-slate-700 dark:text-slate-400">
                      {dict.legal.hosting.address}
                      <br />
                      {dict.legal.hosting.city}
                    </p>
                    <p className="text-slate-700 dark:text-slate-400">
                      {dict.legal.hosting.contact} :{' '}
                      <a
                        href="https://www.ionos.fr/contact"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors underline decoration-2 underline-offset-2"
                      >
                        https://www.ionos.fr/contact
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Creation Information Card */}
          <Card className="shadow-lg border-0 bg-white/80 dark:bg-slate-900/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-2xl text-slate-800 dark:text-slate-200">
                <Building2 className="h-6 w-6 text-purple-600 dark:text-purple-500" />
                {dict.legal.creation.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 border-l-4 border-purple-500">
                <p className="text-slate-900 dark:text-slate-200 font-semibold">
                  {dict.legal.creation.company}
                </p>
                <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                  {dict.legal.creation.role}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
          <p className="text-slate-500 dark:text-slate-500 text-sm">
            {dict.legal.lastUpdate} {formatDate(new Date(), locale as Locale)}
          </p>
        </div>
      </div>
    </main>
  );
};

export default MentionLegalPage;
