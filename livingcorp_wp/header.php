<!doctype html>
<html <?php language_attributes(); ?> class="">
<head>
  <meta charset="<?php bloginfo( 'charset' ); ?>">
  <meta name="viewport" content="width=device-width, initial-scale=0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
  
  <link rel="stylesheet" href="<?php echo asset_cache('/index.css'); ?>" />
	<?php 
	wp_head();
	$URI = get_template_directory_uri();
  ?>
  </head>
	<?php if(is_user_logged_in()){ ?>
  <body  data-js="<?php echo get_site_url(); ?>"  data-token="<?php echo wp_get_session_token(); ?>" data-nonce="<?php echo wp_create_nonce( 'wp_rest' ) ?>">
	  <?php }else{
?>
	  <body  data-js="<?php echo get_site_url(); ?>">
	  
<?php
}
	?>
  <div class="searchbg"></div>
	<div class="modal">
    <div class="modal_bg"></div>
    <div class="modal_content">
		<div class="modal_success">
        <div class="supercheck" style="--main:#DF80AC">
          <div class="supercheck_i"></div>
        </div>
        <h2 class="tit1">Thank you!you’VE SUBSCRIBE successfully</h2>
        <div class="btn btn_close" style="--main:#DF80AC">
          <div class="btn_t">BACK TO LISTS</div>
        </div>
      </div>
      <div class="modal_close"><span></span><span></span></div>
      <div class="modal_content_text">
        <h3 class="tit4">Must Reads for Aspiring Allies</h3>
        <h2 class="tit1">Subscribe to stay updated on this list</h2>
        <div class="field field-email"><label class="field_lbl">Name</label><input class="field_npt">
          <div class="field_err">Wrong format</div>
          <div class="field_button">
            <div class="btninput">
              <div class="btninput_t">Suscribe</div>
            </div>
          </div>
        </div>
        <div class="chk"><input class="chk_npt" type="checkbox">
          <div class="chk_s">
            <div class="chk_i"></div>
          </div><label class="chk_lbl">I accept Terms and conditions</label>
        </div>
      </div><img src="<?php echo $URI; ?>/public/modal.png">
    </div>
  </div>