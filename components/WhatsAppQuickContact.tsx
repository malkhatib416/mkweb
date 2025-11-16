'use client';

import React, { useCallback, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PHONE } from '@/utils/consts';
import { MessageCircle, X } from 'lucide-react';
import type { Dictionary } from '@/locales/dictionaries';

type Props = {
  dict: Dictionary;
};

export default function WhatsAppQuickContact({ dict }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const handleSend = useCallback(() => {
    const normalizedPhone = (PHONE || '').replace(/[^+\d]/g, '');
    const encodedMessage = encodeURIComponent(message.trim());
    const base = 'https://wa.me/';
    const url = encodedMessage
      ? `${base}${normalizedPhone}?text=${encodedMessage}`
      : `${base}${normalizedPhone}`;
    window.open(url, '_blank');
  }, [message]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  const normalizedPhone = useMemo(
    () => (PHONE || '').replace(/[^+\d]/g, ''),
    [],
  );

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="w-96 max-w-[calc(100vw-3rem)] rounded-xl shadow-2xl bg-card overflow-hidden"
        >
          <div className="bg-green-500 px-4 py-3 flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-md bg-white/10">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div className="text-sm">
                <div className="font-semibold">{dict.whatsapp.title}</div>
                <div className="text-white/80">{dict.whatsapp.subtitle}</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
              }}
              className="p-1 rounded hover:bg-white/10 transition-colors"
              aria-label={dict.whatsapp.close}
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          <div className="px-4 py-4 space-y-2 max-h-72 overflow-auto">
            <div className="text-xs text-muted-foreground">
              {dict.whatsapp.willWriteTo} {normalizedPhone}{' '}
              {dict.whatsapp.onWhatsApp}
            </div>
            <motion.div
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 }}
              className="bg-muted text-foreground rounded-md p-3 text-sm max-w-[85%]"
            >
              {dict.whatsapp.greeting}
            </motion.div>
          </div>

          <div className="p-3 border-t border-border flex items-center gap-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={dict.whatsapp.placeholder}
              className="flex-1 bg-background h-11"
            />
            <Button
              onClick={handleSend}
              className="shrink-0 h-11 bg-green-500 hover:bg-green-600 text-white"
              aria-label={dict.whatsapp.send}
            >
              {dict.whatsapp.send}
            </Button>
          </div>
        </motion.div>
      )}
      <motion.button
        type="button"
        onClick={() => setIsOpen(true)}
        className="rounded-full h-14 w-14 p-0 shadow-2xl bg-green-500 text-white flex items-center justify-center"
        aria-label={dict.whatsapp.open}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.98 }}
        initial={false}
        animate={{
          opacity: isOpen ? 0 : 1,
          scale: isOpen ? 0.9 : 1,
          y: isOpen ? 8 : 0,
        }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        style={{ pointerEvents: isOpen ? 'none' : 'auto' }}
      >
        <MessageCircle className="w-6 h-6" />
      </motion.button>
    </div>
  );
}
