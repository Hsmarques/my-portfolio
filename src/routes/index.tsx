import HeroSection from "~/components/HeroSection";
import { createSignal, For } from "solid-js";

// Sample data - in a real app, this would come from a CMS or API
const featuredProjects = [
  {
    id: 1,
    title: "E-Commerce Platform",
    description: "Full-stack web application built with React and Node.js",
    tags: ["React", "Node.js", "MongoDB"],
    link: "#",
    image: "https://via.placeholder.com/400x300/6B46C1/ffffff?text=Project+1"
  },
  {
    id: 2,
    title: "Task Management App",
    description: "Real-time collaborative task manager with TypeScript",
    tags: ["TypeScript", "Socket.io", "PostgreSQL"],
    link: "#",
    image: "https://via.placeholder.com/400x300/3B82F6/ffffff?text=Project+2"
  },
  {
    id: 3,
    title: "AI Chat Assistant",
    description: "Machine learning powered chat interface",
    tags: ["Python", "TensorFlow", "FastAPI"],
    link: "#",
    image: "https://via.placeholder.com/400x300/EC4899/ffffff?text=Project+3"
  }
];

const featuredPhotos = [
  { id: 1, url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800", alt: "Mountain landscape" },
  { id: 2, url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800", alt: "City street" },
  { id: 3, url: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800", alt: "Urban architecture" },
  { id: 4, url: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=800", alt: "Portrait" },
];

export default function Home() {
  const [hoveredProject, setHoveredProject] = createSignal<number | null>(null);

  return (
    <main>
      <HeroSection />
      
      {/* Featured Projects Section */}
      <section class="py-20 px-4">
        <div class="max-w-6xl mx-auto">
          <h2 class="text-4xl font-bold mb-4 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Featured Projects
          </h2>
          <p class="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            A selection of my recent work in web development, from full-stack applications to innovative solutions.
          </p>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <For each={featuredProjects}>
              {(project) => (
                <div
                  class="group relative bg-gray-900/50 rounded-xl overflow-hidden border border-gray-800 hover:border-purple-500/50 transition-all duration-300 transform hover:-translate-y-1"
                  onMouseEnter={() => setHoveredProject(project.id)}
                  onMouseLeave={() => setHoveredProject(null)}
                >
                  <div class="aspect-video overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div class="p-6">
                    <h3 class="text-xl font-semibold mb-2 text-white">{project.title}</h3>
                    <p class="text-gray-400 mb-4">{project.description}</p>
                    <div class="flex flex-wrap gap-2 mb-4">
                      <For each={project.tags}>
                        {(tag) => (
                          <span class="text-xs px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full">
                            {tag}
                          </span>
                        )}
                      </For>
                    </div>
                    <a
                      href={project.link}
                      class="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      View Project
                      <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  </div>
                </div>
              )}
            </For>
          </div>
          
          <div class="text-center mt-12">
            <a
              href="/projects"
              class="inline-flex items-center px-6 py-3 border border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white rounded-lg transition-all"
            >
              View All Projects
              <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Featured Photography Section */}
      <section class="py-20 px-4 bg-gray-900/30">
        <div class="max-w-6xl mx-auto">
          <h2 class="text-4xl font-bold mb-4 text-center bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Photography
          </h2>
          <p class="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Capturing moments and stories through my lens. From landscapes to street photography, exploring the beauty in everyday life.
          </p>
          
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <For each={featuredPhotos}>
              {(photo) => (
                <div class="group relative aspect-square overflow-hidden rounded-lg">
                  <img
                    src={photo.url}
                    alt={photo.alt}
                    class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              )}
            </For>
          </div>
          
          <div class="text-center mt-12">
            <a
              href="/photography"
              class="inline-flex items-center px-6 py-3 border border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white rounded-lg transition-all"
            >
              View Gallery
              <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Contact CTA Section */}
      <section class="py-20 px-4">
        <div class="max-w-4xl mx-auto text-center">
          <h2 class="text-3xl font-bold mb-4 text-white">Let's Work Together</h2>
          <p class="text-gray-400 mb-8 max-w-2xl mx-auto">
            Whether you need a developer for your next project or want to collaborate on something creative, I'd love to hear from you.
          </p>
          <div class="flex flex-wrap gap-4 justify-center">
            <a
              href="mailto:hello@hugo.dev"
              class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/25 transition-all"
            >
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Get in Touch
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center px-6 py-3 border border-gray-600 hover:border-gray-400 text-gray-300 rounded-lg transition-all"
            >
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              GitHub
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
