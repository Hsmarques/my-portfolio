import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary - the SDK can parse CLOUDINARY_URL automatically
// If CLOUDINARY_URL is set, use it; otherwise use individual env vars
if (process.env.CLOUDINARY_URL) {
  // Cloudinary SDK automatically parses CLOUDINARY_URL
  // Format: cloudinary://api_key:api_secret@cloud_name
  cloudinary.config();
} else {
  // Fallback to individual environment variables
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export type CloudinaryResource = {
  public_id: string;
  format: string;
  width: number;
  height: number;
  created_at: string;
  exif?: {
    [key: string]: any;
  };
  context?: {
    custom?: {
      alt?: string;
      tags?: string;
      camera?: string;
      lens?: string;
    };
  };
};

export async function listCloudinaryResources(folder?: string): Promise<CloudinaryResource[]> {
  try {
    // Verify Cloudinary is configured - check both CLOUDINARY_URL and individual vars
    const hasUrl = !!process.env.CLOUDINARY_URL;
    const hasIndividual = !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);

    if (!hasUrl && !hasIndividual) {
      console.error('Cloudinary credentials not found in environment variables');
      return [];
    }

    const expression = folder ? `folder:${folder}` : 'resource_type:image';

    const result = await cloudinary.search
      .expression(expression)
      .max_results(500)
      .execute();

    // Sort by created_at descending manually
    const resources = result.resources || [];
    resources.sort((a: any, b: any) => {
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return dateB - dateA; // Descending order
    });

    return resources;
  } catch (error) {
    console.error('Error fetching Cloudinary resources:', error);
    return [];
  }
}

export function getCloudinaryUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    quality?: number | string;
    format?: 'auto' | 'webp' | 'jpg' | 'png';
    crop?: string;
  } = {}
): string {
  const {
    width,
    height,
    quality = 'auto',
    format = 'auto',
    crop = 'limit',
  } = options;

  return cloudinary.url(publicId, {
    secure: true,
    transformation: [{
      width,
      height,
      quality,
      format,
      crop,
      fetch_format: format === 'auto' ? 'auto' : undefined,
    }],
  });
}

export default cloudinary;

