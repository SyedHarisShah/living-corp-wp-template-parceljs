<?php
$URI = get_template_directory_uri();
include('header.php');
setup_postdata($post);
?>
<div id="content" data-template="simple"  data-id="<?php echo get_the_ID() ?>"></div>

</body>
  <script sync="" type="module" src="<?php echo get_template_directory_uri(); ?>/index.js"></script>
</html>
