import { Button } from '@/components/ui/button';
import {
  getServicePageLabels,
  type ServicePageContent,
} from '@/locales/service-pages';
import type { Locale } from '@/locales/i18n';
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Code2,
  Cpu,
  Gauge,
  MapPin,
  PanelsTopLeft,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

type Props = {
  content: ServicePageContent;
  locale: Locale;
};

export default function ServicePageTemplate({ content, locale }: Props) {
  const faqItems = [...content.faqMain, ...content.faqAdvanced];
  const labels = getServicePageLabels(locale);

  return (
    <main className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white">
      <section className="relative overflow-hidden border-b border-slate-200/70 bg-[radial-gradient(circle_at_top_left,_rgba(255,74,23,0.16),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(15,23,42,0.08),_transparent_28%),linear-gradient(180deg,#fff,#f8fafc)] dark:border-slate-800/70 dark:bg-[radial-gradient(circle_at_top_left,_rgba(255,74,23,0.18),_transparent_26%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.05),_transparent_22%),linear-gradient(180deg,#020617,#020617)]">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(15,23,42,0.03)_1px,transparent_1px)] bg-[size:42px_42px] dark:bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)]" />
        <div className="mx-auto grid max-w-7xl gap-10 px-6 pb-18 pt-36 lg:grid-cols-[minmax(0,1.2fr)_420px] lg:px-8 lg:pb-24 lg:pt-44">
          <div className="relative z-10 max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200/70 bg-white/85 px-4 py-2 text-[11px] font-mono uppercase tracking-[0.22em] text-slate-500 shadow-sm dark:border-slate-800 dark:bg-slate-900/85 dark:text-slate-400">
              <Sparkles className="h-3.5 w-3.5 text-myorange-100" />
              {labels.heroBadge}
            </div>
            <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 dark:text-white md:text-6xl">
              {content.heroTitle}
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              {content.heroSubtitle}
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Button
                asChild
                className="h-12 rounded-full bg-slate-950 px-6 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
              >
                <Link href={`/${locale}/#contact`}>
                  {content.primaryCta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="h-12 rounded-full border-slate-300 px-6 dark:border-slate-700 dark:bg-transparent"
              >
                <Link href={`/${locale}/estimation`}>
                  {content.secondaryCta}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap gap-3">
              {labels.heroHighlights.map((highlight) => (
                <span
                  key={highlight}
                  className="rounded-full border border-slate-200/80 bg-white/80 px-4 py-2 text-sm text-slate-700 shadow-sm dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300"
                >
                  {highlight}
                </span>
              ))}
            </div>
          </div>

          <div className="relative z-10 flex flex-col gap-5 self-end">
            <div className="rounded-[2rem] border border-slate-200/70 bg-white/90 p-8 shadow-[0_20px_70px_-30px_rgba(15,23,42,0.35)] dark:border-slate-800 dark:bg-slate-900/90">
              <div className="mb-5 flex items-center gap-3">
                <MapPin className="h-5 w-5 text-myorange-100" />
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {labels.territoryLabel}
                </p>
              </div>
              <p className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
                {labels.territoryValue}
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                {content.heroSubtitle}
              </p>
            </div>

            <div className="rounded-[2rem] border border-slate-200/70 bg-slate-950 p-8 text-white shadow-[0_25px_80px_-35px_rgba(255,74,23,0.55)] dark:border-slate-700 dark:bg-slate-900">
              <div className="mb-5 flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-myorange-100" />
                <p className="text-sm font-medium text-slate-300">
                  {labels.proofLabel}
                </p>
              </div>
              <ul className="space-y-4 text-sm leading-7 text-slate-200">
                {content.proofItems.map((item) => (
                  <li key={item} className="flex gap-3">
                    <CheckCircle2 className="mt-1 h-4.5 w-4.5 shrink-0 text-myorange-100" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-[1.75rem] border border-slate-200/70 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900/50">
            <Gauge className="h-5 w-5 text-myorange-100" />
            <p className="mt-4 text-lg font-semibold">{labels.valueCards[0]}</p>
            <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
              {content.techItems[0]}
            </p>
          </div>
          <div className="rounded-[1.75rem] border border-slate-200/70 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900/50">
            <PanelsTopLeft className="h-5 w-5 text-myorange-100" />
            <p className="mt-4 text-lg font-semibold">{labels.valueCards[1]}</p>
            <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
              {content.techItems[1]}
            </p>
          </div>
          <div className="rounded-[1.75rem] border border-slate-200/70 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900/50">
            <Code2 className="h-5 w-5 text-myorange-100" />
            <p className="mt-4 text-lg font-semibold">{labels.valueCards[2]}</p>
            <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
              {content.solutionText[0]}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-[2rem] border border-slate-200/70 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
            <p className="mb-4 text-[11px] font-mono uppercase tracking-[0.22em] text-myorange-100">
              {labels.problemSection}
            </p>
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              {content.problemTitle}
            </h2>
            <div className="mt-8 grid gap-4">
              {content.problemItems.map((item) => (
                <div
                  key={item}
                  className="rounded-[1.5rem] border border-slate-200/70 bg-slate-50 p-5 text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[2rem] border border-slate-200/70 bg-slate-50 p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900/40">
            <p className="mb-4 text-[11px] font-mono uppercase tracking-[0.22em] text-myorange-100">
              {labels.solutionSection}
            </p>
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              {content.solutionTitle}
            </h2>
            <div className="mt-6 space-y-5 text-base leading-8 text-slate-600 dark:text-slate-300">
              {content.solutionText.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200/70 bg-slate-50 py-20 dark:border-slate-800/70 dark:bg-slate-900/40">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <p className="mb-4 text-[11px] font-mono uppercase tracking-[0.22em] text-myorange-100">
                {labels.expertiseSection}
              </p>
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                {content.techTitle}
              </h2>
              <ul className="mt-8 space-y-4">
                {content.techItems.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-slate-600 dark:text-slate-300"
                  >
                    <Cpu className="mt-0.5 h-5 w-5 shrink-0 text-myorange-100" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid gap-6">
              <div className="rounded-[2rem] border border-slate-200/70 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                <p className="mb-4 text-[11px] font-mono uppercase tracking-[0.22em] text-myorange-100">
                  {labels.whyChooseLabel}
                </p>
                <h3 className="text-xl font-semibold">
                  {content.whyChooseTitle}
                </h3>
                <ul className="mt-5 space-y-4">
                  {content.whyChooseItems.map((item) => (
                    <li
                      key={item}
                      className="flex gap-3 text-slate-600 dark:text-slate-300"
                    >
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-myorange-100" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-[2rem] border border-slate-200/70 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                <p className="mb-4 text-[11px] font-mono uppercase tracking-[0.22em] text-myorange-100">
                  {labels.technologiesLabel}
                </p>
                <h3 className="text-xl font-semibold">
                  {content.technologiesTitle}
                </h3>
                <div className="mt-5 flex flex-wrap gap-3">
                  {content.technologies.map((technology) => (
                    <span
                      key={technology}
                      className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
                    >
                      {technology}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200/70 bg-slate-50 py-20 dark:border-slate-800/70 dark:bg-slate-900/40">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <p className="mb-4 text-[11px] font-mono uppercase tracking-[0.22em] text-myorange-100">
            {labels.processSection}
          </p>
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
            {content.processTitle}
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {content.processSteps.map((step, index) => (
              <div
                key={step.title}
                className="rounded-[2rem] border border-slate-200/70 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-950"
              >
                <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-full bg-myorange-100/10 text-sm font-semibold text-myorange-100">
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="mt-4 text-slate-600 dark:text-slate-300">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        <div className="max-w-4xl">
          <p className="mb-4 text-[11px] font-mono uppercase tracking-[0.22em] text-myorange-100">
            {labels.faqSection}
          </p>
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
            {content.faqTitle}
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-300">
            {content.faqIntro}
          </p>
        </div>
        <div className="mt-10 grid gap-4">
          {faqItems.map((item) => (
            <details
              key={item.question}
              className="group rounded-[1.75rem] border border-slate-200/70 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-900/50"
            >
              <summary className="cursor-pointer list-none text-lg font-medium text-slate-900 dark:text-white">
                {item.question}
              </summary>
              <p className="mt-4 max-w-4xl leading-7 text-slate-600 dark:text-slate-300">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="rounded-[2.5rem] border border-slate-200/70 bg-[radial-gradient(circle_at_top_left,_rgba(255,74,23,0.18),_transparent_30%),linear-gradient(135deg,#020617,#111827)] px-8 py-12 text-white dark:border-slate-800 dark:bg-[radial-gradient(circle_at_top_left,_rgba(255,74,23,0.18),_transparent_26%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.06),_transparent_24%),linear-gradient(135deg,#020617,#0f172a)] dark:text-white md:px-12 md:py-16">
            <div className="max-w-4xl">
              <p className="mb-4 text-[11px] font-mono uppercase tracking-[0.22em] text-myorange-100">
                {labels.ctaSection}
              </p>
              <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
                {content.finalCtaTitle}
              </h2>
              <p className="mt-5 text-base leading-8 text-slate-300 dark:text-slate-300">
                {content.finalCtaText}
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Button
                  asChild
                  className="h-12 rounded-full bg-myorange-100 px-6 text-white hover:bg-myorange-200"
                >
                  <Link href={`/${locale}/#contact`}>{content.primaryCta}</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-12 rounded-full border-white/20 bg-transparent px-6 text-white hover:bg-white/10 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
                >
                  <Link href={`/${locale}/estimation`}>
                    {content.secondaryCta}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
