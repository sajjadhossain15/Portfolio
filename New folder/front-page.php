<?php
/**
 * Template Name: Front Page Portfolio
 * Description: High-end interactive single page portfolio layout for Sajjad Hossain.
 * 
 * @package ImaginationStudio
 */

get_header();

// Render 3D Hero Section
get_template_part('template-parts/hero');

// Render Portfolio Showcase (Automotive, 3D, VFX)
get_template_part('template-parts/work');

// Render About & Creative Fields Section
get_template_part('template-parts/about');

// Render Capabilities & Services Section
get_template_part('template-parts/services');

// Render Editorial Contact Section
get_template_part('template-parts/contact');

get_footer();
