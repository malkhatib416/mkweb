export interface IContactForm {
  nom: string;
  prenom: string;
  email: string;
  entreprise: string;
  telephone: string;
  sujet: string;
  message: string;
  recaptchaToken: string;
}

export interface BlogPost {
  id: string;
  title: string;
  description: string;
  content: string;
  categories: string[];
  author: string;
  publishedAt: string;
  readTime: number;
  image?: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}
