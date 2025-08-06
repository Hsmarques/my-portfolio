import { createSignal, onMount } from "solid-js";

export default function About() {
  const [isVisible, setIsVisible] = createSignal(false);

  onMount(() => {
    setIsVisible(true);
  });

  const skills = {
    development: [
      { name: "Frontend", items: ["React", "Vue.js", "TypeScript", "Tailwind CSS"] },
      { name: "Backend", items: ["Node.js", "Python", "PostgreSQL", "MongoDB"] },
      { name: "Tools", items: ["Git", "Docker", "AWS", "CI/CD"] }
    ],
    photography: [
      { name: "Specialties", items: ["Landscape", "Street", "Portrait", "Architecture"] },
      { name: "Equipment", items: ["Canon", "Sony", "Adobe Lightroom", "Capture One"] },
      { name: "Techniques", items: ["Long Exposure", "HDR", "Post-Processing", "Composition"] }
    ]
  };

  return (
    <main class="min-h-screen py-20 px-4">
      <div class="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div
          class={`text-center mb-16 transform transition-all duration-1000 ${
            isVisible() ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <h1 class="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            About Me
          </h1>
          <p class="text-xl text-gray-300">Developer by day, photographer by passion</p>
        </div>

        {/* Main Content */}
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Left Column - Photo & Quick Info */}
          <div class="space-y-6">
            <div class="relative group">
              <div class="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800"
                alt="Profile"
                class="relative rounded-lg w-full aspect-square object-cover"
              />
            </div>
            
            <div class="bg-gray-900/50 rounded-lg p-6 border border-gray-800">
              <h3 class="text-xl font-semibold mb-4 text-white">Quick Facts</h3>
              <ul class="space-y-3 text-gray-300">
                <li class="flex items-center gap-3">
                  <span class="text-purple-400">📍</span>
                  <span>Based in Portugal</span>
                </li>
                <li class="flex items-center gap-3">
                  <span class="text-purple-400">💼</span>
                  <span>5+ years in development</span>
                </li>
                <li class="flex items-center gap-3">
                  <span class="text-purple-400">📷</span>
                  <span>Photography enthusiast since 2018</span>
                </li>
                <li class="flex items-center gap-3">
                  <span class="text-purple-400">🌍</span>
                  <span>Love traveling & capturing moments</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column - Story */}
          <div class="space-y-6">
            <div>
              <h2 class="text-2xl font-bold mb-4 text-white">My Journey</h2>
              <p class="text-gray-300 leading-relaxed mb-4">
                Hey there! I'm Hugo, a passionate full-stack developer from Portugal with a deep love for both code and photography. 
                My journey in tech began over 5 years ago, and it's been an incredible ride of continuous learning and growth.
              </p>
              <p class="text-gray-300 leading-relaxed mb-4">
                What started as curiosity about how websites work evolved into a career building digital experiences. 
                I specialize in creating modern, responsive web applications using cutting-edge technologies like React, Node.js, and TypeScript.
              </p>
              <p class="text-gray-300 leading-relaxed">
                Beyond coding, I discovered photography as a creative outlet. There's something magical about capturing fleeting moments 
                and telling stories through images. Whether it's the golden hour over a landscape or the raw energy of street life, 
                I'm always seeking that perfect shot.
              </p>
            </div>

            <div>
              <h3 class="text-xl font-semibold mb-3 text-white">What Drives Me</h3>
              <p class="text-gray-300 leading-relaxed">
                I believe in the power of technology to solve real problems and the art of photography to capture real emotions. 
                This dual passion keeps me balanced – analytical problem-solving during the day, creative exploration with my camera during my free time.
              </p>
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div class="mb-16">
          <h2 class="text-3xl font-bold text-center mb-12 text-white">Skills & Expertise</h2>
          
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Development Skills */}
            <div class="bg-gray-900/50 rounded-xl p-8 border border-gray-800">
              <h3 class="text-xl font-semibold mb-6 flex items-center gap-2 text-purple-400">
                <span>&lt;/&gt;</span>
                Development
              </h3>
              <div class="space-y-6">
                {skills.development.map(category => (
                  <div>
                    <h4 class="text-sm font-semibold text-gray-400 mb-3">{category.name}</h4>
                    <div class="flex flex-wrap gap-2">
                      {category.items.map(skill => (
                        <span class="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Photography Skills */}
            <div class="bg-gray-900/50 rounded-xl p-8 border border-gray-800">
              <h3 class="text-xl font-semibold mb-6 flex items-center gap-2 text-blue-400">
                <span>📷</span>
                Photography
              </h3>
              <div class="space-y-6">
                {skills.photography.map(category => (
                  <div>
                    <h4 class="text-sm font-semibold text-gray-400 mb-3">{category.name}</h4>
                    <div class="flex flex-wrap gap-2">
                      {category.items.map(skill => (
                        <span class="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div class="mb-16 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-xl p-8 border border-gray-800">
          <h2 class="text-2xl font-bold mb-6 text-center text-white">My Values</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div class="text-3xl mb-3">🎯</div>
              <h3 class="text-lg font-semibold mb-2 text-white">Quality First</h3>
              <p class="text-gray-400 text-sm">
                Whether it's code or photos, I believe in delivering excellence in every project.
              </p>
            </div>
            <div>
              <div class="text-3xl mb-3">📚</div>
              <h3 class="text-lg font-semibold mb-2 text-white">Continuous Learning</h3>
              <p class="text-gray-400 text-sm">
                Technology evolves rapidly, and I'm always eager to learn and adapt.
              </p>
            </div>
            <div>
              <div class="text-3xl mb-3">🤝</div>
              <h3 class="text-lg font-semibold mb-2 text-white">Collaboration</h3>
              <p class="text-gray-400 text-sm">
                Great things happen when creative minds work together.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div class="text-center">
          <h2 class="text-2xl font-bold mb-4 text-white">Let's Connect!</h2>
          <p class="text-gray-400 mb-8 max-w-2xl mx-auto">
            Whether you're interested in collaborating on a development project, discussing photography, 
            or just want to say hello, I'd love to hear from you.
          </p>
          <div class="flex flex-wrap gap-4 justify-center">
            <a
              href="/projects"
              class="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all transform hover:scale-105"
            >
              View My Work
              <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
            <a
              href="mailto:hello@hugo.dev"
              class="inline-flex items-center px-6 py-3 border border-gray-600 hover:border-gray-400 text-gray-300 rounded-lg transition-all"
            >
              Get in Touch
              <svg class="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
