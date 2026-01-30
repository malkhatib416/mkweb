import '@/app/globals.css';

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This is a minimal layout - authentication is handled by route group layouts
  return children;
}
