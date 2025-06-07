import { Building2, Globe, Mail, Phone, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@radix-ui/react-dropdown-menu';

export const metadata = {
  title: 'AlertJo - Mentions Légales',
  description: 'Informations légales concernant le site AlertJo',
};

const MentionLegalPage = () => {
  const url = 'https://alertjo.fr/';

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Mentions Légales
          </h1>
          <p className="text-slate-600 text-lg">
            Informations légales concernant le site{' '}
            {url.replace('https://', '').replace('/', '')}
          </p>
        </div>

        <div className="space-y-8">
          {/* Main Information Card */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-2xl text-slate-800">
                <Building2 className="h-6 w-6 text-blue-600" />
                Informations Principales
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                      Dénomination
                    </span>
                    <p className="text-slate-900 font-medium">MK-Web</p>
                  </div>

                  <div>
                    <span className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                      Siège social
                    </span>
                    <p className="text-slate-900">
                      4 Mail des Petits Clos
                      <br />
                      28000 Chartres
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-blue-600" />
                    <div>
                      <span className="text-sm font-semibold text-slate-500 uppercase tracking-wide block">
                        Téléphone
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
                        Email
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
                    SIRET
                  </span>
                  <p className="text-slate-900 font-mono">93179152900015</p>
                </div>

                <div>
                  <span className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
                    TVA Intracommunautaire
                  </span>
                  <p className="text-slate-900 font-mono">FR81931791529</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hosting Information Card */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-2xl text-slate-800">
                <Globe className="h-6 w-6 text-green-600" />
                Hébergement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-slate-700 leading-relaxed">
                  Le site{' '}
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-blue-600 hover:text-blue-700 transition-colors underline decoration-2 underline-offset-2"
                  >
                    {url}
                  </a>{' '}
                  est hébergé par :
                </p>

                <div className="bg-slate-50 rounded-lg p-4 border-l-4 border-green-500">
                  <div className="space-y-2">
                    <p className="font-semibold text-slate-900">IONOS</p>
                    <p className="text-slate-700">
                      7 Place de la Gare
                      <br />
                      57200 Sarreguemines
                    </p>
                    <p className="text-slate-700">
                      Contact :{' '}
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
                Création & Développement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-50 rounded-lg p-4 border-l-4 border-purple-500">
                <p className="text-slate-900 font-semibold">
                  EI Mohamad AL-KHATIB
                </p>
                <p className="text-slate-600 text-sm mt-1">
                  Développeur web Fullstack et créateur du site{' '}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-slate-200">
          <p className="text-slate-500 text-sm">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </p>
        </div>
      </div>
    </main>
  );
};

export default MentionLegalPage;
