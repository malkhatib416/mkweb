'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { IContactForm } from '@/types';
import { ADDRESS, EMAIL, PHONE } from '@/utils/contactInfo';
import { sendMail } from '@/utils/send-mail';
import { Mail, Phone, Building, LoaderCircle, Clock, Shield, CheckCircle } from 'lucide-react';
import React, { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormField } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { useReCaptcha } from 'next-recaptcha-v3';

const contactMail = async (formData: IContactForm) => {
  try {
    await sendMail({
      email: EMAIL!,
      subject: 'Nouveau message de contact - ' + formData.nom,
      text: formData.message,
      recaptchaToken: formData.recaptchaToken,
      html: `
  <h1>Nouveau message de contact</h1>
  <ul>
    <li><strong>Nom:</strong> ${formData.nom}</li>
    <li><strong>Email:</strong> ${formData.email}</li>
  </ul>

  <h2>Message:</h2>
  <p>${formData.message}</p>
  `,
    });
  } catch (error) {
    throw new Error('Error sending contact mail');
  }
};

const confirmationMail = async (formData: IContactForm) => {
  try {
    await sendMail({
      email: formData.email,
      subject: 'Confirmation de réception',
      text: `Bonjour ${formData.nom},\nNous avons bien reçu votre message et nous vous répondrons dans les plus brefs délais.\n\nCordialement,`,
      recaptchaToken: formData.recaptchaToken,
      html: `
    <h1>Bonjour ${formData.nom},</h1>
    <p>Nous avons bien reçu votre message et nous vous répondrons dans les plus brefs délais.</p>
    <p>Cordialement,</p>
    <p>L'équipe de MK-Web</p>
    `,
    });
  } catch (error) {
    console.error('Error sending confirmation email: ', error);
  }
};

export default function NousContacterPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { executeRecaptcha } = useReCaptcha();

  const formSchema = z.object({
    nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
    email: z.string().email('Adresse email invalide'),
    message: z.string().min(10, 'Le message doit contenir au moins 10 caractères'),
    rgpd: z.boolean().refine(val => val === true, 'Vous devez accepter les conditions'),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nom: '',
      email: '',
      message: '',
      rgpd: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const tokenContactMail = await executeRecaptcha('contact_mail');
      const tokenConfirmationMail = await executeRecaptcha('confirmation_mail');

      setIsSubmitting(true);
      await contactMail({ ...values, recaptchaToken: tokenContactMail });
      await confirmationMail({
        ...values,
        recaptchaToken: tokenConfirmationMail,
      });
      toast({
        title: 'Message envoyé !',
        description:
          'Nous avons bien reçu votre message et nous vous répondrons sous 24h.',
      });
      form.reset();
    } catch (error) {
      console.error('Error sending email: ', error);
      toast({
        title: 'Erreur',
        description:
          "Une erreur est survenue lors de l'envoi de votre message. Veuillez réessayer plus tard.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="h-[120vh] md:h-[100vh] flex justify-center items-center mt-16">
      <div className="max-w-7xl  px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-8 ">
            <div>
              <h1 className="text-4xl font-bold mb-4 text-myorange-200">
                Discutons de votre projet
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                Génération de leads, rapidité, sécurité, maintenance proactive. 
                Obtenez des résultats mesurables dès le premier mois.
              </p>
              
              {/* SLA Section */}
              <div className="bg-gradient-to-r from-myorange-100/10 to-red-500/10 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Nos engagements</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-myorange-100" />
                    <span className="text-sm font-medium">Réponse < 24h</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-medium">Kickoff en 7 jours</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-blue-500" />
                    <span className="text-sm font-medium">Maintenance 24/7</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center">
                <Mail className="text-gray-600 mr-3" />
                <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
              </div>
              <div className="flex items-center">
                <Phone className="text-gray-600 mr-3" />
                <a href={`tel:${PHONE}`}>{PHONE}</a>
              </div>
              <div className="flex items-center">
                <Building className="text-gray-600 mr-3" />
                <span>{ADDRESS}</span>
              </div>
            </div>
          </div>

          <Form {...form}>
            <form className="w-full" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="space-y-4 mb-6">
                <FormField
                  name="nom"
                  control={form.control}
                  render={({ field }) => (
                    <Input
                      className="w-full"
                      id="nom"
                      placeholder="Votre nom"
                      {...field}
                    />
                  )}
                />

                <FormField
                  name="email"
                  control={form.control}
                  render={({ field }) => (
                    <Input
                      id="email"
                      type="email"
                      placeholder="Votre email"
                      {...field}
                    />
                  )}
                />

                <FormField
                  name="message"
                  control={form.control}
                  render={({ field }) => (
                    <Textarea
                      id="message"
                      placeholder="Décrivez votre projet en quelques mots..."
                      className="w-full"
                      rows={5}
                      {...field}
                    />
                  )}
                />
              </div>

              {/* RGPD Checkbox */}
              <div className="mb-6">
                <FormField
                  name="rgpd"
                  control={form.control}
                  render={({ field }) => (
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        id="rgpd"
                        checked={field.value}
                        onChange={field.onChange}
                        className="mt-1 w-4 h-4 text-myorange-100 border-gray-300 rounded focus:ring-myorange-100"
                      />
                      <label htmlFor="rgpd" className="text-sm text-gray-600">
                        J'accepte que mes données soient utilisées pour répondre à ma demande. 
                        <a href="/mentions-legales" className="text-myorange-100 hover:underline ml-1">
                          Voir les conditions
                        </a>
                      </label>
                    </div>
                  )}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-myorange-100 hover:bg-myorange-100/90 text-white font-semibold py-3"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <LoaderCircle className="animate-spin mr-2" />
                ) : null}
                {isSubmitting ? 'Envoi en cours...' : 'Discutons de votre projet'}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </main>
  );
}
