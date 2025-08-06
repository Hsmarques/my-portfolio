import { createSignal, For, Show } from "solid-js";

// Comprehensive project data
const allProjects = [
  {
    id: 1,
    title: "E-Commerce Platform",
    description: "A full-featured e-commerce platform with real-time inventory management, payment processing, and admin dashboard.",
    longDescription: "Built with React, Node.js, and MongoDB. Features include user authentication, product search and filtering, shopping cart, order management, and Stripe payment integration.",
    tags: ["React", "Node.js", "MongoDB", "Stripe", "Redux"],
    category: "fullstack",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800",
    github: "https://github.com",
    live: "https://example.com",
    featured: true
  },
  {
    id: 2,
    title: "Task Management System",
    description: "Real-time collaborative task manager with drag-and-drop functionality and team workspaces.",
    longDescription: "Developed using TypeScript, Socket.io for real-time updates, and PostgreSQL. Includes Kanban boards, user roles, notifications, and activity tracking.",
    tags: ["TypeScript", "Socket.io", "PostgreSQL", "React", "Express"],
    category: "fullstack",
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800",
    github: "https://github.com",
    live: "https://example.com",
    featured: true
  },
  {
    id: 3,
    title: "AI Chat Assistant",
    description: "Machine learning powered chat interface with natural language processing capabilities.",
    longDescription: "Python-based backend using TensorFlow and FastAPI. Implements NLP for intent recognition, context management, and intelligent responses.",
    tags: ["Python", "TensorFlow", "FastAPI", "React", "NLP"],
    category: "ai",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800",
    github: "https://github.com",
    featured: true
  },
  {
    id: 4,
    title: "Portfolio Website",
    description: "Modern, responsive portfolio website with dynamic content management.",
    longDescription: "Built with Next.js and Tailwind CSS. Features include dark mode, blog integration, project showcase, and contact form.",
    tags: ["Next.js", "Tailwind CSS", "TypeScript", "MDX"],
    category: "frontend",
    image: "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800",
    github: "https://github.com"
  },
  {
    id: 5,
    title: "Weather Dashboard",
    description: "Interactive weather dashboard with location-based forecasts and historical data.",
    longDescription: "Vue.js application consuming multiple weather APIs. Includes charts, maps, and customizable widgets.",
    tags: ["Vue.js", "Chart.js", "API Integration", "Leaflet"],
    category: "frontend",
    image: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=800",
    github: "https://github.com"
  },
  {
    id: 6,
    title: "REST API Service",
    description: "Scalable RESTful API with authentication, rate limiting, and comprehensive documentation.",
    longDescription: "Node.js and Express backend with JWT authentication, Redis caching, and Swagger documentation.",
    tags: ["Node.js", "Express", "Redis", "JWT", "Swagger"],
    category: "backend",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800",
    github: "https://github.com"
  }
];

const categories = [
  { value: "all", label: "All Projects", color: "gray" },
  { value: "fullstack", label: "Full Stack", color: "purple" },
  { value: "frontend", label: "Frontend", color: "blue" },
  { value: "backend", label: "Backend", color: "green" },
  { value: "ai", label: "AI/ML", color: "pink" }
];

