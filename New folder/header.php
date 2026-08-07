<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="The Imagination Studio - High-End Interactive Portfolio of Sajjad Hossain. Automotive Design, 3D Animation, Motion Graphics, VFX, Product Visualization.">
    <meta name="author" content="Sajjad Hossain">
    
    <!-- Preconnect to Font CDNs -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<!-- Custom Glowing Cursor Follower -->
<div class="cursor-follower" id="cursor-follower"></div>

<!-- Film Grain Noise Overlay -->
<div class="noise-overlay"></div>

<!-- Ambient Dynamic Background Glows -->
<div class="ambient-glow ambient-glow-1"></div>
<div class="ambient-glow ambient-glow-2"></div>
<div class="ambient-glow ambient-glow-3"></div>

<!-- Core Story HUD Overlay -->
<div class="core-hud" id="core-hud">
    <div class="hud-status-row">
        <span class="hud-pulse"></span>
        <span class="hud-status">CREATIVE CORE // ACTIVE</span>
    </div>
    <div class="hud-chapter" id="hud-chapter-title">01 // IGNITION & AWAKENING</div>
</div>

<!-- Header Navigation Bar -->
<header class="header-nav" id="site-header">
    <div class="container nav-container">
        <a href="<?php echo esc_url(home_url('/')); ?>" class="brand-logo">
            <span class="logo-dot"></span>
            <span>IMAGINATION</span>
        </a>

        <nav class="main-nav">
            <ul class="nav-links">
                <li><a href="#work" class="nav-link">Archive</a></li>
                <li><a href="#about" class="nav-link">Discipline</a></li>
                <li><a href="#services" class="nav-link">Capabilities</a></li>
                <li><a href="#contact" class="nav-link">Singularity</a></li>
            </ul>
        </nav>

        <div class="nav-actions">
            <a href="#contact" class="btn-glass btn-glass-primary">
                <span>INITIATE PROJECT</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="7" y1="17" x2="17" y2="7"></line>
                    <polyline points="7 7 17 7 17 17"></polyline>
                </svg>
            </a>
        </div>
    </div>
</header>

<main class="site-main">
