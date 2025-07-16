export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  date: string;
  excerpt: string;
  content: string;
  tags: string[];
  readTime: string;
}

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Building Modern Web Applications with SolidJS",
    slug: "building-modern-web-apps-solidjs",
    date: "2024-01-15",
    excerpt: "Exploring the benefits of SolidJS for building performant and reactive web applications. Learn why SolidJS might be the perfect choice for your next project.",
    content: `
# Building Modern Web Applications with SolidJS

SolidJS has been gaining traction in the web development community, and for good reason. As a fine-grained reactive JavaScript library, it offers the developer experience of React with the performance characteristics of Svelte.

## Why SolidJS?

One of the most compelling aspects of SolidJS is its performance. Unlike React, which uses a virtual DOM, SolidJS compiles your declarative code into efficient vanilla JavaScript. This means no reconciliation overhead and faster runtime performance.

### Key Benefits

1. **Performance**: Direct DOM updates without virtual DOM overhead
2. **Size**: Smaller bundle sizes compared to React
3. **Familiarity**: JSX syntax that React developers already know
4. **Reactivity**: Fine-grained reactivity system

## Getting Started

Setting up a SolidJS project is straightforward with the official templates:

\`\`\`bash
npx degit solidjs/templates/js my-solid-app
cd my-solid-app
npm install
npm run dev
\`\`\`

## Real-World Experience

Having worked with SolidJS on several projects, I can confidently say it strikes an excellent balance between developer experience and performance. The learning curve is minimal if you're coming from React, but the performance gains are significant.

The reactive primitives in SolidJS are intuitive and powerful, making state management a breeze even in complex applications.

## Conclusion

SolidJS represents the evolution of reactive frameworks, combining the best aspects of existing solutions while introducing innovative approaches to performance and reactivity. If you haven't tried it yet, I highly recommend giving it a shot on your next project.
    `,
    tags: ["SolidJS", "JavaScript", "Web Development", "Performance"],
    readTime: "5 min read"
  },
  {
    id: "2", 
    title: "Mastering TypeScript: Advanced Patterns for Better Code",
    slug: "mastering-typescript-advanced-patterns",
    date: "2024-01-08",
    excerpt: "Deep dive into advanced TypeScript patterns that will make your code more robust, maintainable, and type-safe. From utility types to conditional types and more.",
    content: `
# Mastering TypeScript: Advanced Patterns for Better Code

TypeScript has revolutionized how we write JavaScript, bringing static typing and enhanced developer tooling to the dynamic world of web development. Today, let's explore some advanced patterns that can elevate your TypeScript game.

## Utility Types: Your Secret Weapon

TypeScript's built-in utility types are incredibly powerful. Here are some of my favorites:

### Partial and Required

\`\`\`typescript
interface User {
  id: string;
  name: string;
  email: string;
}

// Make all properties optional
type PartialUser = Partial<User>;

// Make all properties required (useful for API responses)
type RequiredUser = Required<User>;
\`\`\`

### Pick and Omit

\`\`\`typescript
// Select specific properties
type UserProfile = Pick<User, 'name' | 'email'>;

// Exclude specific properties  
type UserWithoutId = Omit<User, 'id'>;
\`\`\`

## Conditional Types: Logic in Types

Conditional types allow you to create types that depend on conditions:

\`\`\`typescript
type ApiResponse<T> = T extends string 
  ? { message: T } 
  : { data: T };

type StringResponse = ApiResponse<string>; // { message: string }
type UserResponse = ApiResponse<User>; // { data: User }
\`\`\`

## Template Literal Types

One of my favorite TypeScript 4.1+ features:

\`\`\`typescript
type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
type Endpoint = '/users' | '/posts' | '/comments';

type ApiEndpoint = \`\${HttpMethod} \${Endpoint}\`;
// Results in: 'GET /users' | 'POST /users' | 'PUT /users' | ...
\`\`\`

## Mapped Types for Transformations

Create new types by transforming existing ones:

\`\`\`typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type Optional<T> = {
  [P in keyof T]?: T[P];
};
\`\`\`

## Best Practices

1. **Use strict mode**: Always enable strict TypeScript settings
2. **Prefer interfaces for object shapes**: They're more extensible
3. **Use type assertions sparingly**: Let TypeScript infer when possible
4. **Leverage generic constraints**: Make your generics more specific

## Conclusion

These advanced TypeScript patterns might seem complex at first, but they become second nature with practice. They're the tools that separate intermediate TypeScript developers from advanced ones.

The investment in learning these patterns pays dividends in code quality, maintainability, and developer experience.
    `,
    tags: ["TypeScript", "Programming", "Best Practices", "Developer Tools"],
    readTime: "7 min read"
  },
  {
    id: "3",
    title: "My Journey as a Developer in Portugal",
    slug: "developer-journey-portugal",
    date: "2024-01-01", 
    excerpt: "Reflecting on my experience as a software developer in Portugal. From learning to code to working on exciting projects, here's my story and insights about the local tech scene.",
    content: `
# My Journey as a Developer in Portugal

Happy New Year! As 2024 begins, I wanted to take a moment to reflect on my journey as a developer here in Portugal and share some insights about our growing tech scene.

## The Beginning

Like many developers, my journey started with curiosity. I remember writing my first "Hello, World!" program and being amazed that I could make a computer do what I wanted. That spark of excitement has never left me.

Portugal has become an increasingly attractive destination for tech professionals, and I've been fortunate to witness this transformation firsthand.

## The Portuguese Tech Scene

The tech ecosystem in Portugal has evolved tremendously over the past few years:

### Growing Opportunities

- **Startup Scene**: Cities like Lisbon and Porto are becoming startup hubs
- **International Companies**: Many global tech companies are establishing offices here
- **Remote Work Culture**: Portugal has embraced remote work, attracting international talent
- **Government Support**: Initiatives like the Digital Transformation Plan are driving growth

### Challenges and Opportunities

While the scene is growing, there are still challenges:
- Salary gaps compared to other European tech hubs
- Limited venture capital compared to other markets
- Brain drain to higher-paying countries

But these challenges also present opportunities for those willing to innovate and build.

## Lessons Learned

Through my journey, I've learned several important lessons:

### 1. Community Matters

The Portuguese developer community is incredibly welcoming. Local meetups, conferences like Pixels Camp, and online communities have been invaluable for networking and learning.

### 2. Continuous Learning is Key

Technology evolves rapidly. Staying current with frameworks like SolidJS, new TypeScript features, and emerging patterns has been crucial for career growth.

### 3. Work-Life Balance

One thing I love about working in Portugal is the emphasis on work-life balance. The culture values family time, which contributes to long-term productivity and happiness.

## Looking Forward

As I continue my journey, I'm excited about:
- Contributing to open source projects
- Mentoring junior developers
- Building products that make a difference
- Continuing to learn and grow

The future of tech in Portugal looks bright, and I'm proud to be part of this growing community.

## Final Thoughts

To fellow developers in Portugal or those considering making the move: the scene here is vibrant, welcoming, and full of opportunities. Whether you're just starting out or you're a seasoned professional, there's a place for you in our community.

Let's build amazing things together! 🚀
    `,
    tags: ["Personal", "Portugal", "Career", "Tech Scene", "Community"],
    readTime: "6 min read"
  }
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find(post => post.slug === slug);
}

export function getAllBlogPosts(): BlogPost[] {
  return blogPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}