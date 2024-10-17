'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { IContactForm } from '@/types';
import { ADDRESS, EMAIL, PHONE } from '@/utils/contactInfo';
import { sendMail } from '@/utils/send-mail';
import { Mail, Phone, Building } from 'lucide-react';
import React, { useState } from 'react';

const defaultData = () => {
  return {
    nom: '',
    prenom: '',
    email: '',
    entreprise: '',
    telephone: '',
    sujet: '',
    message: '',
  };
};

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
    console.error('Error sending contact mail: ', error);
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
  const [formData, setFormData] = useState<IContactForm>(defaultData());

  const formHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await contactMail(formData);
      await confirmationMail(formData);
    } catch (error) {
      console.error('Error sending email: ', error);
    }

    setFormData(defaultData());
  };

  return (
    <main className="min-h-screen flex justify-center items-center mt-16">
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

          <form className="space-y-4" onSubmit={formHandler}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Input
                  id="nom"
                  placeholder="Nom"
                  defaultValue={formData.nom}
                  onKeyDown={(e: any) =>
                    setFormData({ ...formData, nom: e.target.value })
                  }
                />
              </div>
              <div>
                <Input
                  id="prenom"
                  placeholder="Prénom"
                  defaultValue={formData.prenom}
                  onKeyDown={(e: any) =>
                    setFormData({ ...formData, prenom: e.target.value })
                  }
                />
              </div>
            </div>
            <div>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                defaultValue={formData.email}
                onKeyDown={(e: any) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <div>
              <Input
                id="entreprise"
                placeholder="Entreprise"
                defaultValue={formData.entreprise}
                onKeyDown={(e: any) =>
                  setFormData({ ...formData, entreprise: e.target.value })
                }
              />
            </div>
            <div>
              <Input
                id="telephone"
                type="tel"
                placeholder="Numéro de téléphone"
                defaultValue={formData.telephone}
                onKeyDown={(e: any) =>
                  setFormData({ ...formData, telephone: e.target.value })
                }
              />
            </div>

            <div>
              <Input
                id="sujet"
                placeholder="Sujet"
                defaultValue={formData.sujet}
                onKeyDown={(e: any) =>
                  setFormData({ ...formData, sujet: e.target.value })
                }
              />
            </div>
            <div>
              <Textarea
                id="message"
                placeholder="Message"
                rows={4}
                defaultValue={formData.message}
                onKeyDown={(e: any) =>
                  setFormData({ ...formData, message: e.target.value })
                }
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gray-800 hover:bg-gray-900 text-white"
            >
              Envoyer
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