export default function Projects() {
  const [selectedCategory, setSelectedCategory] = createSignal("all");
  const [selectedProject, setSelectedProject] = createSignal<number | null>(null);

  const filteredProjects = () => {
    if (selectedCategory() === "all") return allProjects;
    return allProjects.filter(project => project.category === selectedCategory());
  };

  const getCategoryColor = (category: string) => {
    const cat = categories.find(c => c.value === category);
    return cat?.color || "gray";
  };

  return (
    <main class="min-h-screen py-20 px-4">
      <div class="max-w-6xl mx-auto">
        {/* Header */}
        <div class="text-center mb-16">
          <h1 class="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            My Projects
          </h1>
          <p class="text-gray-400 max-w-2xl mx-auto text-lg">
            A collection of my work spanning web development, AI, and creative coding. 
            Each project represents a unique challenge and learning experience.
          </p>
        </div>

        {/* Category Filter */}
        <div class="flex flex-wrap justify-center gap-3 mb-12">
          <For each={categories}>
            {(category) => (
              <button
                onClick={() => setSelectedCategory(category.value)}
                class={`px-6 py-2 rounded-full font-medium transition-all transform hover:scale-105 ${
                  selectedCategory() === category.value
                    ? `bg-${category.color}-600 text-white shadow-lg shadow-${category.color}-500/25`
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
              >
                {category.label}
              </button>
            )}
          </For>
        </div>

        {/* Projects Grid */}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <For each={filteredProjects()}>
            {(project) => (
              <div
                class="group relative bg-gray-900/50 rounded-xl overflow-hidden border border-gray-800 hover:border-purple-500/50 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl"
                onClick={() => setSelectedProject(project.id)}
              >
                {/* Featured Badge */}
                <Show when={project.featured}>
                  <div class="absolute top-4 right-4 z-10 px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full backdrop-blur-sm">
                    Featured
                  </div>
                </Show>

                {/* Project Image */}
                <div class="aspect-video overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* Project Details */}
                <div class="p-6">
                  <h3 class="text-xl font-semibold mb-2 text-white">{project.title}</h3>
                  <p class="text-gray-400 mb-4 line-clamp-2">{project.description}</p>
                  
                  {/* Tags */}
                  <div class="flex flex-wrap gap-2 mb-4">
                    <For each={project.tags.slice(0, 3)}>
                      {(tag) => (
                        <span class={`text-xs px-3 py-1 bg-${getCategoryColor(project.category)}-500/20 text-${getCategoryColor(project.category)}-300 rounded-full`}>
                          {tag}
                        </span>
                      )}
                    </For>
                    <Show when={project.tags.length > 3}>
                      <span class="text-xs px-3 py-1 bg-gray-700 text-gray-400 rounded-full">
                        +{project.tags.length - 3}
                      </span>
                    </Show>
                  </div>

                  {/* Links */}
                  <div class="flex gap-4">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      class="inline-flex items-center text-gray-400 hover:text-white transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <svg class="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                      Code
                    </a>
                    <Show when={project.live}>
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="inline-flex items-center text-gray-400 hover:text-white transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Live Demo
                      </a>
                    </Show>
                  </div>
                </div>
              </div>
            )}
          </For>
        </div>

        {/* Project Modal */}
        <Show when={selectedProject()}>
          {(() => {
            const project = allProjects.find(p => p.id === selectedProject());
            return project ? (
              <div 
                class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={() => setSelectedProject(null)}
              >
                <div 
                  class="bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div class="relative">
                    <img
                      src={project.image}
                      alt={project.title}
                      class="w-full h-64 object-cover rounded-t-2xl"
                    />
                    <button
                      onClick={() => setSelectedProject(null)}
                      class="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                    >
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <div class="p-8">
                    <h2 class="text-3xl font-bold mb-4">{project.title}</h2>
                    <p class="text-gray-400 mb-6">{project.longDescription}</p>
                    
                    <div class="mb-6">
                      <h3 class="text-xl font-semibold mb-3">Technologies Used</h3>
                      <div class="flex flex-wrap gap-2">
                        <For each={project.tags}>
                          {(tag) => (
                            <span class={`px-4 py-2 bg-${getCategoryColor(project.category)}-500/20 text-${getCategoryColor(project.category)}-300 rounded-lg`}>
                              {tag}
                            </span>
                          )}
                        </For>
                      </div>
                    </div>
                    
                    <div class="flex gap-4">
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        class="inline-flex items-center px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                      >
                        <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                        View on GitHub
                      </a>
                      <Show when={project.live}>
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noopener noreferrer"
                          class="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                        >
                          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          Live Demo
                        </a>
                      </Show>
                    </div>
                  </div>
                </div>
              </div>
            ) : null;
          })()}
        </Show>
      </div>
    </main>
  );
}