<?php
/**
 * Main Fallback Template
 * 
 * @package ImaginationStudio
 */

get_header(); ?>

<section class="fallback-section" style="padding: 10rem 0; min-height: 70vh;">
    <div class="container">
        <?php if (have_posts()) : ?>
            <?php while (have_posts()) : the_post(); ?>
                <article id="post-<?php the_ID(); ?>" <?php post_class('fallback-post'); ?>>
                    <h1 class="hero-title"><?php the_title(); ?></h1>
                    <div class="entry-content" style="color: var(--text-secondary); margin-top: 2rem;">
                        <?php the_content(); ?>
                    </div>
                </article>
            <?php endwhile; ?>
        <?php else : ?>
            <h1 class="hero-title">THE IMAGINATION STUDIO</h1>
            <p class="hero-description">Welcome to the digital portfolio of Sajjad Hossain.</p>
        <?php endif; ?>
    </div>
</section>

<?php get_footer(); ?>
