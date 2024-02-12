<?php

//add_theme_support( 'post-thumbnails' );

// --------  CUSTOM FOOTER LOGO --------

function dashboard_footer() { ?>

<?php }

add_filter('admin_footer_text', 'dashboard_footer');


// --------  CUSTOM WORDPRESS LOGIN --------

function my_custom_login_logo() {

    $color = '#000';

    ?>

    <style type="text/css">
		body.login div#login h1 a {
 			background-image: url(<?php echo get_template_directory_uri(); ?>/images/mb.jpg);
		}
        h1 a {
            background-size: contain !important;
            width: 80px !important;
            height: 80px !important;
        }
        .login #backtoblog a:hover, .login #nav a:hover, .login h1 a:hover {
            color: <?php echo $color; ?> !important;
        }
        .login form {
            box-shadow: none !important;
            border: 1px solid #ddd !important;
        }
        .login form input {
            box-shadow: none !important;
        }
        .wp-core-ui .button-primary {
            background: <?php echo $color; ?> !important;
            border-color: <?php echo $color; ?> !important;
            border-radius: 0px !important;
            box-shadow: none !important;
            text-shadow: none !important;
        }
        input:focus {
            border-color: <?php echo $color; ?> !important;
            box-shadow: none !important;
        }
        input[type=checkbox] {
            border-color: #ddd !important;
        }
        input[type=checkbox]:checked:before {
            color: <?php echo $color; ?> !important;
        }
    </style>

<?php }

add_action('login_head', 'my_custom_login_logo');


// --------  CUSTOM DASHBOARD CSS --------

function my_custom_css() {
  echo '<style>
    body {

    }
  </style>';
}

add_action('admin_head', 'my_custom_css');


// --------  REMOVE ADMIN BAR LOGO --------

function annointed_admin_bar_remove() {

    global $wp_admin_bar;
    $wp_admin_bar->remove_menu('wp-logo');

}

add_action('wp_before_admin_bar_render', 'annointed_admin_bar_remove', 0);


// --------  REMOVE UPDATES NOTIFICATIONS FOR NOT ADMINS --------

//function remove_core_updates() {
//
//    if ( current_user_can( 'update_core' ) ) {
//        return;
//    }
//
//    add_action( 'init', create_function( '$a', "remove_action( 'init', 'wp_version_check' );" ), 2 );
//    add_filter( 'pre_option_update_core', '__return_null' );
//    add_filter( 'pre_site_transient_update_core', '__return_null' );
//
//}
//
//add_action( 'after_setup_theme', 'remove_core_updates' );


// --------  ADD FEATURES IMAGES --------

if ( function_exists( 'add_theme_support' ) ) {

    //set_post_thumbnail_size( 2560, 2560, false );
    //add_image_size( 'full', 2560, 2560, false );
    //add_theme_support( 'full' );
    //add_image_size( 'fullHD', 1920, 1920, false );
    //add_theme_support( 'fullHD' );
    //add_image_size( 'post-thumbnails', 150, 150, true );
    //add_image_size( 'post-middle', 600 );

}


// --------  DELETE ADMIN BAR FRONT-END  --------

function remove_admin_bar() {
    show_admin_bar(false);
}

add_action('after_setup_theme', 'remove_admin_bar');


// --------  LOGOUT REDIRECT HOME  --------

function projectivemotion_logout_home($logouturl, $redir) {

    $redir = get_option('siteurl');
    return $logouturl . '&amp;redirect_to=' . urlencode($redir);

}

add_filter('logout_url', 'projectivemotion_logout_home', 10, 2);


// --------  CUSTOMS EXCERPT --------

function custom_excerpt($new_length = 20, $new_more = '...') {

  add_filter('excerpt_length', function () use ($new_length) {
    return $new_length;
  }, 999);

  add_filter('excerpt_more', function () use ($new_more) {
    return $new_more;
  });

  $output = get_the_excerpt();
  $output = apply_filters('wptexturize', $output);
  $output = apply_filters('convert_chars', $output);
  $output = str_replace('&nbsp;', '', $output); // quitamos los espacios en blanco generados por wordpress
  $output = '<p>' . $output . '</p>'; // insertamos el excerpt en un parrafo

  echo $output;

}

function custom_text_excerpt($text, $lenght, $more) {

    if(count($text)<$lenght){
        $more="";
    }

    $output = substr($text,0,$lenght);

    $output = apply_filters('wptexturize', $output);
    $output = apply_filters('convert_chars', $output);
    $output = str_replace('&nbsp;', '', $output); // quitamos los espacios en blanco generados por wordpress

    $output = '<p>' . $output.$more. '</p>'; // insertamos el excerpt en un parrafo

    return $output;

}


// --------  CUSTOM PAGE NAV --------

