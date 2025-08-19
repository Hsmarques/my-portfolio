export type Photo = {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  tags: string[];
  createdAt?: string;
  exif?: {
    camera?: string;
    lens?: string;
    focalLengthMm?: number;
    aperture?: string; // e.g. f/4
    shutter?: string;  // e.g. 1/250s
    iso?: number;
  };
};

// Replace these with your own images placed in `public/photos/*`
// or keep using remote URLs. Recommend 1600px on the long edge.
export const photos: Photo[] = [
  {
    id: "alps-dawn",
    src: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1600&auto=format&fit=crop",
    alt: "Soft dawn light over alpine peaks and a misty valley",
    width: 1600,
    height: 1066,
    tags: ["landscape", "mountains", "travel"],
    exif: {
      camera: "OM System OM-3",
      lens: "M.Zuiko 12-45mm f/4 PRO",
      focalLengthMm: 12,
      aperture: "f/8",
      shutter: "1/125s",
      iso: 200
    }
  },
  {
    id: "forest-fog",
    src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1600&auto=format&fit=crop",
    alt: "Fog rolling through a dense evergreen forest",
    width: 1600,
    height: 1067,
    tags: ["landscape", "forest", "moody"],
    exif: {
      camera: "OM System OM-3",
      lens: "M.Zuiko 45mm f/1.8",
      focalLengthMm: 45,
      aperture: "f/4",
      shutter: "1/60s",
      iso: 400
    }
  },
  {
    id: "desert-dunes",
    src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop",
    alt: "Golden sand dunes under a dramatic sky",
    width: 1600,
    height: 1066,
    tags: ["landscape", "desert", "travel"],
    exif: {
      camera: "OM System OM-3",
      lens: "Panasonic Leica 9mm f/1.7",
      focalLengthMm: 9,
      aperture: "f/5.6",
      shutter: "1/500s",
      iso: 200
    }
  },
  {
    id: "city-night",
    src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1600&auto=format&fit=crop",
    alt: "Neon-lit city street in the rain at night",
    width: 1600,
    height: 1067,
    tags: ["street", "night", "urban"]
  },
  {
    id: "portrait-window",
    src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1600&auto=format&fit=crop",
    alt: "Natural light portrait by a window",
    width: 1600,
    height: 1067,
    tags: ["portrait", "people", "studio"]
  },
  {
    id: "ocean-cliff",
    src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1600&auto=format&fit=crop",
    alt: "Cliffs meeting the ocean with waves crashing below",
    width: 1600,
    height: 1067,
    tags: ["seascape", "travel", "landscape"]
  },
  {
    id: "northern-lights",
    src: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1600&auto=format&fit=crop",
    alt: "Aurora borealis over snowy mountains",
    width: 1600,
    height: 1067,
    tags: ["night", "astro", "landscape"]
  },
  {
    id: "street-crossing",
    src: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1600&auto=format&fit=crop",
    alt: "People crossing a busy street with long shadows",
    width: 1600,
    height: 1067,
    tags: ["street", "urban", "travel"]
  },
  {
    id: "snowy-ridge",
    src: "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1600&auto=format&fit=crop",
    alt: "Hiker on a snowy ridge line at golden hour",
    width: 1600,
    height: 1067,
    tags: ["adventure", "mountains", "travel"]
  },
  {
    id: "minimal-arch",
    src: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=1600&auto=format&fit=crop",
    alt: "Minimal architectural lines with strong contrast",
    width: 1600,
    height: 1067,
    tags: ["architecture", "minimal", "urban"]
  },
  {
    id: "café-portrait",
    src: "https://images.unsplash.com/photo-1503341560634-69ee8e0fd83f?q=80&w=1600&auto=format&fit=crop",
    alt: "Candid portrait in a cozy café",
    width: 1600,
    height: 1067,
    tags: ["portrait", "street", "people"]
  },
  {
    id: "island-aerial",
    src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop",
    alt: "Aerial view of an island surrounded by turquoise water",
    width: 1600,
    height: 1067,
    tags: ["aerial", "seascape", "travel"]
  }
];

export const allTags = Array.from(
  photos.reduce<Set<string>>((set, p) => {
    p.tags.forEach((t) => set.add(t));
    return set;
  }, new Set())
);

export default photos;