/**
 * VIDEO ASSET REGISTRY
 * ====================
 * Central source of truth for all video asset paths used across the site.
 * Each constant has a single, documented responsibility.
 * Never use hardcoded video paths in components — always import from here.
 *
 * File locations on disk:
 *   /videos/hero-background.mp4
 *   /videos/capabilities-background.mp4
 */

/**
 * Hero Section Background Video
 * ------------------------------
 * Used ONLY inside the HeroStage component as the full-screen
 * scroll-scrubbed background. Must NOT appear in any other section.
 *
 * Primary source: local asset served by Vite from /videos/
 * Fallbacks: CDN mirrors used if the primary file fails to load.
 */
export const HERO_VIDEO = '/videos/hero-background.mp4';

/**
 * Hero Section CDN Fallback Sources
 * -----------------------------------
 * Ordered list of fallback URLs tried in sequence if HERO_VIDEO fails.
 * Kept separate so primary path is always the canonical local asset.
 */
export const HERO_VIDEO_FALLBACKS: readonly string[] = [
  'https://assets.mixkit.co/videos/preview/mixkit-abstract-fast-line-lights-in-darkness-41548-large.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
];

/**
 * Capabilities Section Carousel Background Video
 * -----------------------------------------------
 * Used ONLY behind the 3D orbital carousel in the Capabilities / Disciplines
 * section. Clipped strictly to the carousel container — must NEVER bleed
 * behind the "Our Capabilities" heading or any other section.
 *
 * Playback rate is dynamically driven by swipe interaction velocity.
 */
export const CAPABILITIES_VIDEO = '/videos/capabilities-background.mp4';


