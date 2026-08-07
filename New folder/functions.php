<?php
/**
 * The Imagination Studio - Theme Engine & Asset Pipeline
 * Author: Sajjad Hossain | Lead Full Stack Developer
 * 
 * @package ImaginationStudio
 */

if (!defined('ABSPATH')) {
    // Prevent direct execution outside WordPress
    exit;
}

/**
 * Setup Theme Capabilities & Support
 */
function imagination_studio_setup() {
    // Add dynamic title tag support
    add_theme_support('title-tag');

    // Add post thumbnails support (featured images)
    add_theme_support('post-thumbnails');

    // Add HTML5 support for search form, comment form, gallery, etc.
    add_theme_support('html5', array(
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
        'style',
        'script'
    ));

    // Register primary navigation menu
    register_nav_menus(array(
        'primary-menu' => __('Primary Header Menu', 'imagination-studio'),
        'footer-menu'  => __('Footer Menu', 'imagination-studio'),
    ));
}
add_action('after_setup_theme', 'imagination_studio_setup');

/**
 * Enqueue Theme Stylesheets and JavaScript Bundles
 */
function imagination_studio_enqueue_assets() {
    // 1. Google Fonts: Syne & Plus Jakarta Sans
    wp_enqueue_style(
        'imagination-google-fonts',
        'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Syne:wght@700;800&display=swap',
        array(),
        null
    );

    // 2. Theme Root Style (WordPress standard metadata)
    wp_enqueue_style(
        'imagination-theme-root',
        get_stylesheet_uri(),
        array(),
        '1.0.0'
    );

    // 3. Main Custom Design System CSS
    wp_enqueue_style(
        'imagination-main-css',
        get_template_directory_uri() . '/assets/css/main.css',
        array('imagination-google-fonts', 'imagination-theme-root'),
        '1.0.0'
    );

    // 4. Libraries: Three.js (WebGL Engine)
    wp_enqueue_script(
        'threejs',
        'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js',
        array(),
        'r128',
        true
    );

    // 5. Libraries: GSAP (GreenSock Animation Platform)
    wp_enqueue_script(
        'gsap',
        'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js',
        array(),
        '3.12.5',
        true
    );

    // 6. Libraries: GSAP ScrollTrigger Plugin
    wp_enqueue_script(
        'gsap-scrolltrigger',
        'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js',
        array('gsap'),
        '3.12.5',
        true
    );

    // 7. Libraries: Lenis Smooth Scroll
    wp_enqueue_script(
        'lenis-scroll',
        'https://cdn.jsdelivr.net/npm/lenis@1.1.14/dist/lenis.min.js',
        array(),
        '1.1.14',
        true
    );

    // 8. Custom 3D Creative Core WebGL Controller
    wp_enqueue_script(
        'imagination-three-core',
        get_template_directory_uri() . '/assets/js/three-core.js',
        array('threejs', 'gsap', 'gsap-scrolltrigger'),
        '1.0.0',
        true
    );

    // 9. Custom Main Motion Engine & Interactions
    wp_enqueue_script(
        'imagination-main-js',
        get_template_directory_uri() . '/assets/js/main.js',
        array('lenis-scroll', 'gsap', 'gsap-scrolltrigger', 'imagination-three-core'),
        '1.0.0',
        true
    );
}
add_action('wp_enqueue_scripts', 'imagination_studio_enqueue_assets');
