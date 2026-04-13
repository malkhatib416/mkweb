import Image from 'next/image';

const MKWEbLogo = () => {
  return (
    <span className="flex items-center gap-3 shrink-0">
      <Image
        src="/logo.png"
        alt="MK-Web"
        width={80}
        height={80}
        priority
        className="h-5 w-auto object-contain object-left md:h-6 dark:hidden"
      />
      <Image
        src="/logo-white.png"
        alt="MK-Web"
        width={80}
        height={80}
        priority
        className="hidden h-5 w-auto object-contain object-left md:h-6 dark:block"
      />
    </span>
  );
};

export default MKWEbLogo;
