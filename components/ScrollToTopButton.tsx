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
      className={`fixed bottom-6 transition-all duration-300 ease-in-out right-6 bg-gradient-to-r from-myorange-100 to-red-500 text-white p-4 rounded-2xl shadow-2xl hover:shadow-myorange-100/25 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-myorange-100 focus:ring-opacity-50 backdrop-blur-sm border border-white/20 ${
        isVisible ? 'opacity-100' : 'opacity-0 translate-y-10'
      }`}
      aria-label="Scroll to top"
    >
      <ChevronUp size={20} />
    </button>
  );
};

export default ScrollToTopButton;