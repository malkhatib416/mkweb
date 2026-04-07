'use client';

import { useAdminDictionary } from '@/components/admin/AdminDictionaryProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signIn } from '@/lib/auth-client';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

export default function LoginForm() {
  const dict = useAdminDictionary();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const t = dict.admin.auth.login;
  const authT = dict.admin.auth;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signIn.email({
        email,
        password,
      });

      if (result.error) {
        toast.error(result.error.message || t.loginFailed);
        return;
      }

      toast.success(t.loginSuccess);
      router.push('/admin/dashboard');
      router.refresh();
    } catch (error) {
      toast.error(t.loginFailed);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            {t.title}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <Label htmlFor="email-address">{t.email}</Label>
              <Input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-border placeholder-muted-foreground/60 text-foreground rounded-t-lg focus:outline-none focus:ring-1 focus:ring-foreground focus:border-foreground focus:z-10 sm:text-sm bg-background"
                placeholder={t.email}
              />
            </div>
            <div>
              <Label htmlFor="password">{t.password}</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none rounded-none relative block w-full rounded-b-lg border border-border bg-background px-3 py-2 pr-12 text-foreground placeholder-muted-foreground/60 focus:z-10 focus:border-foreground focus:outline-none focus:ring-1 focus:ring-foreground sm:text-sm"
                  placeholder={t.password}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute inset-y-0 right-1 my-1 h-8 w-8 text-muted-foreground hover:bg-transparent hover:text-foreground"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={
                    showPassword ? authT.hidePassword : authT.showPassword
                  }
                  title={showPassword ? authT.hidePassword : authT.showPassword}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          <div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-foreground text-background hover:bg-foreground/90 transition-all font-semibold py-2"
            >
              {isLoading ? t.signingIn : t.signIn}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
