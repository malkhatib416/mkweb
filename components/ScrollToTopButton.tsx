'use client';

import { ChevronUp } from 'lucide-react';
import { useState, useEffect } from 'react';

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
      className={`fixed bottom-4 transition-all duration-300 ease-in-out right-4 bg-myorange-100 text-white p-2 rounded-full shadow-lg hover:bg-myorange-100/80 focus:outline-none focus:ring-2 focus:ring-myorange-100 focus:ring-opacity-50 ${
        isVisible ? 'opacity-100' : 'opacity-0 translate-y-10'
      }`}
      aria-label="Scroll to top"
    >
      <ChevronUp size={16} />
    </button>
  );
};

export default ScrollToTopButton;