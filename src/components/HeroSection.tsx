import { createSignal, onMount } from "solid-js";

export default function HeroSection() {
  const [isVisible, setIsVisible] = createSignal(false);

  onMount(() => {
    setIsVisible(true);
  });

  return (
    <section class="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div class="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-blue-900/20"></div>
      
      {/* Animated background elements */}
      <div class="absolute inset-0">
        <div class="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div class="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div class="relative z-10 text-center px-4 max-w-6xl mx-auto">
        <div
          class={`transform transition-all duration-1000 ${
            isVisible() ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <h1 class="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
            Hugo's Digital Space
          </h1>
          
          <div class="text-xl md:text-2xl text-gray-300 mb-8 space-y-2">
            <div class="flex items-center justify-center gap-4">
              <span class="text-purple-400">&lt;/&gt;</span>
              <span>Full-Stack Developer</span>
            </div>
            <div class="flex items-center justify-center gap-4">
              <span class="text-blue-400">📷</span>
              <span>Photography Enthusiast</span>
            </div>
          </div>

          <p class="text-gray-400 max-w-2xl mx-auto mb-12 text-lg">
            Crafting elegant code and capturing beautiful moments. 
            Based in Portugal, building digital experiences and exploring the world through my lens.
          </p>

          <div class="flex flex-wrap gap-4 justify-center">
            <a
              href="/projects"
              class="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25"
            >
              View Projects
            </a>
            <a
              href="/photography"
              class="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
            >
              Photography
            </a>
            <a
              href="/about"
              class="px-8 py-3 border border-gray-600 hover:border-gray-400 text-gray-300 rounded-lg font-medium transition-all transform hover:scale-105"
            >
              About Me
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg
            class="w-6 h-6 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}