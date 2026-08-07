<?php
/**
 * Template Part: Work / Portfolio Showcase Section
 * 
 * @package ImaginationStudio
 */
?>

<section class="work-section" id="work">
    <div class="container">
        <div class="section-header">
            <span class="section-label">// SELECTED WORKS</span>
            <h2 class="section-title">THE ARCHIVE OF IMAGINATION</h2>
        </div>

        <div class="work-grid">
            <!-- Project 1: Automotive Design -->
            <article class="project-card">
                <div class="project-media-wrapper">
                    <svg width="100%" height="100%" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice">
                        <defs>
                            <linearGradient id="proj1-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stop-color="#1e1b4b" />
                                <stop offset="50%" stop-color="#3b82f6" />
                                <stop offset="100%" stop-color="#070709" />
                            </linearGradient>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#proj1-grad)" />
                        <!-- Futuristic Car Silhouette Mesh -->
                        <path d="M 150 320 C 250 200, 450 180, 650 280 L 720 330 Q 500 360 150 320 Z" fill="none" stroke="#60a5fa" stroke-width="3" opacity="0.8"/>
                        <circle cx="260" cy="330" r="35" fill="none" stroke="#93c5fd" stroke-width="4"/>
                        <circle cx="580" cy="330" r="35" fill="none" stroke="#93c5fd" stroke-width="4"/>
                    </svg>
                </div>
                <div class="project-content">
                    <span class="project-category">AUTOMOTIVE DESIGN & 3D</span>
                    <h3 class="project-title">AETHERIA HYPERCAR CONCEPT</h3>
                    <p class="project-desc">Aerodynamic luxury electric hypercar visualization crafted with precision surfacing and volumetric lighting.</p>
                </div>
            </article>

            <!-- Project 2: 3D Animation & VFX -->
            <article class="project-card">
                <div class="project-media-wrapper">
                    <svg width="100%" height="100%" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice">
                        <defs>
                            <linearGradient id="proj2-grad" x1="0%" y1="100%" x2="100%" y2="0%">
                                <stop offset="0%" stop-color="#4c1d95" />
                                <stop offset="50%" stop-color="#8b5cf6" />
                                <stop offset="100%" stop-color="#070709" />
                            </linearGradient>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#proj2-grad)" />
                        <!-- VFX Sphere Array -->
                        <circle cx="400" cy="250" r="90" fill="none" stroke="#c084fc" stroke-width="2" stroke-dasharray="10 5"/>
                        <circle cx="400" cy="250" r="140" fill="none" stroke="#a855f7" stroke-width="1.5" opacity="0.6"/>
                    </svg>
                </div>
                <div class="project-content">
                    <span class="project-category">3D ANIMATION & VFX</span>
                    <h3 class="project-title">CYBERNETIC CHRONICLES</h3>
                    <p class="project-desc">Cinematic title sequence and fluid VFX particle dynamics for next-generation digital entertainment.</p>
                </div>
            </article>

            <!-- Project 3: Product Visualization -->
            <article class="project-card">
                <div class="project-media-wrapper">
                    <svg width="100%" height="100%" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice">
                        <defs>
                            <linearGradient id="proj3-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stop-color="#0891b2" />
                                <stop offset="100%" stop-color="#070709" />
                            </linearGradient>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#proj3-grad)" />
                        <!-- Horology Ring -->
                        <circle cx="400" cy="250" r="100" fill="none" stroke="#22d3ee" stroke-width="8"/>
                        <line x1="400" y1="250" x2="400" y2="180" stroke="#67e8f9" stroke-width="4"/>
                        <line x1="400" y1="250" x2="460" y2="250" stroke="#67e8f9" stroke-width="4"/>
                    </svg>
                </div>
                <div class="project-content">
                    <span class="project-category">PRODUCT VISUALIZATION</span>
                    <h3 class="project-title">CHRONO LUXURY HOROLOGY</h3>
                    <p class="project-desc">Photorealistic 3D rendering and ray-traced material breakdown for luxury Swiss watchmakers.</p>
                </div>
            </article>

            <!-- Project 4: Motion Graphics & Graphic Design -->
            <article class="project-card">
                <div class="project-media-wrapper">
                    <svg width="100%" height="100%" viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice">
                        <defs>
                            <linearGradient id="proj4-grad" x1="100%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stop-color="#3b82f6" />
                                <stop offset="50%" stop-color="#8b5cf6" />
                                <stop offset="100%" stop-color="#070709" />
                            </linearGradient>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#proj4-grad)" />
                        <!-- Abstract Geometry -->
                        <polygon points="400,120 520,340 280,340" fill="none" stroke="#ffffff" stroke-width="3" opacity="0.8"/>
                    </svg>
                </div>
                <div class="project-content">
                    <span class="project-category">MOTION GRAPHICS & BRANDING</span>
                    <h3 class="project-title">NEBULA IDENTITY SYSTEM</h3>
                    <p class="project-desc">Dynamic generative graphic design and kinetic motion identity system for progressive technology firms.</p>
                </div>
            </article>
        </div>
    </div>
</section>
