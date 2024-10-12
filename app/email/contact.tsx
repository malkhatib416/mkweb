import { IContactForm } from '@/types';
import * as React from 'react';

export const ContactMailTemplate: React.FC<Readonly<IContactForm>> = ({
  nom,
  prenom,
  email,
  entreprise,
  telephone,
  message,
}) => (
  <div>
    <h1>
      Nouveau message de {nom} {prenom}
    </h1>
    <p>{message}</p>
    <p>{email}</p>
    <p>{telephone}</p>
    <p>{entreprise}</p>
  </div>
);
