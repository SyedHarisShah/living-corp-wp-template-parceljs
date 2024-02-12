<?php
/*
 * Template Name: Template Search
 */
include('header.php');
?>

<div id="content" data-template="search" data-search="<?php echo isset($_GET['search']) ? $_GET['search'] : ''; ?>"></div>

</body>
  <script sync="" type="module" src="<?php echo get_template_directory_uri(); ?>/index.js?ver=<?= sdv_get_theme_version() ?>"></script>
</html>
