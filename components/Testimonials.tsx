'use client';

import Image from 'next/image';

type TestimonialItem = {
  name: string;
  title: string;
  quote: string;
  avatar?: string | null;
  rating?: string | null;
};

type Dict = {
  testimonials?: { title: string; subtitle: string };
};

const defaultTestimonials: TestimonialItem[] = [
  {
    name: 'Alex wonderson',
    title: 'Founder of Lyconf',
    quote:
      'As a small business owner, I was doing everything and my workload was increasing. With this startup, I was able to save time so I could focus on the things that matter most: my clients and my family.',
    avatar:
      'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&q=80',
  },
  {
    name: 'Karim ahmed',
    title: 'DevOps engineer',
    quote:
      "My company's software now is easy to use, saves time and money, and is loved by a lot of users.",
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
  },
  {
    name: 'Lysa stian',
    title: 'System manager',
    quote:
      'My business was in a dire situation. Then I found this Startup and everything changed.',
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80',
  },
];

const SectionWrapper = ({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) => <section className={`py-16 ${className}`}>{children}</section>;

export default function Testimonials({
  dict,
  items,
}: {
  dict?: Dict;
  items?: TestimonialItem[];
}) {
  const testimonials = items && items.length > 0 ? items : defaultTestimonials;
  const title =
    dict?.testimonials?.title ?? 'See what others are saying about us';
  const subtitle =
    dict?.testimonials?.subtitle ??
    'Listen to what our users are saying about us.';

  return (
    <SectionWrapper className="pb-0">
      <div id="testimonials" className="max-w-screen-xl mx-auto px-4 md:px-8">
        <div className="max-w-2xl sm:text-center md:mx-auto">
          <h2 className="text-gray-800 text-3xl font-semibold sm:text-4xl dark:text-gray-100">
            {title}
          </h2>
          <p className="mt-3 text-gray-600 dark:text-gray-400">{subtitle}</p>
        </div>
        <div className="mt-12">
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials
              .filter((item) => item.quote)
              .map((item, idx) => (
                <li
                  key={idx}
                  className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 p-4 rounded-xl"
                >
                  <figure>
                    <div className="flex items-center gap-x-4">
                      {item.avatar ? (
                        <Image
                          src={item.avatar}
                          width={56}
                          height={56}
                          className="w-14 h-14 rounded-full object-cover"
                          alt={item.name}
                          unoptimized
                        />
                      ) : (
                        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-myorange-100/20 text-myorange-100 font-semibold text-lg">
                          {item.name.charAt(0)}
                        </span>
                      )}
                      <div>
                        <span className="block text-gray-800 dark:text-gray-100 font-semibold">
                          {item.name}
                        </span>
                        {item.title && (
                          <span className="block text-gray-600 dark:text-gray-400 text-sm mt-0.5">
                            {item.title}
                          </span>
                        )}
                      </div>
                    </div>
                    <blockquote>
                      <p className="mt-6 text-gray-700 dark:text-gray-300">
                        {item.quote}
                      </p>
                    </blockquote>
                  </figure>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </SectionWrapper>
  );
}
