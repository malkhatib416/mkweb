export interface IContactForm {
  nom: string;
  email: string;
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
