import Image from 'next/image';
import Link from 'next/link';

const MKWEbLogo = () => {
  return (
    <Link href="/" className="flex items-center gap-3">
      <Image src="/logo.png" alt="logo" width={120} height={120} />
    </Link>
  );
};

export default MKWEbLogo;
