'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import type { Dictionary } from '@/locales/dictionaries';
import { IContactForm } from '@/types';
import { EMAIL } from '@/utils/consts';
import { sendMail } from '@/utils/send-mail';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, LoaderCircle } from 'lucide-react';
import { useReCaptcha } from 'next-recaptcha-v3';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

export type ContactSectionProps = {
  dict: Dictionary;
  id?: string;
};

const contactMail = async (formData: IContactForm, dict: Dictionary) => {
  try {
    await sendMail({
      email: EMAIL!,
      subject: formData.sujet,
      text: formData.message,
      recaptchaToken: formData.recaptchaToken,
      html: `
  <h1>${dict.contact.email.contactSubject}</h1>
  <ul>
    <li><strong>${dict.contact.email.fields.lastName}:</strong> ${formData.nom}</li>
    <li><strong>${dict.contact.email.fields.firstName}:</strong> ${formData.prenom}</li>
    <li><strong>${dict.contact.email.fields.email}:</strong> ${formData.email}</li>
    <li><strong>${dict.contact.email.fields.company}:</strong> ${formData.entreprise}</li>
    <li><strong>${dict.contact.email.fields.phone}:</strong> ${formData.telephone}</li>
  </ul>

  <h2>${dict.contact.form.subject}:</h2>
  <p>${formData.sujet}</p>

  <h2>${dict.contact.form.message}:</h2>
  <p>${formData.message}</p>
  `,
    });
  } catch (error) {
    throw new Error('Error sending contact mail');
  }
};

const confirmationMail = async (formData: IContactForm, dict: Dictionary) => {
  try {
    await sendMail({
      email: formData.email,
      subject: dict.contact.email.confirmationSubject,
      text: `${dict.contact.email.confirmationGreeting} ${formData.prenom},\n${dict.contact.email.confirmationMessage}\n\n${dict.contact.email.confirmationClosing}`,
      recaptchaToken: formData.recaptchaToken,
      html: `
    <h1>${dict.contact.email.confirmationGreeting} ${formData.prenom},</h1>
    <p>${dict.contact.email.confirmationMessage}</p>
    <p>${dict.contact.email.confirmationClosing}</p>
    <p>${dict.contact.email.confirmationTeam}</p>
    `,
    });
  } catch (error) {
    console.error('Error sending confirmation email: ', error);
  }
};

export default function ContactSection({
  dict,
  id = 'contact',
}: ContactSectionProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { executeRecaptcha } = useReCaptcha();

  const formSchema = z.object({
    nom: z.string().min(1),
    prenom: z.string().min(1),
    email: z.string().email(),
    entreprise: z.string(),
    telephone: z.string(),
    sujet: z.string().min(1),
    message: z.string().min(1),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nom: '',
      prenom: '',
      email: '',
      entreprise: '',
      telephone: '',
      sujet: '',
      message: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const tokenContactMail = await executeRecaptcha('contact_mail');
      const tokenConfirmationMail = await executeRecaptcha('confirmation_mail');

      setIsSubmitting(true);
      await contactMail({ ...values, recaptchaToken: tokenContactMail }, dict);
      await confirmationMail(
        {
          ...values,
          recaptchaToken: tokenConfirmationMail,
        },
        dict,
      );
      toast({
        title: dict.contact.toast.successTitle,
        description: dict.contact.toast.successDescription,
      });
      form.reset();
    } catch (error) {
      console.error('Error sending email: ', error);
      toast({
        title: dict.contact.toast.errorTitle,
        description: dict.contact.toast.errorDescription,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id={id} className="bg-white dark:bg-slate-950">
      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-12 space-y-4 text-center">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            {dict.contact.title}
          </h2>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-gray-600 dark:text-gray-400">
            {dict.contact.subtitle}
          </p>
        </div>

        <Form {...form}>
          <form
            className="rounded-2xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-8 shadow-sm"
            onSubmit={form.handleSubmit(onSubmit)}
            noValidate
          >
            <div className="space-y-8">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <FormField
                  name="prenom"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{dict.contact.form.firstName}</FormLabel>
                      <FormControl>
                        <Input
                          id="prenom"
                          autoComplete="given-name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="nom"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{dict.contact.form.lastName}</FormLabel>
                      <FormControl>
                        <Input id="nom" autoComplete="family-name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="email"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{dict.contact.form.email}</FormLabel>
                      <FormControl>
                        <Input
                          id="email"
                          type="email"
                          autoComplete="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="telephone"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{dict.contact.form.phone}</FormLabel>
                      <FormControl>
                        <Input
                          id="telephone"
                          type="tel"
                          autoComplete="tel"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="entreprise"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>{dict.contact.form.company}</FormLabel>
                      <FormControl>
                        <Input
                          id="entreprise"
                          autoComplete="organization"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="sujet"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>{dict.contact.form.subject}</FormLabel>
                      <FormControl>
                        <Input id="sujet" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="message"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>{dict.contact.form.message}</FormLabel>
                      <FormControl>
                        <Textarea id="message" rows={6} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-myorange-100 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-myorange-100/30 transition hover:bg-myorange-200 disabled:cursor-not-allowed disabled:opacity-80"
              >
                {isSubmitting ? (
                  <>
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                    <span>{dict.contact.form.sending}</span>
                  </>
                ) : (
                  <>
                    <span>{dict.contact.form.send}</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </section>
  );
}
