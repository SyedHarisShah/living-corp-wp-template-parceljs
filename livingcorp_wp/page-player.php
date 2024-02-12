<?php
/*
 * Template Name: Player Discover
 */
include('header.php');
$brandColor = get_field('player_brand_color', 'option');
$brandColor = !empty($brandColor) ? $brandColor : '#005efe';
?>

<div id="content" data-template="player" data-signupal="hide" style="--brand-color:<?= $brandColor; ?>"></div>

</body>
  <script sync="" type="module" src="<?php echo get_template_directory_uri(); ?>/index.js?ver=<?= sdv_get_theme_version() ?>"></script>
</html>