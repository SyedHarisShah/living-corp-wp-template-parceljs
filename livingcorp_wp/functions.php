<?php

// -------- LOAD FUNCTION FILES --------

/*foreach (glob( __DIR__ . '/dev/*.php' ) as $filename) {
    require_once($filename);
}*/


require_once(locate_template('/dev/csskiller.php'));
//require_once(locate_template('/dev/theme.php'));
//require_once(locate_template('/dev/wpml.php'));
//require_once(locate_template('/dev/multisite.php'));
require_once(locate_template('/dev/option-pages.php'));
require_once(locate_template('/dev/post-types.php'));
require_once(locate_template('/dev/mailing.php'));
require_once(locate_template('/dev/ajax.php'));
require_once(locate_template('/dev/user.php'));
require_once(locate_template('/dev/json.php'));
require_once(locate_template('/dev/jsoncalls.php'));
//require_once(locate_template('/dev/acf.php'));
//add_action( 'wp_enqueue_scripts', 'js_scripts' );


// function js_scripts(){
//   // Enqueue the js script
//   wp_enqueue_script('scripts-js', get_template_directory_uri() . '/app.a6a4d504.js',filemtime( get_template_directory() .'/app.a6a4d504.js' ), false,true);
//   // Localize the enqueued JS script
//   wp_localize_script( 'scripts-js', 'ajax_object',
//     array(
//         'ajax_url' => admin_url( 'admin-ajax.php' ),
//         //'server_host' => $_SERVER[HTTP_HOST]
//          )
//     );
// }

//add_theme_support( 'post-thumbnails',array('post','page','experiencia') );

// register_nav_menus( array(
//   'header' => 'Header menu'
// ) );

function override_mce_options($initArray) {
    $opts = '*[*]';
    $initArray['valid_elements'] = $opts;
    $initArray['extended_valid_elements'] = $opts;
    return $initArray;
} 
add_filter('tiny_mce_before_init', 'override_mce_options');

//function add_file_types_to_uploads($file_types){
//  $new_filetypes = array();
//  $new_filetypes['svg'] = 'image/svg+xml';
//  $file_types = array_merge($file_types, $new_filetypes );
//  return $file_types;
//}
//add_action('upload_mimes', 'add_file_types_to_uploads');
//
//
//function sf_myme_types($mime_types){
//$mime_types['json'] = 'application/json';
//return $mime_types;
//}
//add_filter('upload_mimes', 'sf_myme_types', 1, 1);

function my_custom_mime_types( $mimes ) {
 
// New allowed mime types.
$mimes['svg'] = 'image/svg+xml';
$mimes['svgz'] = 'image/svg+xml';
$mimes['json'] = 'application/json';
 
// Optional. Remove a mime type.
//unset( $mimes['exe'] );
 
return $mimes;
}
add_filter( 'upload_mimes', 'my_custom_mime_types' );

//ELIMINAR GUTENBERG

add_filter('use_block_editor_for_post_type', '__return_false', 100);

/*pagination*/
// function mg_news_pagination_rewrite() {
//   add_rewrite_rule(get_option('category_base').'/page/?([0-9]{1,})/?$', 'index.php?pagename='.get_option('category_base').'&paged=$matches[1]', 'top');
// }
// add_action('init', 'mg_news_pagination_rewrite');

// function take_file($remote_url){
// $username = "";
// $password = "";

// // Create a stream
// $opts = array(
//   'http'=>array(
//     'method'=>"GET",
//     'header' => "Authorization: Basic " . base64_encode("$username:$password")
//   )
// );

// $context = stream_context_create($opts);

// // Open the file using the HTTP headers set above
// //$file = file_get_contents($remote_url, false, $context);
// $file = file_get_contents($remote_url);
// return $file;
// }


//TITULOS MODALES ACF
// function wpr_flexible_content_layout_title( $title, $field, $layout, $i ) {
//   if( $text = get_sub_field('titulo') ) {
//     $title = '<em>'.$title.'</em> - <strong>' . $text . '</strong>';
//   }
//   if( get_sub_field('modulo') ){
//     $module=get_sub_field('modulo');
//     $titulo_modulo=get_the_title($module);
//
//     $title = '<em>'.$title.'</em> - <strong>'.$titulo_modulo.'</strong>';
//     if($titulo_modulo!=''){
//     //$title = '<em>'.$title.'test</em> - <strong>' . $text . '</strong>';
//     }
//   }
//   return $title;
// }
// add_filter('acf/fields/flexible_content/layout_title/name=modulos', 'wpr_flexible_content_layout_title', 10, 4);

// function wpr_flexible_content_layout_menufooter( $title, $field, $layout, $i ) {
//   if( $text = get_sub_field('texto') ) {
//     $title = '<em>'.$title.'</em> - <strong>' . $text . '</strong>';
//   }
//   return $title;
// }
// add_filter('acf/fields/flexible_content/layout_title/name=menu_footer', 'wpr_flexible_content_layout_menufooter', 10, 4);



// function set_posts_per_page_for_cpt( $query ) {
//   if ( !is_admin() ) {
//     if(is_post_type_archive( 'receta' )){
//       $query->set( 'posts_per_page', '9' );
//     }

//   }
// }
//add_action( 'pre_get_posts', 'set_posts_per_page_for_cpt' );



// add_filter( 'acf_archive_post_types', 'change_acf_archive_cpt' );
// function change_acf_archive_cpt( $cpts ) {
//     // 'book' and 'movie' are the cpt key.
//
//     // Remove cpt
//     //unset( $cpts['book'] );
//
//     // Add cpt
//     $cpts['receta'] = "Receta archive";
//
//     return $cpts;
// }



remove_action( 'wp_head',      'rest_output_link_wp_head'              );
remove_action( 'template_redirect', 'rest_output_link_header', 11 );
remove_action( 'wp_head',      'wp_oembed_add_discovery_links'         );




remove_action( 'wp_head',             '_wp_render_title_tag',            1     );

remove_action( 'wp_head',             'rsd_link'                               );
remove_action( 'wp_head',             'feed_links_extra',                3     );
remove_action( 'wp_head',             'wp_enqueue_scripts',              1     );

remove_action( 'wp_head',             'wlwmanifest_link'                       );

remove_action( 'wp_head',             'adjacent_posts_rel_link_wp_head', 10, 0 );
remove_action( 'wp_head',             'locale_stylesheet'                      );

remove_action( 'wp_head','print_emoji_detection_script',7);
remove_action( 'wp_head', 'wp_print_styles', 8 );
remove_action( 'wp_head','wp_print_head_scripts',9);
remove_action( 'wp_head','wp_generator');
remove_action( 'wp_head','rel_canonical');


remove_action( 'wp_head', 'wp_shortlink_wp_head',10, 0 );


add_filter( 'oembed_response_data', 'disable_embeds_filter_oembed_response_data_' );
function disable_embeds_filter_oembed_response_data_( $data ) {
    unset($data['author_url']);
    unset($data['author_name']);
    return $data;
}

//NO COMMENTS

add_action( 'admin_init', 'my_remove_admin_menus' );
function my_remove_admin_menus() {
    remove_menu_page( 'edit-comments.php' );
}

add_action('admin_menu', 'remove_comment_support');

function remove_comment_support() {
    remove_post_type_support( 'post', 'comments' );
    remove_post_type_support( 'page', 'comments' );
}

?>
