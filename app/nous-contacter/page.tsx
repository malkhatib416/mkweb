'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { IContactForm } from '@/types';
import { ADDRESS, EMAIL, PHONE } from '@/utils/contactInfo';
import { sendMail } from '@/utils/send-mail';
import { Mail, Phone, Building, LoaderCircle } from 'lucide-react';
import React, { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Form, FormField } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';

const contactMail = async (formData: IContactForm) => {
  try {
    await sendMail({
      email: EMAIL!,
      subject: formData.sujet,
      text: formData.message,
      html: `
  <h1>Informations de contact</h1>
  <ul>
    <li><strong>Nom:</strong> ${formData.nom}</li>
    <li><strong>Prénom:</strong> ${formData.prenom}</li>
    <li><strong>Email:</strong> ${formData.email}</li>
    <li><strong>Entreprise:</strong> ${formData.entreprise}</li>
    <li><strong>Téléphone:</strong> ${formData.telephone}</li>
  </ul>

  <h2>Sujet:</h2>
  <p>${formData.sujet}</p>

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
      text: `Bonjour ${formData.prenom},\nNous avons bien reçu votre message et nous vous répondrons dans les plus brefs délais.\n\nCordialement,`,
      html: `
    <h1>Bonjour ${formData.prenom},</h1>
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

  const formSchema = z.object({
    nom: z.string(),
    prenom: z.string(),
    email: z.string().email(),
    entreprise: z.string(),
    telephone: z.string(),
    sujet: z.string(),
    message: z.string(),
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
      setIsSubmitting(true);
      await contactMail(values);
      await confirmationMail(values);
      toast({
        title: 'Message envoyé !',
        description:
          'Nous avons bien reçu votre message et nous vous répondrons dans les plus brefs délais.',
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
    <main className="h-[73vh] flex justify-center items-center mt-16">
      <div className="max-w-7xl  px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-8 ">
            <div>
              <h1 className="text-4xl font-bold mb-4 text-myorange-200">
                Contactez-nous
              </h1>
              <p className="text-lg text-gray-600">
                Nous sommes là pour répondre à toutes vos questions. N'hésitez
                pas à nous contacter !
              </p>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <FormField
                  name="nom"
                  control={form.control}
                  render={({ field }) => (
                    <Input
                      className="w-full"
                      id="nom"
                      placeholder="Nom"
                      {...field}
                    />
                  )}
                />

                <FormField
                  name="prenom"
                  control={form.control}
                  render={({ field }) => (
                    <Input
                      id="prenom"
                      className="w-full"
                      placeholder="Prénom"
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
                      placeholder="Email"
                      {...field}
                    />
                  )}
                />
                <FormField
                  name="telephone"
                  control={form.control}
                  render={({ field }) => (
                    <Input
                      id="telephone"
                      type="tel"
                      placeholder="Numéro de téléphone"
                      {...field}
                    />
                  )}
                />

                <FormField
                  name="entreprise"
                  control={form.control}
                  render={({ field }) => (
                    <Input
                      className="md:col-span-2"
                      id="entreprise"
                      placeholder="Entreprise"
                      {...field}
                    />
                  )}
                />

                <FormField
                  name="sujet"
                  control={form.control}
                  render={({ field }) => (
                    <Input
                      id="sujet"
                      className="md:col-span-2"
                      placeholder="Sujet"
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
                      placeholder="Message"
                      className="md:col-span-2"
                      rows={4}
                      {...field}
                    />
                  )}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gray-800 hover:bg-gray-900 text-white"
              >
                {isSubmitting ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  'Envoyer'
                )}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </main>
  );
}
