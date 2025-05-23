import { BlogPost, Category } from "@/types";

export const categories: Category[] = [
  { id: "frontend", name: "Frontend", color: "bg-blue-100 text-blue-800" },
  { id: "backend", name: "Backend", color: "bg-green-100 text-green-800" },
  {
    id: "fullstack",
    name: "Full Stack",
    color: "bg-purple-100 text-purple-800",
  },
  { id: "tools", name: "Tools & Tips", color: "bg-orange-100 text-orange-800" },
  { id: "career", name: "Career", color: "bg-pink-100 text-pink-800" },
];

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Building Scalable React Applications with TypeScript",
    description:
      "Learn how to structure and build maintainable React applications using TypeScript, featuring best practices for component architecture and state management.",
    content:
      "TypeScript has revolutionized how we build React applications, providing type safety and better developer experience. In this comprehensive guide, we'll explore advanced patterns for building scalable applications.\n\nWe'll cover component composition, custom hooks, and state management strategies that work well in large codebases. Additionally, we'll discuss testing approaches and performance optimization techniques.\n\nBy the end of this article, you'll have a solid foundation for building robust React applications that can grow with your project requirements.",
    categories: ["frontend", "fullstack"],
    author: "MK",
    publishedAt: "2024-01-15",
    readTime: 12,
  },
  {
    id: "2",
    title: "Modern CSS Techniques for Better User Interfaces",
    description:
      "Explore cutting-edge CSS features like Grid, Flexbox, and custom properties to create responsive and maintainable user interfaces.",
    content:
      "CSS has evolved tremendously in recent years. Modern CSS features allow us to create complex layouts with minimal code while maintaining excellent browser support.\n\nWe'll dive deep into CSS Grid for complex layouts, Flexbox for component-level alignment, and CSS custom properties for dynamic theming. We'll also explore new features like container queries and CSS layers.\n\nThese techniques will help you write more maintainable CSS and create better user experiences across all devices.",
    categories: ["frontend"],
    author: "MK",
    publishedAt: "2024-01-12",
    readTime: 8,
  },
  {
    id: "3",
    title: "From Idea to Production: Full-Stack Development Workflow",
    description:
      "A complete guide to taking a web application from concept to production, covering planning, development, testing, and deployment.",
    content:
      "Building a full-stack application involves many moving parts. This guide walks through my complete workflow for taking projects from initial idea to production deployment.\n\nWe'll cover project planning, choosing the right tech stack, setting up development environments, implementing CI/CD pipelines, and monitoring production applications.\n\nI'll share real examples from recent projects and discuss common pitfalls to avoid during the development process.",
    categories: ["fullstack", "tools"],
    author: "MK",
    publishedAt: "2024-01-10",
    readTime: 15,
  },
  {
    id: "4",
    title: "API Design Best Practices for Frontend Developers",
    description:
      "Understanding how to design and consume APIs effectively, with focus on REST principles, error handling, and performance optimization.",
    content:
      "As a frontend developer, understanding API design principles helps you build better applications and collaborate more effectively with backend teams.\n\nWe'll explore REST API design patterns, proper error handling strategies, and caching mechanisms. We'll also discuss modern alternatives like GraphQL and when to use them.\n\nPractical examples will demonstrate how good API design leads to cleaner frontend code and better user experiences.",
    categories: ["backend", "fullstack"],
    author: "MK",
    publishedAt: "2024-01-08",
    readTime: 10,
  },
  {
    id: "5",
    title: "Essential Development Tools That Boost Productivity",
    description:
      "A curated list of development tools, extensions, and workflows that have significantly improved my daily development experience.",
    content:
      "The right tools can dramatically improve your development workflow. After years of experimentation, I've settled on a toolkit that maximizes productivity while minimizing friction.\n\nWe'll cover code editors and extensions, terminal setups, Git workflows, debugging tools, and automation scripts. I'll also share configuration files and setup guides.\n\nThese tools have been game-changers in my development process, and I hope they'll be valuable for your workflow too.",
    categories: ["tools"],
    author: "MK",
    publishedAt: "2024-01-05",
    readTime: 7,
  },
  {
    id: "6",
    title: "Lessons Learned: 5 Years in Web Development",
    description:
      "Reflections on my journey as a web developer, sharing insights, mistakes, and advice for aspiring developers.",
    content:
      "Looking back on five years in web development, I've learned as much from failures as from successes. This post shares key insights that have shaped my approach to development and career growth.\n\nWe'll discuss the importance of continuous learning, building a strong foundation in fundamentals, and the value of contributing to open source projects.\n\nI'll also share practical advice for job searching, building a portfolio, and navigating the ever-changing landscape of web technologies.",
    categories: ["career"],
    author: "MK",
    publishedAt: "2024-01-03",
    readTime: 9,
  },
];
