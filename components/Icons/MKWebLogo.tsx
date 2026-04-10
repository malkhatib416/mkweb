'use client';

import { useTheme } from 'next-themes';
import Image from 'next/image';

const MKWEbLogo = () => {
  const { resolvedTheme } = useTheme();

  // Dark mode: white logo. Light mode: colored logo (logo.png).
  const isDark = resolvedTheme === 'dark';
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
