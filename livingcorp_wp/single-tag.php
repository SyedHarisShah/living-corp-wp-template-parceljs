<?php
include('header.php');
?>

<div id="content" data-template="tag" data-id="<?php echo get_the_ID() ?>" data-title="<?php single_post_title(); ?>"></div>

</body>
  <script sync="" type="module" src="<?php echo get_template_directory_uri(); ?>/index.js?ver=<?= sdv_get_theme_version() ?>"></script>
</html>