#!/usr/bin/env node
import { config } from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

// Load .env file
config();

console.log('Testing Cloudinary connection...');
console.log('CLOUDINARY_URL:', process.env.CLOUDINARY_URL ? 'Set' : 'Not set');
console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME || 'Not set');
console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? 'Set' : 'Not set');
console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? 'Set' : 'Not set');

// Configure Cloudinary
if (process.env.CLOUDINARY_URL) {
  cloudinary.config();
  console.log('Using CLOUDINARY_URL');
} else {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  console.log('Using individual env vars');
}

// Test connection by listing resources in my-portfolio folder
try {
  console.log('\nFetching resources from folder: my-portfolio');
  const result = await cloudinary.search
    .expression('folder:my-portfolio')
    .sort_by([{ created_at: 'desc' }])
    .max_results(10)
    .execute();

  console.log(`Found ${result.resources?.length || 0} resources`);
  if (result.resources && result.resources.length > 0) {
    console.log('\nFirst resource:', {
      public_id: result.resources[0].public_id,
      format: result.resources[0].format,
      width: result.resources[0].width,
      height: result.resources[0].height,
    });
  } else {
    console.log('\nNo resources found. Trying without folder filter...');
    const allResult = await cloudinary.search
      .expression('resource_type:image')
      .sort_by([{ created_at: 'desc' }])
      .max_results(5)
      .execute();
    console.log(`Found ${allResult.resources?.length || 0} total images`);
    if (allResult.resources && allResult.resources.length > 0) {
      console.log('Sample public_ids:', allResult.resources.map(r => r.public_id).slice(0, 3));
    }
  }
} catch (error) {
  console.error('Error:', error.message);
  if (error.http_code) {
    console.error('HTTP Code:', error.http_code);
  }
  process.exit(1);
}


