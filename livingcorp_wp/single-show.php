<?php
include('header.php');
?>

<div id="content" data-template="show" data-id="<?php echo get_the_ID() ?>"></div>

</body>
  <script sync="" type="module" src="<?php echo get_template_directory_uri(); ?>/index.js?ver=<?= sdv_get_theme_version() ?>"></script>
</html>