/**
 * Cloudinary Service
 * Uploads and manages celebrity images
 */

import axios from 'axios';
import { v2 as cloudinary } from 'cloudinary';
import { CLOUDINARY_CONFIG, IMAGE_CONFIG } from '../config';
import * as crypto from 'crypto';

// Configure Cloudinary
cloudinary.config(CLOUDINARY_CONFIG);

/**
 * Generate neutral gradient placeholder if no image available
 */
export function generatePlaceholderGradient(name: string): string {
  // Generate deterministic color from name
  const hash = crypto.createHash('md5').update(name).digest('hex');
  const color1 = hash.substring(0, 6);
  const color2 = hash.substring(6, 12);

  // Return gradient SVG data URL
  const svg = `
<svg width="800" height="800" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#${color1};stop-opacity:1" />
      <stop offset="100%" style="stop-color:#${color2};stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="800" height="800" fill="url(#grad)" />
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="64" fill="white" text-anchor="middle" dominant-baseline="middle" opacity="0.5">
    ${name.substring(0, 2).toUpperCase()}
  </text>
</svg>
  `.trim();

  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

/**
 * Download image from URL
 */
async function downloadImage(url: string): Promise<Buffer> {
  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      timeout: 30000,
      maxContentLength: 10 * 1024 * 1024 // 10MB max (Cloudinary free tier limit)
    });

    return Buffer.from(response.data);

  } catch (error: any) {
    console.error(`❌ Image download error for ${url}:`, error.message);
    throw error;
  }
}

/**
 * Upload image to Cloudinary
 */
export async function uploadImage(
  imageUrl: string,
  publicId: string,
  options: {
    width?: number;
    height?: number;
    format?: string;
    quality?: number;
  } = {}
): Promise<string | null> {
  try {
    console.log(`📤 Uploading image: ${publicId}...`);

    const result = await cloudinary.uploader.upload(imageUrl, {
      public_id: publicId,
      folder: 'starrymeet/celebrities',
      overwrite: false,
      resource_type: 'image',
      transformation: [
        {
          width: options.width || IMAGE_CONFIG.hero.maxWidth,
          height: options.height,
          crop: 'limit',
          quality: options.quality || IMAGE_CONFIG.hero.quality,
          fetch_format: options.format || IMAGE_CONFIG.hero.format
        }
      ]
    });

    console.log(`✅ Image uploaded: ${result.secure_url}`);
    return result.secure_url;

  } catch (error: any) {
    console.error(`❌ Cloudinary upload error for ${publicId}:`, error.message);
    return null;
  }
}

/**
 * Upload hero and thumbnail images for celebrity
 */
export async function uploadCelebrityImages(
  name: string,
  slug: string,
  region: string,
  imageUrl?: string
): Promise<{
  heroUrl: string;
  thumbnailUrl: string;
  source?: string;
}> {
  const basePath = `${region}/${slug}`;

  try {
    // If no image URL provided, use placeholder
    if (!imageUrl) {
      const placeholderUrl = generatePlaceholderGradient(name);

      const heroUrl = await uploadImage(placeholderUrl, `${basePath}/hero`, {
        width: IMAGE_CONFIG.hero.maxWidth,
        format: IMAGE_CONFIG.hero.format,
        quality: IMAGE_CONFIG.hero.quality
      });

      const thumbnailUrl = await uploadImage(placeholderUrl, `${basePath}/thumb`, {
        width: IMAGE_CONFIG.thumbnail.maxWidth,
        format: IMAGE_CONFIG.thumbnail.format,
        quality: IMAGE_CONFIG.thumbnail.quality
      });

      return {
        heroUrl: heroUrl || placeholderUrl,
        thumbnailUrl: thumbnailUrl || placeholderUrl
      };
    }

    // Upload hero image
    const heroUrl = await uploadImage(imageUrl, `${basePath}/hero`, {
      width: IMAGE_CONFIG.hero.maxWidth,
      format: IMAGE_CONFIG.hero.format,
      quality: IMAGE_CONFIG.hero.quality
    });

    // Upload thumbnail
    const thumbnailUrl = await uploadImage(imageUrl, `${basePath}/thumb`, {
      width: IMAGE_CONFIG.thumbnail.maxWidth,
      format: IMAGE_CONFIG.thumbnail.format,
      quality: IMAGE_CONFIG.thumbnail.quality
    });

    if (!heroUrl || !thumbnailUrl) {
      // Fallback to placeholder if upload failed
      const placeholderUrl = generatePlaceholderGradient(name);
      return {
        heroUrl: heroUrl || placeholderUrl,
        thumbnailUrl: thumbnailUrl || placeholderUrl,
        source: imageUrl
      };
    }

    return {
      heroUrl,
      thumbnailUrl,
      source: imageUrl
    };

  } catch (error: any) {
    console.error(`❌ Failed to upload images for ${name}:`, error.message);

    // Fallback to placeholder
    const placeholderUrl = generatePlaceholderGradient(name);
    return {
      heroUrl: placeholderUrl,
      thumbnailUrl: placeholderUrl
    };
  }
}

/**
 * Delete celebrity images from Cloudinary
 */
export async function deleteCelebrityImages(slug: string, region: string): Promise<void> {
  try {
    const basePath = `starrymeet/celebrities/${region}/${slug}`;

    await cloudinary.api.delete_resources([
      `${basePath}/hero`,
      `${basePath}/thumb`
    ]);

    console.log(`✅ Deleted images for ${slug}`);

  } catch (error: any) {
    console.error(`❌ Failed to delete images for ${slug}:`, error.message);
  }
}

/**
 * Check if image exists in Cloudinary
 */
export async function imageExists(slug: string, region: string): Promise<boolean> {
  try {
    const publicId = `starrymeet/celebrities/${region}/${slug}/hero`;

    await cloudinary.api.resource(publicId);

    return true;

  } catch (error: any) {
    return false;
  }
}

export default {
  uploadImage,
  uploadCelebrityImages,
  deleteCelebrityImages,
  imageExists,
  generatePlaceholderGradient
};
