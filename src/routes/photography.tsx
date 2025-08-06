import { createSignal, For, Show, onMount } from "solid-js";

// Photography categories
const categories = [
  { id: "all", name: "All", icon: "🎨" },
  { id: "landscape", name: "Landscape", icon: "🏔️" },
  { id: "street", name: "Street", icon: "🏙️" },
  { id: "portrait", name: "Portrait", icon: "👤" },
  { id: "nature", name: "Nature", icon: "🌿" },
  { id: "architecture", name: "Architecture", icon: "🏛️" }
];

// Sample gallery data - in production, this would come from a CMS or API
const photos = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200",
    thumb: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600",
    title: "Mountain Vista",
    category: "landscape",
    location: "Swiss Alps",
    camera: "Canon EOS R5",
    settings: "f/11, 1/125s, ISO 100"
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200",
    thumb: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600",
    title: "City Lights",
    category: "street",
    location: "Tokyo, Japan",
    camera: "Fujifilm X-T4",
    settings: "f/2.8, 1/60s, ISO 3200"
  },
  {
    id: 3,
    url: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200",
    thumb: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600",
    title: "Modern Lines",
    category: "architecture",
    location: "Shanghai, China",
    camera: "Sony A7R IV",
    settings: "f/8, 1/250s, ISO 200"
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200",
    thumb: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600",
    title: "Natural Portrait",
    category: "portrait",
    location: "Studio",
    camera: "Canon EOS R5",
    settings: "f/1.4, 1/200s, ISO 100"
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200",
    thumb: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600",
    title: "Forest Path",
    category: "nature",
    location: "Pacific Northwest",
    camera: "Nikon Z7 II",
    settings: "f/5.6, 1/60s, ISO 400"
  },
  {
    id: 6,
    url: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=1200",
    thumb: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?w=600",
    title: "Street Portrait",
    category: "portrait",
    location: "Lisbon, Portugal",
    camera: "Leica Q2",
    settings: "f/2, 1/500s, ISO 200"
  },
  {
    id: 7,
    url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200",
    thumb: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=600",
    title: "Coastal Beauty",
    category: "landscape",
    location: "Amalfi Coast, Italy",
    camera: "Canon EOS R5",
    settings: "f/11, 1/125s, ISO 100"
  },
  {
    id: 8,
    url: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=1200",
    thumb: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=600",
    title: "Urban Geometry",
    category: "architecture",
    location: "Barcelona, Spain",
    camera: "Fujifilm GFX 100S",
    settings: "f/8, 1/320s, ISO 100"
  },
  {
    id: 9,
    url: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=1200",
    thumb: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=600",
    title: "Golden Hour",
    category: "landscape",
    location: "Scottish Highlands",
    camera: "Sony A7R IV",
    settings: "f/16, 1/30s, ISO 100"
  },
  {
    id: 10,
    url: "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=1200",
    thumb: "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=600",
    title: "Forest Stream",
    category: "nature",
    location: "Olympic National Park",
    camera: "Nikon Z9",
    settings: "f/11, 1/4s, ISO 64"
  },
  {
    id: 11,
    url: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=1200",
    thumb: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=600",
    title: "Night Cityscape",
    category: "street",
    location: "New York City",
    camera: "Canon EOS R6",
    settings: "f/8, 8s, ISO 100"
  },
  {
    id: 12,
    url: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=1200",
    thumb: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600",
    title: "Ancient Tree",
    category: "nature",
    location: "California",
    camera: "Hasselblad X2D",
    settings: "f/8, 1/125s, ISO 200"
  }
];

