import { cn } from '@/utils/utils';

type FAQItem = {
  question: string;
  answer: string;
};

type FAQContent = {
  badge?: string;
  title: string;
  subtitle?: string;
  items: FAQItem[];
};

type FAQProps = {
  faq: FAQContent;
  id?: string;
  className?: string;
};

const FAQ = ({ faq, id = 'faq', className }: FAQProps) => {
  if (!faq?.items?.length) {
    return null;
  }

  return (
    <section
      id={id}
      className={cn(
        'bg-gray-50 dark:bg-slate-900 py-20 transition-colors duration-200',
        className,
      )}
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-myorange-100">
            {faq.badge}
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900 dark:text-white md:text-4xl">
            {faq.title}
          </h2>
          {faq.subtitle ? (
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
              {faq.subtitle}
            </p>
          ) : null}
        </div>

        <div className="space-y-4">
          {faq.items.map((item) => (
            <details
              key={item.question}
              className="group rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 shadow-sm transition-shadow hover:shadow-md dark:shadow-none"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-lg font-medium text-gray-900 dark:text-white focus:outline-none">
                <span>{item.question}</span>
                <span className="text-myorange-100 transition-transform group-open:-rotate-45">
                  +
                </span>
              </summary>
              <div className="mt-3 text-base leading-relaxed text-gray-600 dark:text-gray-400">
                {item.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