function custom_page_nav() {

  if( is_singular() )
    return;

  global $wp_query;

  /** Stop execution if there's only 1 page */
  if( $wp_query->max_num_pages <= 1 )
    return;

  $paged = get_query_var( 'paged' ) ? absint( get_query_var( 'paged' ) ) : 1;
  $max   = intval( $wp_query->max_num_pages );

  /**	Add current page to the array */
  if ( $paged >= 1 )
    $links[] = $paged;

  /**	Add the pages around the current page to the array */
  if ( $paged >= 3 ) {
    $links[] = $paged - 1;
    $links[] = $paged - 2;
  }

  if ( ( $paged + 2 ) <= $max ) {
    $links[] = $paged + 2;
    $links[] = $paged + 1;
  }

  echo '<div class="box-pagination">';

  /**	Previous Post Link */
  if ( get_previous_posts_link() )
        printf( '<a href="%s">%s</a>', esc_url(add_query_arg('pg', $paged - 1)), '<i class="fa fa-angle-left"></i>' );

  /**	Link to first page, plus ellipses if necessary */
  if ( ! in_array( 1, $links ) ) {
    $class = 1 == $paged ? ' class="active"' : '';
    printf( '<a href="%s"%s>%s</a>', esc_url(add_query_arg('pg', 1)), $class, '1' );
    if ( ! in_array( 2, $links ) )
      echo '...';
  }

  /**	Link to current page, plus 2 pages in either direction if necessary */
  sort( $links );
  foreach ( (array) $links as $link ) {
    $class = $paged == $link ? ' class="active"' : '';
    printf( '<a href="%s"%s>%s</a>', esc_url(add_query_arg('pg', $link)), $class, $link );
  }

  /**	Link to last page, plus ellipses if necessary */
  if ( ! in_array( $max, $links ) ) {
    if ( ! in_array( $max - 1, $links ) )
      echo '...';
    $class = $paged == $max ? ' class="active"' : '';
    printf( '<a href="%s"%s>%s</a>', esc_url(add_query_arg('pg', $max)), $class, $max );
  }

  /**	Next Post Link */
  if ( get_next_posts_link() )
        printf( '<a href="%s">%s</a>', esc_url(add_query_arg('pg', $paged + 1)), '<i class="fa fa-angle-right"></i>' );

  echo '</div>';

}


// --------  GET POST IMAGE --------

function post_image_size($id,$size = 'large') {
    global $post;
    $img = wp_get_attachment_image_src( get_post_thumbnail_id( $id ), $size );
    return $img[0];
}

function get_image_size($image = null, $size = 'large' ) {
    if ($image) {
        if (!array_key_exists($size, $image['sizes'])) {
            $size = 'large';
        }
        return $image['sizes'][$size];
    }
}


// --------  CACHE FILES  --------

function asset_cache($file) {
  return get_template_directory_uri() . $file . '?v=' . filemtime( get_template_directory() . $file );
}


//add_filter( 'get_archives_link', 'wpse_get_archives_link', 10, 6 );



// function wpse_get_archives_link(  $link_html, $url, $text, $format, $before, $after )
// {
//   $moi = str_replace("&nbsp;", '', $after);
//   $ses = preg_replace('/[0-9]+/', '', $text);
//     if( 'html' === $format )
//          $link_html = "\t<div class='month'><a class='moi' href='$url'><span>$ses</span></a><div class='month__line'></div><p class='month__number'>$moi</p></div>\n";
//
//     return $link_html;
// }
add_action('admin_head', 'my_custom_fonts'); // admin_head is a hook my_custom_fonts is a function we are adding it to the hook

function my_custom_fonts() {
  echo '<style>
    #categorydiv,#tagsdiv-post_tag{
        display:none;  
    }
	#messagetag .acf-label{
		display:none;
	}
	#messagetag .acf-input{
		background:#FF244C;
		padding:20px 12px;
		color:#FEF9F3;
	}
	#messagetag .acf-input p{
	margin:0;
	}
	
  </style>';
	
}

function get_tax_by_search($search_text){

  $args = array(
      'taxonomy'      => array( 'servicio' ), // taxonomy name
      'orderby'       => 'id', 
      'order'         => 'ASC',
      'hide_empty'    => true,
      'fields'        => 'all',
      'name__like'    => $search_text
  ); 
  
  $terms = get_terms( $args );
  
   $count = count($terms);
   if($count > 0){
       $tax='<div class="searchcontainer__el"><p>Servicios</p>';
       foreach ($terms as $term) {

        $title = str_replace($search_text,'<span>'.$search_text.'</span>',strtolower($term->name));
         $tax.='<a class="ajaxLoad" href="'.get_term_link( $term ).'">'.$title.'</a>';
  
       }
       $tax.="</div>";
   }
   return $tax;
  }
  
  // sample
  // get_tax_by_search('estrate');

?>