export default function Photography() {
  const [selectedCategory, setSelectedCategory] = createSignal("all");
  const [selectedPhoto, setSelectedPhoto] = createSignal<typeof photos[0] | null>(null);
  const [imageLoaded, setImageLoaded] = createSignal<Set<number>>(new Set());

  const filteredPhotos = () => {
    if (selectedCategory() === "all") return photos;
    return photos.filter(photo => photo.category === selectedCategory());
  };

  const handleImageLoad = (id: number) => {
    setImageLoaded(prev => new Set(prev).add(id));
  };

  const navigatePhoto = (direction: 'prev' | 'next') => {
    const current = selectedPhoto();
    if (!current) return;
    
    const currentIndex = filteredPhotos().findIndex(p => p.id === current.id);
    const newIndex = direction === 'next' 
      ? (currentIndex + 1) % filteredPhotos().length
      : (currentIndex - 1 + filteredPhotos().length) % filteredPhotos().length;
    
    setSelectedPhoto(filteredPhotos()[newIndex]);
  };

  // Keyboard navigation
  onMount(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (!selectedPhoto()) return;
      
      switch(e.key) {
        case 'Escape':
          setSelectedPhoto(null);
          break;
        case 'ArrowLeft':
          navigatePhoto('prev');
          break;
        case 'ArrowRight':
          navigatePhoto('next');
          break;
      }
    };
    
    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  });

  return (
    <main class="min-h-screen py-20 px-4">
      <div class="max-w-7xl mx-auto">
        {/* Header */}
        <div class="text-center mb-16">
          <h1 class="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Photography
          </h1>
          <p class="text-gray-400 max-w-2xl mx-auto text-lg">
            Through my lens, I capture the beauty of landscapes, the energy of urban life, 
            and the stories written in faces and places around the world.
          </p>
        </div>

        {/* Category Filter */}
        <div class="flex flex-wrap justify-center gap-3 mb-12">
          <For each={categories}>
            {(category) => (
              <button
                onClick={() => setSelectedCategory(category.id)}
                class={`px-4 py-2 rounded-full font-medium transition-all transform hover:scale-105 flex items-center gap-2 ${
                  selectedCategory() === category.id
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/25"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </button>
            )}
          </For>
        </div>

        {/* Masonry Grid */}
        <div class="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
          <For each={filteredPhotos()}>
            {(photo) => (
              <div 
                class="break-inside-avoid group relative overflow-hidden rounded-lg cursor-pointer"
                onClick={() => setSelectedPhoto(photo)}
              >
                <div class={`relative ${!imageLoaded().has(photo.id) ? 'animate-pulse bg-gray-800' : ''}`}>
                  <img
                    src={photo.thumb}
                    alt={photo.title}
                    onLoad={() => handleImageLoad(photo.id)}
                    class="w-full h-auto transition-all duration-500 group-hover:scale-105"
                    style={{ display: imageLoaded().has(photo.id) ? 'block' : 'none' }}
                  />
                  <Show when={!imageLoaded().has(photo.id)}>
                    <div class="w-full h-64 bg-gray-800"></div>
                  </Show>
                </div>
                
                {/* Overlay */}
                <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div class="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 class="text-lg font-semibold mb-1">{photo.title}</h3>
                    <p class="text-sm text-gray-300 flex items-center gap-1">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {photo.location}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </For>
        </div>

        {/* Lightbox */}
        <Show when={selectedPhoto()}>
          <div 
            class="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedPhoto(null)}
              class="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors"
            >
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Navigation buttons */}
            <button
              onClick={(e) => { e.stopPropagation(); navigatePhoto('prev'); }}
              class="absolute left-4 top-1/2 -translate-y-1/2 p-2 text-white/70 hover:text-white transition-colors"
            >
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button
              onClick={(e) => { e.stopPropagation(); navigatePhoto('next'); }}
              class="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-white/70 hover:text-white transition-colors"
            >
              <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Image and details */}
            <div 
              class="max-w-7xl w-full max-h-[90vh] flex flex-col lg:flex-row gap-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image */}
              <div class="flex-1 flex items-center justify-center">
                <img
                  src={selectedPhoto()!.url}
                  alt={selectedPhoto()!.title}
                  class="max-w-full max-h-[80vh] object-contain"
                />
              </div>

              {/* Details */}
              <div class="lg:w-80 bg-gray-900/50 backdrop-blur-sm rounded-lg p-6">
                <h2 class="text-2xl font-bold mb-4 text-white">{selectedPhoto()!.title}</h2>
                
                <div class="space-y-4 text-gray-300">
                  <div>
                    <h3 class="text-sm font-semibold text-gray-400 mb-1">Location</h3>
                    <p class="flex items-center gap-2">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {selectedPhoto()!.location}
                    </p>
                  </div>

                  <div>
                    <h3 class="text-sm font-semibold text-gray-400 mb-1">Camera</h3>
                    <p class="flex items-center gap-2">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {selectedPhoto()!.camera}
                    </p>
                  </div>

                  <div>
                    <h3 class="text-sm font-semibold text-gray-400 mb-1">Settings</h3>
                    <p class="flex items-center gap-2">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                      </svg>
                      {selectedPhoto()!.settings}
                    </p>
                  </div>

                  <div class="pt-4 border-t border-gray-700">
                    <p class="text-sm text-gray-400">
                      Use arrow keys to navigate • Press ESC to close
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Show>

        {/* Footer CTA */}
        <div class="text-center mt-20">
          <p class="text-gray-400 mb-6">
            Interested in working together or purchasing prints?
          </p>
          <a
            href="mailto:hello@hugo.dev"
            class="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Get in Touch
          </a>
        </div>
      </div>
    </main>
  );
}