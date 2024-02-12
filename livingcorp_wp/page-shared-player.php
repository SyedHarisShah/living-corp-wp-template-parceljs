<?php
/*
 * Template Name: Shared Player
 */
include('header.php');
$brandColor = get_field('player_brand_color', 'option');
$brandColor = !empty($brandColor) ? $brandColor : '#005efe';
$sponsor = get_field('sponsor', get_the_ID());
?>

<div id="content" data-template="shared-player" data-signupal="hide" data-spid="<?= $sponsor; ?>" style="--brand-color:<?= $brandColor; ?>"></div>

</body>
  <script sync="" type="module" src="<?php echo get_template_directory_uri(); ?>/index.js?ver=<?= sdv_get_theme_version() ?>"></script>
</html>