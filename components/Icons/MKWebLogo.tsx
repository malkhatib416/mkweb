'use client';

import { useTheme } from 'next-themes';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const MKWEbLogo = () => {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Dark mode: white logo. Light mode: colored logo (logo.png).
  const isDark = mounted && resolvedTheme === 'dark';
  const imgPath = isDark ? '/logo-white.png' : '/logo.png';

  return (
    <span className="flex items-center gap-3 shrink-0">
      <Image
        src={imgPath}
        alt="MK-Web"
        width={80}
        height={80}
        priority
        className="h-5 w-auto md:h-6 object-contain object-left"
      />
    </span>
  );
};

export default MKWEbLogo;
