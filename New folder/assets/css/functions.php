<?php

function imagination_assets(){

wp_enqueue_style(
'imagination-style',
get_stylesheet_uri(),
[],
'1.0'
);

}

add_action(
'wp_enqueue_scripts',
'imagination_assets'
);