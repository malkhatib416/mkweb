import { Building2, Globe, Mail, Phone, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@radix-ui/react-dropdown-menu';
import { getDictionary } from '@/locales/dictionaries';
import type { Locale } from '@/locales/i18n';
import type { Metadata } from 'next';
import { APP_URL } from '@/utils/consts';

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);

  return {
    title: `MK-Web - ${dict.legal.title}`,
    description: dict.legal.description,
  };
}

const MentionLegalPage = async ({ params }: Props) => {
  const { locale } = await params;
  const dict = await getDictionary(locale as Locale);
  const url = APP_URL;

  return (
    <main className="mb-16 mt-20">
      <div className="container mx-auto px-4 pt-16 pb-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            {dict.legal.title}
          </h1>
          <p className="text-slate-600 text-lg">
            {dict.legal.description}{' '}
            {url.replace('https://', '').replace('/', '')}
          </p>
        </div>

        <div className="space-y-8">
          {/* Main Information Card */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-2xl text-slate-800">
                <Building2 className="h-6 w-6 text-blue-600" />
                {dict.legal.mainInfo.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                      {dict.legal.mainInfo.denomination}
                    </span>
                    <p className="text-slate-900 font-medium">
                      {dict.legal.mainInfo.denominationValue}
                    </p>
                  </div>

                  <div>
                    <span className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                      {dict.legal.mainInfo.headquarters}
                    </span>
                    <p className="text-slate-900">
                      {dict.legal.mainInfo.address}
                      <br />
                      {dict.legal.mainInfo.city}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-blue-600" />
                    <div>
                      <span className="text-sm font-semibold text-slate-500 uppercase tracking-wide block">
                        {dict.legal.mainInfo.phone}
                      </span>
                      <a
                        href="tel:+33646777804"
                        className="text-slate-900 hover:text-blue-600 transition-colors"
                      >
                        +33 6 46 77 78 04
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-blue-600" />
                    <div>
                      <span className="text-sm font-semibold text-slate-500 uppercase tracking-wide block">
                        {dict.legal.mainInfo.email}
                      </span>
                      <a
                        href="mailto:contact@mk-web.fr"
                        className="text-slate-900 hover:text-blue-600 transition-colors"
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
                  <span className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                    {dict.legal.mainInfo.siret}
                  </span>
                  <p className="text-slate-900 font-mono">
                    {dict.legal.mainInfo.siretValue}
                  </p>
                </div>

                <div>
                  <span className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                    {dict.legal.mainInfo.vat}
                  </span>
                  <p className="text-slate-900 font-mono">
                    {dict.legal.mainInfo.vatValue}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hosting Information Card */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-2xl text-slate-800">
                <Globe className="h-6 w-6 text-green-600" />
                {dict.legal.hosting.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-slate-700 leading-relaxed">
                  {dict.legal.hosting.description.replace('{url}', '')}{' '}
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-blue-600 hover:text-blue-700 transition-colors underline decoration-2 underline-offset-2"
                  >
                    {url}
                  </a>
                </p>

                <div className="bg-slate-50 rounded-lg p-4 border-l-4 border-green-500">
                  <div className="space-y-2">
                    <p className="font-semibold text-slate-900">
                      {dict.legal.hosting.provider}
                    </p>
                    <p className="text-slate-700">
                      {dict.legal.hosting.address}
                      <br />
                      {dict.legal.hosting.city}
                    </p>
                    <p className="text-slate-700">
                      {dict.legal.hosting.contact} :{' '}
                      <a
                        href="https://www.ionos.fr/contact"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 transition-colors underline decoration-2 underline-offset-2"
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
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-2xl text-slate-800">
                <User className="h-6 w-6 text-purple-600" />
                {dict.legal.creation.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-50 rounded-lg p-4 border-l-4 border-purple-500">
                <p className="text-slate-900 font-semibold">
                  {dict.legal.creation.company}
                </p>
                <p className="text-slate-600 text-sm mt-1">
                  {dict.legal.creation.role}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-slate-200">
          <p className="text-slate-500 text-sm">
            {dict.legal.lastUpdate}{' '}
            {new Date().toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US')}
          </p>
        </div>
      </div>
    </main>
  );
};

export default MentionLegalPage;
