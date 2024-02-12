<?php
/*
 * Template Name: Template Home
 */
include('header.php');
?>

<div id="content" data-template="home" data-id="<?php echo get_option( 'page_on_front' ); ?>"></div>

</body>
  <script sync="" type="module" src="<?php echo get_template_directory_uri(); ?>/index.js?ver=<?= sdv_get_theme_version() ?>"></script>
</html>