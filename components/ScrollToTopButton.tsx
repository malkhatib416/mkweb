'use client';

import { ChevronUp } from 'lucide-react';
import { useEffect, useState } from 'react';

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-4 right-4 z-30 min-w-12 min-h-12 inline-flex items-center justify-center transition-all duration-300 ease-in-out bg-myorange-100 text-white p-2 rounded-full shadow-lg shadow-myorange-100/30 hover:bg-myorange-200 focus:outline-none focus:ring-2 focus:ring-myorange-100 focus:ring-offset-2 dark:focus:ring-offset-slate-950 dark:shadow-xl dark:shadow-black/40 ${
        isVisible
          ? 'opacity-100'
          : 'opacity-0 translate-y-10 pointer-events-none'
      }`}
      aria-label="Scroll to top"
    >
      <ChevronUp size={20} />
    </button>
  );
};

export default ScrollToTopButton;
